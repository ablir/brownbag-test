import { apiClient } from '../../../shared/api/client';
import type { UserInfo } from '../types/user.types';

export const userApi = {
  getUserInfo: async (username: string): Promise<UserInfo> => {
    return apiClient.get<UserInfo>(`/api/user/info?username=${encodeURIComponent(username)}`);
  },
};
