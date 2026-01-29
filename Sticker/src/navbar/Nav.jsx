import { Link, useLocation } from 'react-router-dom';  // Changed from 'react-router'
import { StickyNote, FileText, Sparkles } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useState,useEffect } from 'react';
import { useSidebar } from '../sidebarcontext';

export default function Navbar() {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [showthemedark, setShowthemedark] = useState(false);
  const [showthemelight, setShowthemelight] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { toggleSidebar } = useSidebar();

  // Effect 1: Handle dark mode transition
useEffect(() => {
  if (showthemedark || showthemelight) {
    // Start exit animation after 1.2s
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1200);
    
    // Remove component after slide up completes
    const removeTimer = setTimeout(() => {
      setShowthemedark(false);
      setShowthemelight(false);
      setIsExiting(false);
    }, 1700); // 1200ms + 500ms animation
    
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }
}, [showthemedark, showthemelight]);

  
  const isActive = (path) => location.pathname === path;  // Removed ': string'

    const getButtonClasses = (path) => {
    const active = isActive(path);
    
    if (isDark) {
      return active
        ? 'bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/50'
        : 'bg-gradient-to-r from-gray-800 to-slate-800 text-gray-300 hover:shadow-md hover:from-gray-700';
    }
    
    return active
      ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white shadow-lg shadow-orange-300/50'
      : 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 hover:shadow-md hover:from-amber-100';
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
          <h1 className="
            text-2xl font-black
            bg-gradient-to-r from-yellow-400 to-yellow-500
            text-transparent bg-clip-text
            opacity-0 animate-fadeIn
          ">
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
          <h1 className="
            text-2xl font-black
            bg-gradient-to-r from-yellow-600 to-yellow-500
            text-transparent bg-clip-text
            opacity-0 animate-fadeIn
          ">
            ☀️
          </h1>
        </div>
      </div>
    )}

    <nav className={isDark ? "relative z-20 bg-black/90 backdrop-blur-md border-b-4 border-primary/20 shadow-lg" : "relative z-20 bg-white/80 backdrop-blur-md border-b-4 border-primary/20 shadow-lg"}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className='flex'>
                <div className="relative cursor-pointer mr-4 flex items-center" >
                  <Sparkles className={isDark ? "w-8 h-8 text-amber-50 text-primary animate-pulse":"w-8 h-8 text-primary animate-pulse"} onClick={toggleSidebar} />
                </div>
              <Link 
                to="/" 
                className="flex items-center gap-2 group"
              >
                <h1 
                  className={isDark ? "text-3xl font-bold text-white group-hover:text-amber-100 transition-colors duration-300":"text-3xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-300"}
                  style={{ fontFamily: 'Baloo 2, cursive' }}
                >
                  My Notes
                </h1>
              </Link>
          </div>
          <button
            className={isDark ? "px-4 py-2 bg-gray-800 text-gray-200 rounded-full hover:bg-gray-700 transition-colors":"px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"}
           onClick={() => {
            if (isDark) {
              setShowthemelight(true);
            } else {
              setShowthemedark(true);
            }
            
            // Wait for curtain to fully cover, THEN change theme
            setTimeout(() => {
              toggleTheme();
            }, 500); // Full curtain animation duration
          }}>
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              to="/sticker-notes"
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full
                font-medium transition-all duration-300
                transform hover:scale-105 hover:-rotate-1
                ${getButtonClasses('/sticker-notes')}
              `}
              style={{ fontFamily: 'Baloo 2, cursive' }}
            >
              <StickyNote className="w-5 h-5" />
              Sticker Notes
            </Link>

            <Link
              to="/normal-notes"
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full
                font-medium transition-all duration-300
                transform hover:scale-105 hover:rotate-1
                ${getButtonClasses('/normal-notes')}
              `}
              style={{ fontFamily: 'Baloo 2, cursive' }}
            >
              <FileText className="w-5 h-5" />
              Normal Notes
            </Link>
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}