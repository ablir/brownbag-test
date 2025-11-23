import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login(username, password);

      if (response.success && response.username) {
        localStorage.setItem('username', response.username);
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        navigate('/user-info');
        return true;
      }
      setError(response.message || 'Login failed');
      return false;
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    navigate('/');
  };

  const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('username');
  };

  return {
    login,
    logout,
    isAuthenticated,
    loading,
    error,
  };
};
