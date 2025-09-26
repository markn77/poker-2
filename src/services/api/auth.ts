// src/services/api/auth.ts
import { LoginCredentials, RegisterCredentials, User } from '../../types/auth';

// Use a relative base URL in production (same origin), keep localhost for dev
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? ''                     // relative — `/api/...` will hit the same origin that served the page
  : 'http://localhost:3001';

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Store JWT token in localStorage
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }
        return data;
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      // Client-side validation
      if (credentials.password !== credentials.confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      if (credentials.password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters' };
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username.trim(),
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Store JWT token in localStorage
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }
        return data;
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  static async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Call backend logout endpoint (optional, since JWT is stateless)
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always remove token from localStorage
      localStorage.removeItem('auth_token');
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.user;
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('auth_token');
        return null;
      }
    } catch (error) {
      console.error('Get current user error:', error);
      localStorage.removeItem('auth_token');
      return null;
    }
  }

  static getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}