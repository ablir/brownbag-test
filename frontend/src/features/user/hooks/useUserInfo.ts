import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/userApi';
import type { UserInfo } from '../types/user.types';

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const username = localStorage.getItem('username');

      if (!username) {
        navigate('/');
        return;
      }

      try {
        const data = await userApi.getUserInfo(username);
        setUserInfo(data);
      } catch (err) {
        setError('Failed to load user information');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  return {
    userInfo,
    loading,
    error,
  };
};
