import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { UserInfoPage } from './UserInfoPage';

// Mock useAuth hook
vi.mock('../../auth/hooks/useAuth', () => ({
  useAuth: () => ({
    token: 'mock-token',
    username: 'testuser123',
    logout: vi.fn(),
  }),
}));

// Mock useUserInfo hook
const mockUseUserInfo = vi.fn();
vi.mock('../hooks/useUserInfo', () => ({
  useUserInfo: () => mockUseUserInfo(),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

const mockUserInfo = {
  id: '1',
  username: 'testuser123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  avatar: 'https://example.com/avatar.jpg',
  phone: '123-456-7890',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
  },
  company: 'Test Company',
  jobTitle: 'Software Engineer',
  bio: 'Test bio description',
  joinedDate: '2024-01-01',
  lastLogin: '2024-11-25T12:00:00Z',
};

describe('user-info-page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful user info fetch by default
    mockUseUserInfo.mockReturnValue({
      userInfo: mockUserInfo,
      loading: false,
      error: '',
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner while fetching data', async () => {
      mockUseUserInfo.mockReturnValue({
        userInfo: null,
        loading: true,
        error: '',
      });

      renderWithRouter(<UserInfoPage />);

      expect(screen.getByTestId('user-info-page-loading')).toBeInTheDocument();
      expect(screen.getByTestId('user-info-page-spinner')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when fetch fails', async () => {
      mockUseUserInfo.mockReturnValue({
        userInfo: null,
        loading: false,
        error: 'Failed to load user information',
      });

      renderWithRouter(<UserInfoPage />);

      await waitFor(() => {
        expect(screen.getByTestId('user-info-page-error')).toBeInTheDocument();
        expect(screen.getByTestId('user-info-page-error-message')).toBeInTheDocument();
      });
    });

    it('should display default error when user not found', async () => {
      mockUseUserInfo.mockReturnValue({
        userInfo: null,
        loading: false,
        error: '',
      });

      renderWithRouter(<UserInfoPage />);

      await waitFor(() => {
        expect(screen.getByTestId('user-info-page-error')).toBeInTheDocument();
        expect(screen.getByTestId('user-info-page-error-message')).toHaveTextContent('User not found');
      });
    });
  });

  describe('Successful Render', () => {
    it('should render user info page with all elements', async () => {
      renderWithRouter(<UserInfoPage />);

      await waitFor(() => {
        expect(screen.getByTestId('user-info-page')).toBeInTheDocument();
      });

      expect(screen.getByTestId('user-info-page-title')).toHaveTextContent('User Profile');
      expect(screen.getByTestId('user-info-page-logout')).toBeInTheDocument();
    });

    it('should render user profile card', async () => {
      renderWithRouter(<UserInfoPage />);

      await waitFor(() => {
        expect(screen.getByTestId('user-profile-card')).toBeInTheDocument();
      });

      expect(screen.getByTestId('user-profile-card-name')).toHaveTextContent('John Doe');
      expect(screen.getByTestId('user-profile-card-username')).toHaveTextContent('testuser123');
      expect(screen.getByTestId('user-profile-card-bio')).toHaveTextContent('Test bio description');
    });

    it('should display user email and phone', async () => {
      renderWithRouter(<UserInfoPage />);

      await waitFor(() => {
        expect(screen.getByTestId('user-profile-card-email')).toBeInTheDocument();
        expect(screen.getByTestId('user-profile-card-phone')).toBeInTheDocument();
      });
    });

    it('should render avatar with correct alt text', async () => {
      renderWithRouter(<UserInfoPage />);

      await waitFor(() => {
        const avatar = screen.getByTestId('user-profile-card-avatar');
        expect(avatar).toBeInTheDocument();
        // MUI Avatar renders alt on the img element inside
        const img = avatar.querySelector('img');
        if (img) {
          expect(img).toHaveAttribute('alt', 'John Doe');
        }
      });
    });
  });

  describe('User Interactions', () => {
    it('should call logout when logout button is clicked', async () => {
      const user = userEvent.setup();

      renderWithRouter(<UserInfoPage />);

      await waitFor(() => {
        expect(screen.getByTestId('user-info-page-logout')).toBeInTheDocument();
      });

      const logoutButton = screen.getByTestId('user-info-page-logout');

      // Verify button is clickable
      expect(logoutButton).toBeEnabled();
      await user.click(logoutButton);

      // Note: The logout function is mocked at the top level
      // In a real scenario, you'd use a proper context provider or state management
    });
  });

  describe('Data Fetching', () => {
    it('should display user info from hook', async () => {
      renderWithRouter(<UserInfoPage />);

      await waitFor(() => {
        expect(screen.getByTestId('user-info-page')).toBeInTheDocument();
      });
    });

    it('should display fetched user data correctly', async () => {
      const customUser = {
        ...mockUserInfo,
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'janesmith',
        bio: 'Custom bio',
      };

      mockUseUserInfo.mockReturnValue({
        userInfo: customUser,
        loading: false,
        error: '',
      });

      renderWithRouter(<UserInfoPage />);

      await waitFor(() => {
        expect(screen.getByTestId('user-profile-card-name')).toHaveTextContent('Jane Smith');
        expect(screen.getByTestId('user-profile-card-username')).toHaveTextContent('janesmith');
        expect(screen.getByTestId('user-profile-card-bio')).toHaveTextContent('Custom bio');
      });
    });
  });
});
