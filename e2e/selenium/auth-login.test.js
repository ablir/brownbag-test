const { By, until } = require('selenium-webdriver');
const { createDriver } = require('./setup');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

describe('Selenium - Auth Login Flow', () => {
  let driver;

  beforeAll(async () => {
    driver = await createDriver();
  }, 30000);

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  describe('Login Page Rendering', () => {
    it('should load login page successfully', async () => {
      await driver.get(BASE_URL);

      const pageElement = await driver.wait(
        until.elementLocated(By.css('[data-testid="auth-login-page"]')),
        10000
      );

      expect(await pageElement.isDisplayed()).toBe(true);
    });

    it('should display sign in title', async () => {
      await driver.get(BASE_URL);

      const titleElement = await driver.wait(
        until.elementLocated(By.css('[data-testid="auth-login-page-title"]')),
        10000
      );

      const titleText = await titleElement.getText();
      expect(titleText).toBe('Sign In');
    });

    it('should display subtitle text', async () => {
      await driver.get(BASE_URL);

      const subtitleElement = await driver.wait(
        until.elementLocated(By.css('[data-testid="auth-login-page-subtitle"]')),
        10000
      );

      const subtitleText = await subtitleElement.getText();
      expect(subtitleText).toBe('Enter any credentials to continue');
    });

    it('should display login icon', async () => {
      await driver.get(BASE_URL);

      const iconElement = await driver.wait(
        until.elementLocated(By.css('[data-testid="auth-login-page-icon"]')),
        10000
      );

      expect(await iconElement.isDisplayed()).toBe(true);
    });
  });

  describe('Login Form Elements', () => {
    beforeEach(async () => {
      await driver.get(BASE_URL);
    });

    it('should display login form', async () => {
      const formElement = await driver.wait(
        until.elementLocated(By.css('[data-testid="auth-login-form"]')),
        10000
      );

      expect(await formElement.isDisplayed()).toBe(true);
    });

    it('should display username input field', async () => {
      const usernameInput = await driver.wait(
        until.elementLocated(By.css('[data-testid="auth-login-form-username-input"]')),
        10000
      );

      expect(await usernameInput.isDisplayed()).toBe(true);
      expect(await usernameInput.getAttribute('type')).toBe('text');
    });

    it('should display password input field', async () => {
      const passwordInput = await driver.wait(
        until.elementLocated(By.css('[data-testid="auth-login-form-password-input"]')),
        10000
      );

      expect(await passwordInput.isDisplayed()).toBe(true);
      expect(await passwordInput.getAttribute('type')).toBe('password');
    });

    it('should display submit button', async () => {
      const submitButton = await driver.wait(
        until.elementLocated(By.css('[data-testid="auth-login-form-submit"]')),
        10000
      );

      expect(await submitButton.isDisplayed()).toBe(true);
      const buttonText = await submitButton.getText();
      expect(buttonText.toUpperCase()).toContain('SIGN IN');
    });
  });

  describe('Login Form Interaction', () => {
    beforeEach(async () => {
      await driver.get(BASE_URL);
    });

    it('should allow typing in username field', async () => {
      const usernameInput = await driver.wait(
        until.elementLocated(By.css('[data-testid="auth-login-form-username-input"]')),
        10000
      );

      await usernameInput.clear();
      await usernameInput.sendKeys('testuser123');

      const value = await usernameInput.getAttribute('value');
      expect(value).toBe('testuser123');
    });

    it('should allow typing in password field', async () => {
      const passwordInput = await driver.wait(
        until.elementLocated(By.css('[data-testid="auth-login-form-password-input"]')),
        10000
      );

      await passwordInput.clear();
      await passwordInput.sendKeys('password456');

      const value = await passwordInput.getAttribute('value');
      expect(value).toBe('password456');
    });

    it('should navigate to user info page on successful login', async () => {
      const usernameInput = await driver.wait(
        until.elementLocated(By.css('[data-testid="auth-login-form-username-input"]')),
        10000
      );
      const passwordInput = await driver.findElement(
        By.css('[data-testid="auth-login-form-password-input"]')
      );
      const submitButton = await driver.findElement(
        By.css('[data-testid="auth-login-form-submit"]')
      );

      await usernameInput.clear();
      await usernameInput.sendKeys('testuser123');
      await passwordInput.clear();
      await passwordInput.sendKeys('password456');
      await submitButton.click();

      // Wait for navigation to user info page
      await driver.wait(until.urlContains('/user-info'), 10000);

      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('/user-info');
    });
  });

  describe('Form Validation', () => {
    beforeEach(async () => {
      await driver.get(BASE_URL);
    });

    it('should not submit with empty username', async () => {
      const passwordInput = await driver.wait(
        until.elementLocated(By.css('[data-testid="auth-login-form-password-input"]')),
        10000
      );
      const submitButton = await driver.findElement(
        By.css('[data-testid="auth-login-form-submit"]')
      );

      await passwordInput.clear();
      await passwordInput.sendKeys('password456');
      await submitButton.click();

      // Should still be on login page (HTML5 validation prevents submit)
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).not.toContain('/user-info');
    });

    it('should not submit with empty password', async () => {
      const usernameInput = await driver.wait(
        until.elementLocated(By.css('[data-testid="auth-login-form-username-input"]')),
        10000
      );
      const submitButton = await driver.findElement(
        By.css('[data-testid="auth-login-form-submit"]')
      );

      await usernameInput.clear();
      await usernameInput.sendKeys('testuser123');
      await submitButton.click();

      // Should still be on login page (HTML5 validation prevents submit)
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).not.toContain('/user-info');
    });
  });
});
