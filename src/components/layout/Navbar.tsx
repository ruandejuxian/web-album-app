import React, { useState, useEffect } from 'react';
import { FiMenu, FiX, FiHome, FiImage, FiUpload, FiUser, FiLogIn, FiLogOut } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  
  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('auth_token');
      setIsLoggedIn(!!token);
    };
    
    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
    // In a real app, you would redirect to login page
  };
  
  const navLinks = [
    { to: '/', label: 'Trang chủ', icon: <FiHome /> },
    { to: '/gallery', label: 'Thư viện', icon: <FiImage /> },
    { to: '/upload', label: 'Tải lên', icon: <FiUpload /> },
    { to: '/profile', label: 'Hồ sơ', icon: <FiUser /> },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-md py-3'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Web Album" className="h-8 w-auto" />
            <span className="ml-2 text-xl font-bold text-purple-700 hidden sm:inline-block">Web Album</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-1">{link.icon}</span>
                  <span>{link.label}</span>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center">
            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                icon={<FiLogOut />}
              >
                Đăng xuất
              </Button>
            ) : (
              <Button
                as={Link}
                to="/login"
                variant="primary"
                size="sm"
                icon={<FiLogIn />}
              >
                Đăng nhập
              </Button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-purple-700 hover:bg-purple-50 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${
        isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="container mx-auto px-4 py-2 bg-white">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-2">{link.icon}</span>
                  <span>{link.label}</span>
                </div>
              </Link>
            ))}
            
            {/* Auth Button for Mobile */}
            <div className="pt-2 border-t border-gray-200">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 flex items-center"
                >
                  <FiLogOut className="mr-2" />
                  <span>Đăng xuất</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="w-full px-4 py-3 rounded-md text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 flex items-center"
                >
                  <FiLogIn className="mr-2" />
                  <span>Đăng nhập</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
