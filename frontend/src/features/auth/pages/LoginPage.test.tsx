import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import * as authApi from '../api/authApi';

// Mock the auth API
vi.mock('../api/authApi');

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('auth-login-page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful login by default
    vi.mocked(authApi.loginUser).mockResolvedValue({
      success: true,
      message: 'Login successful',
      token: 'mock-token',
      username: 'testuser',
    });
  });

  describe('Rendering', () => {
    it('should render login page with all elements', () => {
      renderWithRouter(<LoginPage />);

      expect(screen.getByTestId('auth-login-page')).toBeInTheDocument();
      expect(screen.getByTestId('auth-login-page-title')).toHaveTextContent('Sign In');
      expect(screen.getByTestId('auth-login-page-subtitle')).toHaveTextContent(
        'Enter any credentials to continue'
      );
      expect(screen.getByTestId('auth-login-page-icon')).toBeInTheDocument();
    });

    it('should render login form', () => {
      renderWithRouter(<LoginPage />);

      expect(screen.getByTestId('auth-login-form')).toBeInTheDocument();
      expect(screen.getByTestId('auth-login-form-username')).toBeInTheDocument();
      expect(screen.getByTestId('auth-login-form-password')).toBeInTheDocument();
      expect(screen.getByTestId('auth-login-form-submit')).toBeInTheDocument();
    });
  });

  describe('Form Interaction', () => {
    it('should allow user to type username', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByTestId('auth-login-form-username-input');
      await user.type(usernameInput, 'testuser123');

      expect(usernameInput).toHaveValue('testuser123');
    });

    it('should allow user to type password', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const passwordInput = screen.getByTestId('auth-login-form-password-input');
      await user.type(passwordInput, 'password456');

      expect(passwordInput).toHaveValue('password456');
    });

    it('should submit form with credentials', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByTestId('auth-login-form-username-input');
      const passwordInput = screen.getByTestId('auth-login-form-password-input');
      const submitButton = screen.getByTestId('auth-login-form-submit');

      await user.type(usernameInput, 'testuser123');
      await user.type(passwordInput, 'password456');
      await user.click(submitButton);

      await waitFor(() => {
        expect(authApi.loginUser).toHaveBeenCalledWith('testuser123', 'password456');
      });
    });
  });

  describe('Form Validation', () => {
    it('should not submit with empty username', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const passwordInput = screen.getByTestId('auth-login-form-password-input');
      const submitButton = screen.getByTestId('auth-login-form-submit');

      await user.type(passwordInput, 'password456');
      await user.click(submitButton);

      // Form should not submit (HTML5 validation)
      expect(authApi.loginUser).not.toHaveBeenCalled();
    });

    it('should not submit with empty password', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByTestId('auth-login-form-username-input');
      const submitButton = screen.getByTestId('auth-login-form-submit');

      await user.type(usernameInput, 'testuser123');
      await user.click(submitButton);

      // Form should not submit (HTML5 validation)
      expect(authApi.loginUser).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message on login failure', async () => {
      const user = userEvent.setup();
      vi.mocked(authApi.loginUser).mockRejectedValue(new Error('Invalid credentials'));

      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByTestId('auth-login-form-username-input');
      const passwordInput = screen.getByTestId('auth-login-form-password-input');
      const submitButton = screen.getByTestId('auth-login-form-submit');

      await user.type(usernameInput, 'wronguser');
      await user.type(passwordInput, 'wrongpass');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('auth-login-form-error')).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('should disable form inputs during loading', async () => {
      const user = userEvent.setup();
      // Make the API call slow
      vi.mocked(authApi.loginUser).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({
          success: true,
          message: 'Login successful',
          token: 'mock-token',
          username: 'testuser',
        }), 100))
      );

      renderWithRouter(<LoginPage />);

      const usernameInput = screen.getByTestId('auth-login-form-username-input');
      const passwordInput = screen.getByTestId('auth-login-form-password-input');
      const submitButton = screen.getByTestId('auth-login-form-submit');

      await user.type(usernameInput, 'testuser123');
      await user.type(passwordInput, 'password456');
      await user.click(submitButton);

      // During loading, button should be disabled
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });
});
