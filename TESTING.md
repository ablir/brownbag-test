# Testing Documentation

Comprehensive testing setup for the Brownbag monorepo using Vitest, Selenium WebDriver, and Playwright.

## Table of Contents
- [Overview](#overview)
- [Test Types](#test-types)
- [Test Naming Convention](#test-naming-convention)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Email Reports](#email-reports)
- [Coverage Requirements](#coverage-requirements)

## Overview

This project uses three testing frameworks to ensure comprehensive test coverage:

1. **Vitest** - Unit and component tests
2. **Selenium WebDriver** - End-to-end browser automation tests
3. **Playwright MCP** - Integration tests with screenshot capture

All tests automatically send email reports with results and coverage metrics.

## Test Types

### 1. Unit Tests (Vitest + React Testing Library)

**Location**: `frontend/src/features/{feature}/**/*.test.tsx`

**Purpose**: Test individual components and functions in isolation

**Features**:
- Component rendering tests
- User interaction tests
- Form validation
- Error handling
- Loading states
- Mock API calls

**Example**:
```typescript
// frontend/src/features/auth/pages/LoginPage.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoginPage } from './LoginPage';

describe('auth-login-page', () => {
  it('should render login page with all elements', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('auth-login-page')).toBeInTheDocument();
  });
});
```

### 2. E2E Tests (Selenium WebDriver)

**Location**: `e2e/selenium/*.test.js`

**Purpose**: Test complete user flows in a real browser

**Features**:
- Full browser automation
- Multi-page workflows
- Form submissions
- Navigation testing
- Element interaction

**Example**:
```javascript
// e2e/selenium/auth-login.test.js
const { By, until } = require('selenium-webdriver');

describe('Selenium - Auth Login Flow', () => {
  it('should navigate to user info page on successful login', async () => {
    await driver.get('http://localhost:5173');
    const usernameInput = await driver.findElement(
      By.css('[data-testid="auth-login-form-username-input"]')
    );
    await usernameInput.sendKeys('testuser123');
    // ... rest of test
  });
});
```

### 3. Integration Tests (Playwright MCP)

**Location**: `.claude/commands/test-*.md`

**Purpose**: Test complete workflows with screenshot capture

**Features**:
- Browser automation via MCP
- Screenshot capture at key points
- Email reports with attached screenshots
- Visual regression testing capability

## Test Naming Convention

### data-testid Naming Scheme

All testable elements follow Feature-Driven Development (FDD) naming:

**Format**: `{feature}-{component/page}-{element}`

**Examples**:
- `auth-login-page` - Login page container
- `auth-login-form-username` - Username text field
- `auth-login-form-submit` - Submit button
- `user-info-page-title` - User info page title
- `user-profile-card-avatar` - User avatar image

**Benefits**:
- Consistent across all test types
- Easy to locate elements
- Clear feature association
- Self-documenting

### Test File Naming

- **Unit tests**: `{ComponentName}.test.tsx`
- **E2E tests**: `{feature}-{flow}.test.js`
- **Commands**: `test-{feature}.md`

## Running Tests

### Run All Tests

Run all test suites and send email report:

```bash
/run-tests
```

Or manually:

```bash
.claude/scripts/run-all-tests.sh
```

### Run Individual Test Suites

**Vitest (Unit Tests)**:
```bash
cd frontend
npm test                    # Run once
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage
npm run test:ui             # Interactive UI
```

**Selenium (E2E Tests)**:
```bash
cd e2e
npm run test:selenium       # Run all E2E tests
npm run test:selenium:verbose  # Verbose output
```

**Playwright (Integration)**:
```bash
/test-login                 # Login flow with screenshots
```

### Prerequisites

Before running tests:

1. **Start the application**:
```bash
./start.sh
```

2. **Ensure environment variables are set**:
```bash
# .env file should contain:
GMAIL_SENDER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
TEST_EMAIL_RECIPIENT=recipient@example.com
```

## Writing Tests

### Adding Tests to Existing Features

1. **Identify testable elements** in the component
2. **Add data-testid attributes** following FDD naming
3. **Write unit tests** in `*.test.tsx` files
4. **Write E2E tests** in `e2e/selenium/*.test.js`
5. **Update or create Playwright command** if needed

### Creating Tests for New Features

Use the `/generate-tests` command:

```bash
/generate-tests
```

This will:
- Analyze your feature code
- Add missing data-testid attributes
- Generate Vitest unit tests
- Generate Selenium E2E tests
- Create Playwright integration command
- Generate test documentation

### Test Structure

**Unit Test Structure**:
```typescript
describe('{feature}-{component}', () => {
  describe('Rendering', () => {
    it('should render with all elements', () => {});
  });

  describe('User Interactions', () => {
    it('should handle button clicks', () => {});
  });

  describe('Error Handling', () => {
    it('should display error messages', () => {});
  });

  describe('Loading States', () => {
    it('should show loading spinner', () => {});
  });
});
```

**E2E Test Structure**:
```javascript
describe('Selenium - {Feature} {Flow}', () => {
  beforeAll(async () => {
    driver = await createDriver();
  });

  afterAll(async () => {
    await driver.quit();
  });

  describe('Page Rendering', () => {
    it('should load page successfully', async () => {});
  });

  describe('User Interactions', () => {
    it('should complete flow', async () => {});
  });
});
```

## Email Reports

### Automated Email Reports

All test runs automatically send email reports containing:

- **Overall Summary**: Total tests, passed, failed, success rate
- **Vitest Results**: Unit test results and failures
- **Selenium Results**: E2E test results and failures
- **Playwright Results**: Integration test results
- **Code Coverage**: Lines, statements, functions, branches percentages
- **Failed Tests Only**: Detailed failure information for debugging

### Email Configuration

Configure in `.env`:
```env
GMAIL_SENDER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
TEST_EMAIL_RECIPIENT=recipient@example.com
```

### Email Format

- **HTML formatted** for readability
- **Color-coded** status indicators
- **Expandable sections** for failures
- **Coverage table** with visual indicators
- **Timestamp** for each test run

## Coverage Requirements

### Minimum Coverage Thresholds

Configured in `frontend/vitest.config.ts`:

- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

### Viewing Coverage Reports

**In Terminal**:
```bash
cd frontend
npm run test:coverage
```

**HTML Report**:
```bash
cd frontend
npm run test:coverage
open coverage/index.html
```

**Coverage in Email**: Automatically included in test result emails

### Coverage Best Practices

1. **Test all user-facing functionality**
2. **Test error scenarios**
3. **Test loading and success states**
4. **Test form validation**
5. **Test API interactions** (with mocks)
6. **Exclude test files** from coverage
7. **Focus on business logic** over boilerplate

## Test Data

### Mock Data

- **Faker.js** generates realistic test data
- **Consistent usernames** across test runs
- **Mock API responses** in unit tests
- **Test credentials**: `testuser123` / `password456`

### Test Users

```javascript
// Standard test user
username: 'testuser123'
password: 'password456'

// Custom test users (any credentials work)
username: 'your-username'
password: 'your-password'
```

## Continuous Integration

### Pre-commit Checks

Consider adding to git hooks:
```bash
npm run test         # Run tests before commit
npm run lint         # Lint code
npm run format       # Format code
```

### CI/CD Integration

The test runner script can be integrated with CI/CD:
```yaml
# Example GitHub Actions
- name: Run All Tests
  run: .claude/scripts/run-all-tests.sh
```

## Troubleshooting

### Tests Failing

1. **Check application is running**: `./start.sh`
2. **Verify dependencies**: `npm install` in frontend and e2e
3. **Check environment variables**: `.env` file configured
4. **Clear test cache**: `npm run test -- --clearCache`

### Selenium Issues

1. **ChromeDriver version**: Ensure compatible with your Chrome version
2. **Headless mode**: Tests run in headless mode by default
3. **Port conflicts**: Ensure localhost:5173 is available

### Email Not Sending

1. **Check credentials**: Verify `.env` file
2. **Gmail App Password**: Must use App Password, not regular password
3. **2FA enabled**: Required for App Passwords
4. **Test SMTP**: Verify Gmail SMTP access

## Commands Reference

| Command | Description |
|---------|-------------|
| `/run-tests` | Run all tests and send email report |
| `/test-login` | Run Playwright login flow test |
| `/generate-tests` | Generate tests for a feature |
| `npm test` | Run Vitest unit tests |
| `npm run test:selenium` | Run Selenium E2E tests |

## File Structure

```
Brownbag/
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── LoginPage.tsx
│   │   │   │   │   └── LoginPage.test.tsx
│   │   │   │   └── components/
│   │   │   │       ├── LoginForm.tsx
│   │   │   │       └── LoginForm.test.tsx
│   │   │   └── user/
│   │   │       ├── pages/
│   │   │       │   ├── UserInfoPage.tsx
│   │   │       │   └── UserInfoPage.test.tsx
│   │   │       └── components/
│   │   │           └── UserProfileCard.tsx
│   │   └── test/
│   │       └── setup.ts
│   ├── vitest.config.ts
│   └── package.json
├── e2e/
│   ├── selenium/
│   │   ├── setup.js
│   │   ├── jest.config.js
│   │   ├── auth-login.test.js
│   │   └── user-info.test.js
│   └── package.json
├── .claude/
│   ├── commands/
│   │   ├── run-tests.md
│   │   ├── test-login.md
│   │   └── generate-tests.md
│   └── scripts/
│       ├── run-all-tests.sh
│       ├── send-test-results-email.py
│       └── run-playwright-test.py
└── TESTING.md (this file)
```

## Contributing

When adding new features:

1. Add `data-testid` attributes to all testable elements
2. Write unit tests for components
3. Write E2E tests for user flows
4. Maintain 70%+ code coverage
5. Run `/generate-tests` for comprehensive test generation
6. Verify tests pass before creating PR

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/)
- [Playwright](https://playwright.dev/)
- [Jest Matchers](https://jestjs.io/docs/expect)
