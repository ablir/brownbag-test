#!/bin/bash

# Unified Test Runner Script
# Runs Vitest, Selenium, and Playwright tests and generates email report

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd ../.. && pwd )"

# Increase file descriptor limit for macOS (needed for Vitest with large dependencies like @mui/icons-material)
ulimit -n 65536

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "    Unified Test Runner Starting"
echo "========================================"
echo ""

# Create results directory
RESULTS_DIR=".test-results"
mkdir -p "$RESULTS_DIR"

# Function to check if servers are running
check_servers() {
  # Check backend
  if curl -s http://localhost:3001/api/health > /dev/null 2>&1 || curl -s http://localhost:3001 > /dev/null 2>&1; then
    return 0
  fi
  return 1
}

# Function to start servers
start_servers() {
  echo "${YELLOW}Starting application servers...${NC}"
  cd "$SCRIPT_DIR"
  ./start.sh

  # Wait for servers to be ready (max 30 seconds)
  echo "Waiting for servers to be ready..."
  for i in {1..30}; do
    if check_servers; then
      echo -e "${GREEN}✓ Servers are ready${NC}"
      return 0
    fi
    sleep 1
  done

  echo -e "${YELLOW}⚠ Servers may not be fully ready, continuing anyway...${NC}"
  return 0
}

# Function to stop servers
stop_servers() {
  echo "${YELLOW}Stopping application servers...${NC}"
  cd "$SCRIPT_DIR"
  ./stop.sh
}

# Check if servers are already running
SERVERS_WERE_RUNNING=false
if check_servers; then
  echo -e "${GREEN}✓ Servers already running${NC}"
  SERVERS_WERE_RUNNING=true
else
  start_servers
  SERVERS_STARTED=true
fi

echo ""

# Variables to track test results
VITEST_STATUS="NOT_RUN"
SELENIUM_STATUS="NOT_RUN"
PLAYWRIGHT_STATUS="NOT_RUN"

# Temporary files for test outputs
VITEST_OUTPUT="$RESULTS_DIR/vitest-output.txt"
SELENIUM_OUTPUT="$RESULTS_DIR/selenium-output.txt"
PLAYWRIGHT_OUTPUT="$RESULTS_DIR/playwright-output.txt"
COVERAGE_OUTPUT="$RESULTS_DIR/coverage-summary.json"

# Function to run Vitest tests
run_vitest() {
  echo "${YELLOW}[1/3] Running Vitest Unit Tests...${NC}"
  echo "------------------------------------"

  cd frontend

  if npm run test:coverage > "../$VITEST_OUTPUT" 2>&1; then
    VITEST_STATUS="${GREEN}PASSED${NC}"
    echo -e "${GREEN}✓ Vitest tests passed${NC}"
  else
    VITEST_STATUS="${RED}FAILED${NC}"
    echo -e "${RED}✗ Vitest tests failed${NC}"
  fi

  # Copy coverage summary
  if [ -f "coverage/coverage-summary.json" ]; then
    cp coverage/coverage-summary.json "../$COVERAGE_OUTPUT"
  fi

  cd ..
  echo ""
}

# Function to run Selenium tests
run_selenium() {
  echo "${YELLOW}[2/3] Running Selenium E2E Tests...${NC}"
  echo "------------------------------------"

  cd e2e

  # Install dependencies if needed
  if [ ! -d "node_modules" ]; then
    echo "Installing E2E test dependencies..."
    npm install --silent
  fi

  if npm run test:selenium > "../$SELENIUM_OUTPUT" 2>&1; then
    SELENIUM_STATUS="${GREEN}PASSED${NC}"
    echo -e "${GREEN}✓ Selenium tests passed${NC}"
  else
    SELENIUM_STATUS="${RED}FAILED${NC}"
    echo -e "${RED}✗ Selenium tests failed${NC}"
  fi

  cd ..
  echo ""
}

# Function to run Playwright tests
run_playwright() {
  echo "${YELLOW}[3/3] Running Playwright E2E Tests...${NC}"
  echo "------------------------------------"

  # Run the existing Playwright test
  if python3 .claude/scripts/run-playwright-test.py > "$PLAYWRIGHT_OUTPUT" 2>&1; then
    PLAYWRIGHT_STATUS="${GREEN}PASSED${NC}"
    echo -e "${GREEN}✓ Playwright tests passed${NC}"
  else
    PLAYWRIGHT_STATUS="${RED}FAILED${NC}"
    echo -e "${RED}✗ Playwright tests failed${NC}"
  fi

  echo ""
}

# Run all tests
run_vitest
run_selenium
run_playwright

# Generate summary
echo "========================================"
echo "         Test Results Summary"
echo "========================================"
echo -e "Vitest (Unit Tests):     $VITEST_STATUS"
echo -e "Selenium (E2E Tests):    $SELENIUM_STATUS"
echo -e "Playwright (E2E Tests):  $PLAYWRIGHT_STATUS"
echo "========================================"
echo ""

# Send email with results
echo "Sending email report..."
python3 .claude/scripts/send-test-results-email.py \
  "$VITEST_OUTPUT" \
  "$SELENIUM_OUTPUT" \
  "$PLAYWRIGHT_OUTPUT" \
  "$COVERAGE_OUTPUT"

# Stop servers if we started them
if [ "$SERVERS_STARTED" = true ]; then
  echo ""
  stop_servers
fi

echo -e "${GREEN}Test execution complete!${NC}"

# Determine exit code
EXIT_CODE=0
if [ "$VITEST_STATUS" = "${RED}FAILED${NC}" ] || \
   [ "$SELENIUM_STATUS" = "${RED}FAILED${NC}" ] || \
   [ "$PLAYWRIGHT_STATUS" = "${RED}FAILED${NC}" ]; then
  EXIT_CODE=1
fi

exit $EXIT_CODE
