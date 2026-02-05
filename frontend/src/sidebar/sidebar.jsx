import { useSidebar } from "../sidebarcontext";
import { useLocation } from "react-router-dom";
import {useAuth} from "../AuthContex.jsx";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const { isSidebarOpen, closeSidebar, notesByCategory, stickersByCategory } = useSidebar();
  const location = useLocation();
  const {user, logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = ()=>{
      logout();
      navigate('/login-form');
      closeSidebar();
  }

  if (!isSidebarOpen) return null;

  // Determine what to show based on current route
  const isNotesPage = location.pathname === "/normal-notes";
  const isStickersPage = location.pathname === "/sticker-notes";

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 animate-slideIn" onClick={closeSidebar} />
      
      <div className="fixed top-0 left-0 h-full w-80 bg-white z-50 overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {isNotesPage ? "Notes" : isStickersPage ? "Stickers" : "Menu"}
          </h2>
          <button onClick={closeSidebar} className="text-2xl">&times;</button>
        </div>

        <div className="p-4">
          {/* Show Notes */}
          {isNotesPage && (
            <>
              {Object.keys(notesByCategory).length === 0 ? (
                <p>No notes yet</p>
              ) : (
                Object.entries(notesByCategory).map(([category, notes]) => (
                  <div key={category} className="mb-6">
                    <h3 className="font-bold text-lg mb-2">{category}</h3>
                    <ul className="space-y-2">
                      {notes.map((note) => (
                        <li key={note.id} className="p-3 bg-gray-100 rounded">
                          <div className="font-bold">{note.title || 'Untitled'}</div>
                          <div className="text-sm text-gray-600">{note.content.substring(0, 50)}...</div>
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
                <p>No stickers yet</p>
              ) : (
                Object.entries(stickersByCategory).map(([category, stickers]) => (
                  <div key={category} className="mb-6">
                    <h3 className="font-bold text-lg mb-2">{category}</h3>
                    <ul className="space-y-2">
                      {stickers.map((sticker) => (
                        <li key={sticker.id} className="p-3 bg-gray-100 rounded">
                          <div className="font-bold">{sticker.title || 'Untitled'}</div>
                          <div className="text-sm text-gray-600">{sticker.desc?.substring(0, 50)}...</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </>
          )}

          {/* If not on either page */}
          {!isNotesPage && !isStickersPage && (
            <p>Navigate to Notes or Stickers page</p>
          )}

          <div className="mt-8 border-t pt-4">
              <h3 className="font-bold mb-2">User</h3>
              {user ? (
                <p className="text-sm">{user.username}</p>
              ) : (
                <p className="text-sm">Not logged in</p>
              )}
              <button onClick={handleLogout} className="mt-2 px-4 py-2 bg-red-500 text-white rounded">
                Logout
              </button>
            </div>
        </div>
      </div>
    </>
  );
}