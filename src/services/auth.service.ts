import { apiClient, setAuthToken, removeAuthToken, getAuthToken } from '@/lib/api-client';
import type { LoginCredentials, LoginResponse, User } from '@/types';

const AUTH_USER_KEY = 'ima_auth_user';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
    setAuthToken(data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    return data;
  },

  logout(): void {
    removeAuthToken();
    localStorage.removeItem(AUTH_USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!getAuthToken();
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },
};
