const { By, until } = require('selenium-webdriver');
const { createDriver } = require('./setup');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

describe('Selenium - User Info Page', () => {
  let driver;

  beforeAll(async () => {
    driver = await createDriver();
  }, 30000);

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  // Helper to login before each test
  async function login(username = 'testuser123', password = 'password456') {
    await driver.get(BASE_URL);

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
    await usernameInput.sendKeys(username);
    await passwordInput.clear();
    await passwordInput.sendKeys(password);
    await submitButton.click();

    // Wait for navigation
    await driver.wait(until.urlContains('/user-info'), 10000);
  }

  describe('User Info Page Rendering', () => {
    beforeEach(async () => {
      await login();
    });

    it('should load user info page successfully', async () => {
      const pageElement = await driver.wait(
        until.elementLocated(By.css('[data-testid="user-info-page"]')),
        10000
      );

      expect(await pageElement.isDisplayed()).toBe(true);
    });

    it('should display page title', async () => {
      const titleElement = await driver.wait(
        until.elementLocated(By.css('[data-testid="user-info-page-title"]')),
        10000
      );

      const titleText = await titleElement.getText();
      expect(titleText).toBe('User Profile');
    });

    it('should display logout button', async () => {
      const logoutButton = await driver.wait(
        until.elementLocated(By.css('[data-testid="user-info-page-logout"]')),
        10000
      );

      expect(await logoutButton.isDisplayed()).toBe(true);
      const buttonText = await logoutButton.getText();
      expect(buttonText.toUpperCase()).toContain('LOGOUT');
    });
  });

  describe('User Profile Card', () => {
    beforeEach(async () => {
      await login();
    });

    it('should display user profile card', async () => {
      const profileCard = await driver.wait(
        until.elementLocated(By.css('[data-testid="user-profile-card"]')),
        10000
      );

      expect(await profileCard.isDisplayed()).toBe(true);
    });

    it('should display user avatar', async () => {
      const avatar = await driver.wait(
        until.elementLocated(By.css('[data-testid="user-profile-card-avatar"]')),
        10000
      );

      expect(await avatar.isDisplayed()).toBe(true);
    });

    it('should display user name', async () => {
      const nameElement = await driver.wait(
        until.elementLocated(By.css('[data-testid="user-profile-card-name"]')),
        10000
      );

      expect(await nameElement.isDisplayed()).toBe(true);
      const nameText = await nameElement.getText();
      expect(nameText).toBeTruthy();
      expect(nameText.length).toBeGreaterThan(0);
    });

    it('should display username chip', async () => {
      const usernameChip = await driver.wait(
        until.elementLocated(By.css('[data-testid="user-profile-card-username"]')),
        10000
      );

      expect(await usernameChip.isDisplayed()).toBe(true);
      const chipText = await usernameChip.getText();
      expect(chipText).toBe('testuser123');
    });

    it('should display user bio', async () => {
      const bioElement = await driver.wait(
        until.elementLocated(By.css('[data-testid="user-profile-card-bio"]')),
        10000
      );

      expect(await bioElement.isDisplayed()).toBe(true);
      const bioText = await bioElement.getText();
      expect(bioText).toBeTruthy();
    });

    it('should display email information', async () => {
      const emailElement = await driver.wait(
        until.elementLocated(By.css('[data-testid="user-profile-card-email"]')),
        10000
      );

      expect(await emailElement.isDisplayed()).toBe(true);
    });

    it('should display phone information', async () => {
      const phoneElement = await driver.wait(
        until.elementLocated(By.css('[data-testid="user-profile-card-phone"]')),
        10000
      );

      expect(await phoneElement.isDisplayed()).toBe(true);
    });
  });

  describe('User Interactions', () => {
    beforeEach(async () => {
      await login();
    });

    it('should logout and return to login page when logout button clicked', async () => {
      const logoutButton = await driver.wait(
        until.elementLocated(By.css('[data-testid="user-info-page-logout"]')),
        10000
      );

      await logoutButton.click();

      // Wait for navigation to login page
      await driver.wait(async () => {
        const url = await driver.getCurrentUrl();
        return url === BASE_URL + '/' || !url.includes('/user-info');
      }, 10000);

      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).not.toContain('/user-info');

      // Verify login page is displayed
      const loginPage = await driver.wait(
        until.elementLocated(By.css('[data-testid="auth-login-page"]')),
        10000
      );

      expect(await loginPage.isDisplayed()).toBe(true);
    });
  });

  describe('Data Persistence', () => {
    it('should display consistent username across login', async () => {
      await login('consistentuser', 'password123');

      const usernameChip = await driver.wait(
        until.elementLocated(By.css('[data-testid="user-profile-card-username"]')),
        10000
      );

      const chipText = await usernameChip.getText();
      expect(chipText).toBe('consistentuser');
    });
  });

  describe('Loading State', () => {
    it('should not display loading spinner after data loads', async () => {
      await login();

      // Wait for page to load
      await driver.wait(
        until.elementLocated(By.css('[data-testid="user-info-page"]')),
        10000
      );

      // Loading spinner should not be present
      const elements = await driver.findElements(
        By.css('[data-testid="user-info-page-loading"]')
      );

      expect(elements.length).toBe(0);
    });
  });
});
