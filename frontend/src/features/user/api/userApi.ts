import { apiClient } from '../../../shared/api/client';
import type { UserInfo } from '../types/user.types';

export const getUserInfo = async (username: string): Promise<UserInfo> => {
  return apiClient.get<UserInfo>(`/api/user/info?username=${encodeURIComponent(username)}`);
};

export const userApi = {
  getUserInfo,
};
