import { apiClient } from '../../../shared/api/client';
import type { LoginResponse } from '../types/auth.types';

export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/api/login', { username, password });
  },
};
