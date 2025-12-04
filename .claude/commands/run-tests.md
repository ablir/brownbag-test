Run all tests (Vitest, Selenium, and Playwright) and send comprehensive email report with results.

Steps:
1. Load environment variables from `.env` file
2. Execute the unified test runner script: `.claude/scripts/run-all-tests.sh`
3. Report the overall test status to the user
4. If tests failed, display which test suites had failures
5. Confirm that email with detailed results was sent
