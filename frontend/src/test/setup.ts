import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import * as React from 'react';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Mock @mui/icons-material to avoid loading thousands of icon files
// Icons accept props including sx and data-testid
vi.mock('@mui/icons-material', () => ({
  Login: (props: any) => React.createElement('svg', { ...props, 'data-icon': 'LoginIcon' }),
  Logout: (props: any) => React.createElement('svg', { ...props, 'data-icon': 'LogoutIcon' }),
  Email: (props: any) => React.createElement('svg', { ...props, 'data-icon': 'EmailIcon' }),
  Phone: (props: any) => React.createElement('svg', { ...props, 'data-icon': 'PhoneIcon' }),
  Work: (props: any) => React.createElement('svg', { ...props, 'data-icon': 'WorkIcon' }),
  Home: (props: any) => React.createElement('svg', { ...props, 'data-icon': 'HomeIcon' }),
  CalendarToday: (props: any) => React.createElement('svg', { ...props, 'data-icon': 'CalendarTodayIcon' }),
  AccessTime: (props: any) => React.createElement('svg', { ...props, 'data-icon': 'AccessTimeIcon' }),
  Person: (props: any) => React.createElement('svg', { ...props, 'data-icon': 'PersonIcon' }),
  Business: (props: any) => React.createElement('svg', { ...props, 'data-icon': 'BusinessIcon' }),
  LocationOn: (props: any) => React.createElement('svg', { ...props, 'data-icon': 'LocationOnIcon' }),
}));

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
