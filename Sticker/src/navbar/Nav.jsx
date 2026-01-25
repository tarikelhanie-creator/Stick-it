import { Link, useLocation } from 'react-router-dom';  // Changed from 'react-router'
import { StickyNote, FileText, Sparkles } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;  // Removed ': string'
  
  return (
    <nav className="relative z-20 bg-white/80 backdrop-blur-md border-b-4 border-primary/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h1 
              className="text-3xl font-bold text-primary group-hover:scale-105 transition-transform"
              style={{ fontFamily: 'Baloo 2, cursive' }}
            >
              My Notes
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              to="/sticker-notes"
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full
                font-medium transition-all duration-300
                transform hover:scale-105 hover:-rotate-1
                ${isActive('/sticker-notes') 
                  ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg shadow-blue-300/50' 
                  : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-600 hover:shadow-md'
                }
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
                ${isActive('/normal-notes') 
                  ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-lg shadow-purple-300/50' 
                  : 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-600 hover:shadow-md'
                }
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
  );
}