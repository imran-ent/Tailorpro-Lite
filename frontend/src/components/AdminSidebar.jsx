import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminSidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h3>Admin Panel</h3>
      </div>
      <nav className="sidebar-nav">
        <NavLink 
          to="/admin/dashboard" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="sidebar-icon">📊</span> Dashboard
        </NavLink>
        <NavLink 
          to="/admin/dresses" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="sidebar-icon">👗</span> Manage Dresses
        </NavLink>
        <NavLink 
          to="/admin/orders" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="sidebar-icon">📦</span> Manage Orders
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link logout-btn-sidebar">
          <span className="sidebar-icon">🚪</span> Logout
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
// 
