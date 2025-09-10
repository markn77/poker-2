import { create } from 'zustand';
import { AuthState, LoginCredentials, RegisterCredentials } from '../types/auth';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Replace with actual API call
      console.log('Login attempt:', credentials);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser = {
        id: '1',
        email: credentials.email,
        username: 'TestUser',
        createdAt: new Date().toISOString()
      };
      
      set({ 
        user: mockUser, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
      
    } catch (error) {
      set({ 
        error: 'Login failed. Please check your credentials.', 
        isLoading: false 
      });
    }
  },

  register: async (credentials: RegisterCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      // TODO: Replace with actual API call
      console.log('Register attempt:', credentials);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const mockUser = {
        id: '1',
        email: credentials.email,
        username: credentials.username,
        createdAt: new Date().toISOString()
      };
      
      set({ 
        user: mockUser, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
      
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Registration failed', 
        isLoading: false 
      });
    }
  },

  logout: () => {
    set({ 
      user: null, 
      isAuthenticated: false, 
      error: null 
    });
  },

  clearError: () => {
    set({ error: null });
  }
}));