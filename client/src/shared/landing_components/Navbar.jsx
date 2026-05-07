import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, LayoutDashboard, MessageSquare, LogIn, UserPlus, X, Menu } from 'lucide-react';
import Button from './Button';
import './Navbar.css';

const Navbar = ({ isAuthenticated = false, user = null }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [theme, setTheme] = useState(
  localStorage.getItem("skillssphere.theme") || "dark"
);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  useEffect(() => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  localStorage.setItem("skillssphere.theme", theme);
}, [theme]);
const toggleTheme = () => {
  setTheme((prev) => (prev === "dark" ? "light" : "dark"));
};

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Resume Analyzer', path: '/resume-analyzer', icon: <FileText size={20} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Mock Interview', path: '/mock-interview', icon: <MessageSquare size={20} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${isMenuOpen ? 'navbar-open' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <span className="text-gradient">SkillSphere</span> AI
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links desktop-only">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.name}
              {isActive(link.path) && <span className="active-indicator"></span>}
            </Link>
          ))}
        </div>

        <div className="nav-actions desktop-only">
          <button
  onClick={toggleTheme}
  className="theme-toggle-btn"
>
  {theme === "dark" ? "☀️" : "🌙"}
</button>
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">Hi, {user?.name || 'User'}</span>
              <Button variant="secondary" size="sm" to="/dashboard">Account</Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" to="/login">Login</Button>
              <Button variant="primary" size="sm" to="/register">Get Started</Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="drawer-backdrop" onClick={() => setIsMenuOpen(false)}></div>
        
        <div className="drawer-content">
          <div className="drawer-header">
            <Link to="/" className="nav-logo">
              <span className="text-gradient">SkillSphere</span> AI
            </Link>
            <button className="close-btn" onClick={() => setIsMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="drawer-nav">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={`drawer-link ${isActive(link.path) ? 'active' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="link-icon">{link.icon}</span>
                <span className="link-text">{link.name}</span>
                {isActive(link.path) && <span className="active-dot"></span>}
              </Link>
            ))}
          </div>

          <div className="drawer-footer">
            {isAuthenticated ? (
              <Button variant="primary" size="lg" to="/dashboard" className="full-width">
                Go to Dashboard
              </Button>
            ) : (
              <div className="drawer-auth">
                <Button variant="secondary" size="lg" to="/login" className="full-width" leftIcon={<LogIn size={20}/>}>
                  Login
                </Button>
                <Button variant="primary" size="lg" to="/register" className="full-width" leftIcon={<UserPlus size={20}/>}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
          
          {/* Decorative Elements */}
          <div className="drawer-decoration decoration-1"></div>
          <div className="drawer-decoration decoration-2"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
