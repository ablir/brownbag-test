You are helping to generate comprehensive test scenarios for a recently developed feature in the Brownbag monorepo.

Follow these steps:

1. **Identify the Feature:**
   - Ask the user which feature they want to generate tests for
   - Determine the feature location (auth, user, or new feature)
   - Identify relevant components, pages, and API endpoints

2. **Analyze Existing Code:**
   - Read the component/page files in the feature directory
   - Identify all interactive elements and user flows
   - Note any data-testid attributes already present

3. **Add Missing data-testid Attributes:**
   - Following the FDD naming scheme: `{feature}-{component}-{element}`
   - Examples:
     - `auth-login-form-username`
     - `user-profile-card-avatar`
     - `dashboard-stats-card-title`
   - Add to all testable elements (inputs, buttons, containers, text elements)

4. **Generate Three Test Suites:**

   **A. Vitest Unit Tests** (frontend/src/features/{feature}/.../*.test.tsx)
   - Component rendering tests
   - User interaction tests
   - Form validation tests
   - Error handling tests
   - Loading states
   - Data display tests

   **B. Selenium E2E Tests** (e2e/selenium/{feature}.test.js)
   - Page navigation tests
   - Form interaction tests
   - Element visibility tests
   - User flow tests
   - Cross-browser compatibility tests

   **C. Playwright Integration Tests** (Update .claude/commands/test-{feature}.md)
   - Similar to existing /test-login command
   - Screenshot capture at key points
   - Email results automatically

5. **Test Coverage Requirements:**
   - Minimum 70% code coverage for the feature
   - Test all user-facing functionality
   - Test error scenarios
   - Test loading and success states
   - Test data validation

6. **Generate Test Documentation:**
   - Create {feature}-tests.md documenting:
     - Test scenarios covered
     - Test data used
     - Expected behaviors
     - Known limitations

7. **Create Test Execution Command:**
   - Add npm script to run feature-specific tests
   - Integrate with unified test runner

After generating all tests:
- Run the tests to verify they work
- Fix any failing tests
- Update coverage reports
- Send email with test results

Ask the user: "Which feature would you like to generate tests for?"
