import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/logo-icon.svg" alt="TailorPro" className="logo-image" />
          <span className="logo-text">Tailor<span className="logo-highlight">Pro</span></span>
        </Link>

        {!isAdminRoute ? (
          <>
            <nav className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
              <button className="nav-item-btn" onClick={() => handleNavClick('hero')}>Home</button>
              <button className="nav-item-btn" onClick={() => handleNavClick('about')}>About</button>
              <button className="nav-item-btn" onClick={() => handleNavClick('services')}>Services</button>
              <button className="nav-item-btn" onClick={() => handleNavClick('dresses')}>Dresses</button>
              <button className="nav-item-btn" onClick={() => handleNavClick('book')}>Book Order</button>
              <button className="nav-item-btn" onClick={() => handleNavClick('track')}>Track Order</button>
              
              {admin ? (
                <>
                  <Link to="/admin/dashboard" className="nav-item admin-badge-link" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="nav-btn-logout">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/admin/login" className="nav-btn-login" onClick={() => setMobileMenuOpen(false)}>
                  Admin Login
                </Link>
              )}
            </nav>

            <button 
              className={`hamburger ${mobileMenuOpen ? 'is-active' : ''}`} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </>
        ) : (
          <div className="admin-header-nav">
            <span className="admin-welcome">Admin: <strong>{admin?.username}</strong></span>
            <Link to="/" className="view-site-btn">View Site</Link>
            <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
// 
