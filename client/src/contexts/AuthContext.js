import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Set up axios default auth header
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Fetch current user
  const { data: currentUser, isLoading } = useQuery(
    ['user', token],
    async () => {
      if (!token) return null;
      const response = await api.get('/api/auth/me');
      return response.data.user;
    },
    {
      enabled: !!token,
      retry: false,
      onError: () => {
        // Token is invalid, clear it
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
      },
      onSuccess: data => {
        setUser(data);
      },
    }
  );

  // Login mutation
  const loginMutation = useMutation(
    async credentials => {
      const response = await api.post('/api/auth/login', credentials);
      return response.data;
    },
    {
      onSuccess: data => {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        toast.success('Login successful!');
        navigate('/');
      },
      onError: error => {
        toast.error(error.response?.data?.error || 'Login failed');
      },
    }
  );

  // Register mutation
  const registerMutation = useMutation(
    async userData => {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    },
    {
      onSuccess: data => {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        toast.success('Registration successful!');
        navigate('/');
      },
      onError: error => {
        toast.error(error.response?.data?.error || 'Registration failed');
      },
    }
  );

  // Update profile mutation
  const updateProfileMutation = useMutation(
    async profileData => {
      const response = await api.put('/api/auth/profile', profileData);
      return response.data;
    },
    {
      onSuccess: data => {
        setUser(data.user);
        queryClient.invalidateQueries(['user']);
        toast.success('Profile updated successfully!');
      },
      onError: error => {
        toast.error(error.response?.data?.error || 'Failed to update profile');
      },
    }
  );

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    queryClient.clear();
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Login function
  const login = credentials => {
    loginMutation.mutate(credentials);
  };

  // Register function
  const register = userData => {
    registerMutation.mutate(userData);
  };

  // Update profile function
  const updateProfile = profileData => {
    updateProfileMutation.mutate(profileData);
  };

  // Social authentication functions
  const loginWithGoogle = async () => {
    try {
      // Redirect to Google OAuth
      window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
    } catch (error) {
      throw new Error('Failed to initiate Google authentication');
    }
  };

  const loginWithTwitter = async () => {
    try {
      // Redirect to Twitter OAuth
      window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/twitter`;
    } catch (error) {
      throw new Error('Failed to initiate Twitter authentication');
    }
  };

  const loginWithInstagram = async () => {
    try {
      // Redirect to Instagram OAuth
      window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/instagram`;
    } catch (error) {
      throw new Error('Failed to initiate Instagram authentication');
    }
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    loginWithGoogle,
    loginWithTwitter,
    loginWithInstagram,
    setToken,
    setUser,
    isAuthenticated: !!token && !!user,
    loginMutation,
    registerMutation,
    updateProfileMutation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
