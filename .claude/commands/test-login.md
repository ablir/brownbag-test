Use the MCP Playwright tools to test the login flow:

1. Navigate to http://localhost:5173
2. Take a screenshot of the initial login page and save it as `01-login-page.png`
3. Fill in the login form with random credentials:
   - Username: `testuser123`
   - Password: `password456`
4. Take a screenshot of the filled form and save it as `02-filled-login-form.png`
5. Click the "Sign In" button
6. Take a screenshot of the resulting page and save it as `03-user-profile-page.png`

All screenshots should be saved to the `.playwright-mcp/` directory.

After completing the test and taking screenshots:
7. Load environment variables from `.env` file
8. Run the email script to send screenshots: `.claude/scripts/send-test-email.py .playwright-mcp/.playwright-mcp/`
9. Report email sending status to the user
