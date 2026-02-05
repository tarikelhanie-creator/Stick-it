import { Link, useLocation, useNavigate } from 'react-router-dom';
import { StickyNote, FileText, Sparkles, Menu, X, User, Settings, LogOut } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useState, useEffect } from 'react';
import { useSidebar } from '../sidebarcontext';
import { useAuth } from '../AuthContex.jsx';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [showthemedark, setShowthemedark] = useState(false);
  const [showthemelight, setShowthemelight] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { toggleSidebar } = useSidebar();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login-form');
  }

  // Effect: Handle dark mode transition
  useEffect(() => {
    if (showthemedark || showthemelight) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, 1200);
      
      const removeTimer = setTimeout(() => {
        setShowthemedark(false);
        setShowthemelight(false);
        setIsExiting(false);
      }, 1700);
      
      return () => {
        clearTimeout(exitTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [showthemedark, showthemelight]);

  // Effect: Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  // Effect: Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const getButtonClasses = (path) => {
    const active = isActive(path);
    
    if (isDark) {
      return active
        ? 'bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/50 border border-pink-400/30'
        : 'bg-gradient-to-r from-gray-700 to-slate-700 text-gray-200 hover:shadow-lg hover:from-gray-600 hover:to-slate-600 border border-gray-600/50';
    }
    
    return active
      ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white shadow-lg shadow-orange-400/40 border border-orange-300/50'
      : 'bg-white text-gray-700 hover:shadow-lg hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 border border-gray-300 hover:border-orange-200';
  };
  
  return (
    <>
      {showthemedark && (
        <div className={`
          fixed inset-0 z-50
          bg-gradient-to-br from-gray-900 via-black to-gray-800
          ${isExiting ? 'animate-slideUp' : 'animate-slideDown'}
        `}>
          <div className="flex items-center justify-center h-full">
            <h1 className="text-6xl opacity-0 animate-fadeIn">
              🌙
            </h1>
          </div>
        </div>
      )}

      {showthemelight && (
        <div className={`
          fixed inset-0 z-50
          bg-gradient-to-br from-blue-50 via-white to-purple-50
          ${isExiting ? 'animate-slideUp' : 'animate-slideDown'}
        `}>
          <div className="flex items-center justify-center h-full">
            <h1 className="text-6xl opacity-0 animate-fadeIn">
              ☀️
            </h1>
          </div>
        </div>
      )}

      <nav 
        className={isDark 
          ? "relative z-20 bg-black/95 backdrop-blur-md border-b border-gray-800 shadow-2xl shadow-black/50" 
          : "relative z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg"
        }
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className='flex items-center'>
              <div className="relative cursor-pointer mr-4 flex items-center group">
                <Sparkles 
                  className={isDark 
                    ? "w-8 h-8 text-amber-400 animate-pulse hover:text-amber-300 transition-colors" 
                    : "w-8 h-8 text-orange-500 animate-pulse hover:text-orange-600 transition-colors"
                  } 
                  onClick={toggleSidebar} 
                />
              </div>
              <Link 
                to="/" 
                className="flex items-center gap-2 group"
              >
                <h1 
                  className={isDark 
                    ? "text-3xl font-bold bg-gradient-to-r from-amber-200 to-orange-300 bg-clip-text text-transparent group-hover:from-amber-100 group-hover:to-orange-200 transition-all duration-300" 
                    : "text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent group-hover:from-orange-500 group-hover:to-pink-500 transition-all duration-300"
                  }
                  style={{ fontFamily: 'Baloo 2, cursive' }}
                >
                  My Notes
                </h1>
              </Link>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center gap-3">
              {/* User Profile Button */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={isDark
                    ? "p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 hover:scale-110 shadow-lg border border-purple-500"
                    : "p-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full hover:from-purple-400 hover:to-indigo-400 transition-all duration-300 hover:scale-110 shadow-md border border-purple-400"
                  }
                >
                  <User className="w-5 h-5" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div 
                    className={`
                      absolute right-0 top-full mt-2 w-72 rounded-2xl shadow-2xl
                      transition-all duration-200 ease-out
                      ${isDark 
                        ? 'bg-gray-800 border border-gray-700' 
                        : 'bg-white border border-gray-200'
                      }
                    `}
                    style={{ zIndex: 1000 }}
                  >
                    {/* Profile Header */}
                    <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isDark 
                            ? 'bg-gradient-to-br from-purple-600 to-indigo-600' 
                            : 'bg-gradient-to-br from-purple-500 to-indigo-500'
                        }`}>
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {user?.username || 'Guest User'}
                          </h3>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {user?.email || 'guest@example.com'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Profile Actions */}
                    <div className="p-2">
                      <button 
                        className={`
                          w-full text-left px-4 py-3 rounded-lg transition-colors
                          ${isDark 
                            ? 'hover:bg-gray-700 text-gray-200' 
                            : 'hover:bg-gray-100 text-gray-700'
                          }
                        `}
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/profile');
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4" />
                          <span className="font-medium">My Profile</span>
                        </div>
                      </button>
                      
                      <button 
                        className={`
                          w-full text-left px-4 py-3 rounded-lg transition-colors
                          ${isDark 
                            ? 'hover:bg-gray-700 text-gray-200' 
                            : 'hover:bg-gray-100 text-gray-700'
                          }
                        `}
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/settings');
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Settings className="w-4 h-4" />
                          <span className="font-medium">Settings</span>
                        </div>
                      </button>
                    </div>

                    {/* Logout */}
                    <div className={`p-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <button 
                        onClick={handleLogout}
                        className={`
                          w-full text-left px-4 py-3 rounded-lg transition-colors
                          ${isDark 
                            ? 'hover:bg-red-900/20 text-red-400' 
                            : 'hover:bg-red-50 text-red-600'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">Sign Out</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle Button */}
              <button
                className={isDark 
                  ? "px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 text-yellow-300 rounded-full hover:from-gray-700 hover:to-gray-600 transition-all duration-300 hover:scale-110 shadow-lg border border-gray-600 text-lg" 
                  : "px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-600 rounded-full hover:from-orange-200 hover:to-amber-200 transition-all duration-300 hover:scale-110 shadow-md border border-orange-200 text-lg"
                }
                onClick={() => {
                  if (isDark) {
                    setShowthemelight(true);
                  } else {
                    setShowthemedark(true);
                  }
                  
                  setTimeout(() => {
                    toggleTheme();
                  }, 500);
                }}
              >
                {isDark ? '☀️' : '🌙'}
              </button>

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={isDark
                  ? "p-2.5 bg-gradient-to-r from-gray-800 to-gray-700 text-gray-200 rounded-full hover:from-gray-700 hover:to-gray-600 transition-all duration-300 hover:scale-110 shadow-lg border border-gray-600"
                  : "p-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full hover:from-gray-200 hover:to-gray-300 transition-all duration-300 hover:scale-110 shadow-md border border-gray-300"
                }
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div 
          className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className={isDark
            ? "px-6 py-3 bg-black/50 backdrop-blur-sm border-t border-gray-800"
            : "px-6 py-3 bg-white/50 backdrop-blur-sm border-t border-gray-200"
          }>
            <div className="max-w-7xl mx-auto flex flex-col gap-2">
              <Link
                to="/sticker-notes"
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-full
                  font-medium transition-all duration-300
                  transform hover:scale-105 hover:-rotate-1
                  text-sm
                  ${getButtonClasses('/sticker-notes')}
                `}
                style={{ fontFamily: 'Baloo 2, cursive' }}
              >
                <StickyNote className="w-4 h-4" />
                Sticker Notes
              </Link>

              <Link
                to="/normal-notes"
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-full
                  font-medium transition-all duration-300
                  transform hover:scale-105 hover:rotate-1
                  text-sm
                  ${getButtonClasses('/normal-notes')}
                `}
                style={{ fontFamily: 'Baloo 2, cursive' }}
              >
                <FileText className="w-4 h-4" />
                Normal Notes
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-10"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}