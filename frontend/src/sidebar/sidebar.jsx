import { useSidebar } from "../sidebarcontext";
import { useLocation } from "react-router-dom";
import { useAuth } from "../AuthContex.jsx";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { X, StickyNote, FileText, User, LogOut, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [notes, setNotes] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const location = useLocation();
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  useEffect(() => {
    if (!token || !isSidebarOpen) return;
    
    if (location.pathname === "/normal-notes") {
      fetchNotes();
    } else if (location.pathname === "/sticker-notes") {
      fetchStickers();
    }
  }, [token, isSidebarOpen, location.pathname]);

  const fetchNotes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error('Error fetching notes:', err);
    }
  };

  const fetchStickers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/stickers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setStickers(data);
    } catch (err) {
      console.error('Error fetching stickers:', err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        setNotes(notes.filter(note => note._id !== noteId));
      }
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const handleDeleteSticker = async (stickerId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/stickers/${stickerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        setStickers(stickers.filter(sticker => sticker._id !== stickerId));
      }
    } catch (err) {
      console.error('Error deleting sticker:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login-form');
    closeSidebar();
  };

  // Filter notes based on search
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = searchCategory === "all" || note.category === searchCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter stickers based on search
  const filteredStickers = stickers.filter(sticker => {
    const matchesSearch = sticker.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = searchCategory === "all" || sticker.category === searchCategory;
    return matchesSearch && matchesCategory;
  });

  // Group filtered notes by category
  const notesByCategory = filteredNotes.reduce((acc, note) => {
    const category = note.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(note);
    return acc;
  }, {});

  // Group filtered stickers by category
  const stickersByCategory = filteredStickers.reduce((acc, sticker) => {
    const category = sticker.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(sticker);
    return acc;
  }, {});

  // Get unique categories
  const noteCategories = [...new Set(notes.map(n => n.category || 'Uncategorized'))];
  const stickerCategories = [...new Set(stickers.map(s => s.category || 'Uncategorized'))];

  if (!isSidebarOpen) return null;

  const isNotesPage = location.pathname === "/normal-notes";
  const isStickersPage = location.pathname === "/sticker-notes";

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" 
        onClick={closeSidebar} 
      />
      
      <div 
        className={`
          fixed top-0 left-0 h-full w-80 z-50 overflow-y-auto
          animate-slideInLeft shadow-2xl
          ${isDark 
            ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700' 
            : 'bg-gradient-to-b from-white via-orange-50/30 to-white border-r border-orange-200'
          }
        `}
      >
        {/* Header */}
        <div className={`
          p-6 border-b flex justify-between items-center
          ${isDark ? 'border-gray-700 bg-black/30' : 'border-orange-200 bg-white/50'}
        `}>
          <div className="flex items-center gap-3">
            {isNotesPage ? (
              <FileText className={isDark ? "w-6 h-6 text-amber-400" : "w-6 h-6 text-orange-500"} />
            ) : isStickersPage ? (
              <StickyNote className={isDark ? "w-6 h-6 text-pink-400" : "w-6 h-6 text-pink-500"} />
            ) : (
              <User className={isDark ? "w-6 h-6 text-purple-400" : "w-6 h-6 text-purple-500"} />
            )}
            <h2 
              className={`
                text-2xl font-bold
                ${isDark 
                  ? 'bg-gradient-to-r from-amber-200 to-orange-300 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent'
                }
              `}
              style={{ fontFamily: 'Baloo 2, cursive' }}
            >
              {isNotesPage ? "Notes" : isStickersPage ? "Stickers" : "Menu"}
            </h2>
          </div>
          <button 
            onClick={closeSidebar} 
            className={`
              p-2 rounded-full transition-all duration-300 hover:scale-110
              ${isDark 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-orange-100 text-gray-700'
              }
            `}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar */}
        {(isNotesPage || isStickersPage) && (
          <div className="p-4 space-y-3">
            {/* Search by title */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-2 rounded-lg
                  border focus:outline-none focus:ring-2
                  ${isDark 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-amber-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-orange-500'
                  }
                `}
              />
            </div>

            {/* Filter by category */}
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className={`
                w-full px-4 py-2 rounded-lg
                border focus:outline-none focus:ring-2
                ${isDark 
                  ? 'bg-gray-800 border-gray-700 text-white focus:ring-amber-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-orange-500'
                }
              `}
            >
              <option value="all">All Categories</option>
              {isNotesPage && noteCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              {isStickersPage && stickerCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Show Notes */}
          {isNotesPage && (
            <>
              {Object.keys(notesByCategory).length === 0 ? (
                <div className={`
                  text-center py-12 rounded-2xl
                  ${isDark 
                    ? 'bg-gray-800/50 text-gray-400 border border-gray-700' 
                    : 'bg-orange-50/50 text-gray-500 border border-orange-200'
                  }
                `}>
                  <FileText className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-orange-300'}`} />
                  <p className="font-medium">
                    {searchTerm || searchCategory !== "all" ? "No matching notes" : "No notes yet"}
                  </p>
                  <p className="text-sm mt-1">
                    {searchTerm || searchCategory !== "all" 
                      ? "Try adjusting your search" 
                      : "Create your first note to get started"}
                  </p>
                </div>
              ) : (
                Object.entries(notesByCategory).map(([category, categoryNotes]) => (
                  <div key={category} className="mb-6">
                    <h3 
                      className={`
                        font-bold text-sm uppercase tracking-wider mb-3 px-2
                        ${isDark ? 'text-amber-400' : 'text-orange-600'}
                      `}
                      style={{ fontFamily: 'Baloo 2, cursive' }}
                    >
                      {category}
                    </h3>
                    <ul className="space-y-2">
                      {categoryNotes.map((note) => (
                        <li 
                          key={note._id} 
                          className={`
                            p-4 rounded-xl cursor-pointer
                            transition-all duration-300 hover:scale-[1.02]
                            ${isDark 
                              ? 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 border border-gray-600 hover:shadow-lg hover:shadow-amber-500/20' 
                              : 'bg-white hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 border border-gray-200 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-200/50'
                            }
                          `}
                        >
                          <div className={`font-semibold mb-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            {note.title || 'Untitled'}
                          </div>
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {note.content?.substring(0, 50) || 'No content'}...
                          </div>
                          <button 
                            onClick={() => handleDeleteNote(note._id)}
                            className="mt-2 text-xs text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </>
          )}

          {/* Show Stickers */}
          {isStickersPage && (
            <>
              {Object.keys(stickersByCategory).length === 0 ? (
                <div className={`
                  text-center py-12 rounded-2xl
                  ${isDark 
                    ? 'bg-gray-800/50 text-gray-400 border border-gray-700' 
                    : 'bg-pink-50/50 text-gray-500 border border-pink-200'
                  }
                `}>
                  <StickyNote className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-pink-300'}`} />
                  <p className="font-medium">
                    {searchTerm || searchCategory !== "all" ? "No matching stickers" : "No stickers yet"}
                  </p>
                  <p className="text-sm mt-1">
                    {searchTerm || searchCategory !== "all" 
                      ? "Try adjusting your search" 
                      : "Create your first sticker to get started"}
                  </p>
                </div>
              ) : (
                Object.entries(stickersByCategory).map(([category, categoryStickers]) => (
                  <div key={category} className="mb-6">
                    <h3 
                      className={`
                        font-bold text-sm uppercase tracking-wider mb-3 px-2
                        ${isDark ? 'text-pink-400' : 'text-pink-600'}
                      `}
                      style={{ fontFamily: 'Baloo 2, cursive' }}
                    >
                      {category}
                    </h3>
                    <ul className="space-y-2">
                      {categoryStickers.map((sticker) => (
                        <li 
                          key={sticker._id} 
                          className={`
                            p-4 rounded-xl cursor-pointer
                            transition-all duration-300 hover:scale-[1.02] hover:rotate-1
                            ${isDark 
                              ? 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-pink-900/30 hover:to-purple-900/30 border border-gray-600 hover:shadow-lg hover:shadow-pink-500/20' 
                              : 'bg-white hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 border border-gray-200 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-200/50'
                            }
                          `}
                        >
                          <div className={`font-semibold mb-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            {sticker.title || 'Untitled'}
                          </div>
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {sticker.content?.substring(0, 50)}...
                          </div>
                          <button 
                            onClick={() => handleDeleteSticker(sticker._id)}
                            className="mt-2 text-xs text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </>
          )}

          {!isNotesPage && !isStickersPage && (
            <div className={`
              text-center py-12 rounded-2xl
              ${isDark 
                ? 'bg-gray-800/50 text-gray-400 border border-gray-700' 
                : 'bg-purple-50/50 text-gray-500 border border-purple-200'
              }
            `}>
              <p className="font-medium">Navigate to Notes or Stickers page</p>
            </div>
          )}

          {/* User Section */}
          <div className={`
            mt-8 p-5 rounded-2xl border
            ${isDark 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'
            }
          `}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${isDark 
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-600' 
                  : 'bg-gradient-to-br from-purple-500 to-indigo-500'
                }
              `}>
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  User Account
                </h3>
                {user ? (
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {user.username}
                  </p>
                ) : (
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    Not logged in
                  </p>
                )}
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className={`
                w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                font-medium transition-all duration-300 hover:scale-[1.02]
                ${isDark 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-900/30' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white shadow-md hover:shadow-lg'
                }
              `}
              style={{ fontFamily: 'Baloo 2, cursive' }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}