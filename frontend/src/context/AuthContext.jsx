import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyAdmin = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get('/admin/verify');
      setAdmin(data);
    } catch (error) {
      console.error('Session validation failed:', error.response?.data?.message || error.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyAdmin();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/admin/login', { email, password });
      localStorage.setItem('adminToken', data.token);
      setAdmin({ _id: data._id, username: data.username, email: data.email });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, verifyAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
