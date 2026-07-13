import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import AdminSidebar from '../components/AdminSidebar';
import { ToastContext } from '../context/ToastContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDresses: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [dressesRes, ordersRes] = await Promise.all([
        api.get('/dresses'),
        api.get('/orders'),
      ]);

      const dresses = dressesRes.data;
      const orders = ordersRes.data;

      const totalDresses = dresses.length;
      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
      const completedOrders = orders.filter((o) => o.status === 'Done').length;

      setStats({
        totalDresses,
        totalOrders,
        pendingOrders,
        completedOrders,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      showToast('Failed to load dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <h2>Dashboard Overview</h2>
          <p>Real-time analytics and tailoring business operations overview.</p>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="spinner"></div>
            <p>Gathering latest reports...</p>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon-wrapper blue">👗</div>
                <div className="stat-details">
                  <h3>Total Dresses</h3>
                  <span className="stat-number">{stats.totalDresses}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper orange">📦</div>
                <div className="stat-details">
                  <h3>Total Orders</h3>
                  <span className="stat-number">{stats.totalOrders}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper red">🪡</div>
                <div className="stat-details">
                  <h3>Pending Orders</h3>
                  <span className="stat-number">{stats.pendingOrders}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper green">✓</div>
                <div className="stat-details">
                  <h3>Completed Orders</h3>
                  <span className="stat-number">{stats.completedOrders}</span>
                </div>
              </div>
            </div>

            <div className="dashboard-content-box">
              <h3>TailorPro Operations Panel</h3>
              <p>Use the sidebar navigation to manage database resources:</p>
              <div className="quick-actions-grid">
                <div className="action-card">
                  <h4>👗 Manage Dresses</h4>
                  <p>Add new designs, edit existing prices and descriptions, or replace catalog images displayed on the homepage.</p>
                </div>
                <div className="action-card">
                  <h4>📦 Manage Orders</h4>
                  <p>Register new orders, record customer detail combinations, and toggle status badges dynamically.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
// 
