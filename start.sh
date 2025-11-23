#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Brownbag Monorepo...${NC}"

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if node_modules exist
if [ ! -d "$SCRIPT_DIR/backend/node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    cd "$SCRIPT_DIR/backend" && npm install
fi

if [ ! -d "$SCRIPT_DIR/frontend/node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd "$SCRIPT_DIR/frontend" && npm install
fi

# Start backend
echo -e "${GREEN}Starting backend on port 3001...${NC}"
cd "$SCRIPT_DIR/backend"
npm run dev > "$SCRIPT_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$SCRIPT_DIR/.backend.pid"

# Wait a moment for backend to start
sleep 2

# Start frontend
echo -e "${GREEN}Starting frontend on port 5173...${NC}"
cd "$SCRIPT_DIR/frontend"
npm run dev > "$SCRIPT_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > "$SCRIPT_DIR/.frontend.pid"

# Wait a moment for frontend to start
sleep 3

# Start nginx if available
if command -v nginx &> /dev/null; then
    echo -e "${GREEN}Starting nginx on port 9898...${NC}"
    nginx -c "$SCRIPT_DIR/nginx/nginx.conf" -p "$SCRIPT_DIR/nginx/" > "$SCRIPT_DIR/nginx.log" 2>&1 &
    NGINX_PID=$!
    echo $NGINX_PID > "$SCRIPT_DIR/.nginx.pid"
    NGINX_STATUS="http://localhost:9898 (PID: $NGINX_PID)"
else
    echo -e "${YELLOW}⚠ Nginx not installed - skipping reverse proxy${NC}"
    echo -e "${YELLOW}  Install with: brew install nginx${NC}"
    NGINX_STATUS="Not running (nginx not installed)"
fi

echo -e "${GREEN}✓ Services started!${NC}"
echo ""
echo "Services running:"
echo "  - Backend:  http://localhost:3001 (PID: $BACKEND_PID)"
echo "  - Frontend: http://localhost:5173 (PID: $FRONTEND_PID)"
echo "  - Nginx:    $NGINX_STATUS"
echo ""
echo "Access your application:"
if command -v nginx &> /dev/null; then
    echo "  - Main:     http://localhost:9898 (via nginx)"
fi
echo "  - Frontend: http://localhost:5173 (direct)"
echo "  - Backend:  http://localhost:3001 (API)"
echo ""
echo "Logs:"
echo "  - Backend:  tail -f $SCRIPT_DIR/backend.log"
echo "  - Frontend: tail -f $SCRIPT_DIR/frontend.log"
if command -v nginx &> /dev/null; then
    echo "  - Nginx:    tail -f $SCRIPT_DIR/nginx.log"
fi
echo ""
echo "To stop all services, run: ./stop.sh"
