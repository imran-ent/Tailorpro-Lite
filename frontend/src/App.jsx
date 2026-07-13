import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ManageDresses from './pages/ManageDresses';
import ManageOrders from './pages/ManageOrders';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="app-container">
            <Header />
            <main className="main-content">
              <Routes>
                {/* Public Landers */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Admin Auth Access */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                {/* Protected Admin Panels */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/dresses" 
                  element={
                    <ProtectedRoute>
                      <ManageDresses />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/orders" 
                  element={
                    <ProtectedRoute>
                      <ManageOrders />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Fallback to homepage */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
