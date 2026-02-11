import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useTheme } from "../ThemeContext";
import { Plus, Pencil } from "lucide-react";
import { useAuth } from "../AuthContex";
import { Trash2 } from "lucide-react";
import { X } from "lucide-react";

export default function Noter() {
  const [notes, setNotes] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const { token } = useAuth();
  const [note, setNote] = useState({
    title: "",
    content: "",
    category: "General"
  });
  const [showWelcome, setShowWelcome] = useState(true);
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!token) return;
    
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
        console.error('Error:', err);
      }
    };
    
    fetchNotes();
  }, [token, isEditing]);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const addNote = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(note)
      });
      const data = await res.json();
      setNotes([...notes, data]);
      setNote({ title: "", content: "", category: "General" });
    } catch(err) {
      console.error('Error:', err);
    }
  };

  // ✅ FIXED THIS FUNCTION
  const generatesticker = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${id}/generate-sticker`, { // ✅ Fixed URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Created Stickers:', data.stickers);
        navigate('/sticker-notes');
      } else {
        setError(data.error || 'Failed to generate stickers');
        alert(data.error || 'Failed to generate stickers'); // ✅ Show error
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      alert('Network error: ' + err.message); // ✅ Show error
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (id) => {
    const noteToEdit = notes.find(n => n._id === id);
    if (noteToEdit) {
      setNote({...noteToEdit});
      setIsEditing(true);
    }
  };

  const stopEditing = () => {
    setIsEditing(false);
    setNote({ title: "", content: "", category: "General" });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(note)
      });
      
      if (!res.ok) {
        throw new Error('Failed to update note');
      }
      
      const data = await res.json();
      setNotes(notes.map(n => n._id === id ? data : n));
      stopEditing();
    } catch(err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setNotes(notes.filter(n => n._id !== id));
    } catch(err) {
      console.error('Error:', err);
    }
  };

  return (
    <>
      {/* Welcome Overlay */}
      {showWelcome && (
        <div className={
          isDark 
            ? 'fixed inset-0 z-50 flex items-center justify-center bg-black animate-fadeOut'
            : 'fixed inset-0 z-50 flex items-center justify-center bg-white animate-fadeOut'
        }>
          <h1 className="
            text-2xl font-black
            bg-gradient-to-r from-gray-600 to-gray-500
            text-transparent bg-clip-text
            animate-pop
          ">
            Loading...
          </h1>
        </div>
      )}
      {Loading && (
        <div className={
          isDark 
            ? 'fixed inset-0 z-50 flex items-center justify-center bg-black animate-fadeOut'
            : 'fixed inset-0 z-50 flex items-center justify-center bg-white animate-fadeOut'
        }>
          <h1 className="
            text-2xl font-black
            bg-gradient-to-r from-gray-600 to-gray-500
            text-transparent bg-clip-text
            animate-pop
          ">
            Creating stickers...
          </h1>
        </div>
      )}

      <div className="flex flex-row gap-7 h-screen w-full max-w-4xl mx-auto px-8 py-12">
        <div className={`flex flex-col w-1/4 px-2 shadow-sm border rounded-lg ${isDark ? "bg-[#191919] border-gray-700 text-white" : "bg-white border-gray-200 text-black"}`}>
          <ul>
            {notes.map((n) => (
              <li 
                className={"cursor-pointer p-2 rounded-md my-1" +
                  (isEditing && note._id === n._id ? isDark ? " bg-gray-700" : " bg-gray-100" : "") +
                  (isDark ? " text-white hover:bg-gray-700" : " text-black hover:bg-gray-100")
                } 
                onClick={() => startEditing(n._id)} 
                key={n._id}
              >
                {n.title}
                <button onClick={(e) => { e.stopPropagation(); handleDelete(n._id); }}>
                  <Trash2 className="w-4 h-4" />
                </button>
                {/* ✅ FIXED THIS BUTTON */}
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    generatesticker(n._id); 
                  }}
                  disabled={Loading}
                >
                  ✨
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className={`
          flex-grow w-full flex flex-col
          rounded-lg transition-all duration-300
          ${isDark 
            ? 'bg-[#191919]' 
            : 'bg-white shadow-sm border border-gray-200'
          }
        `}>
          {/* Title Input */}
          <input 
            type="text" 
            value={note.title}
            onChange={e => setNote({...note, title: e.target.value})}
            placeholder="Untitled" 
            className={`
              w-full px-16 pt-16 pb-2
              text-4xl font-bold
              bg-transparent
              border-0 focus:outline-none
              placeholder:text-gray-400/40
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}
            style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
          />
          
          {/* Content Textarea */}
          <textarea
            className={`
              flex-grow w-full
              scrollbar-none
              px-16 pt-4 pb-16
              text-base leading-relaxed
              bg-transparent resize-none
              border-0 focus:outline-none
              placeholder:text-gray-400/60
              ${isDark ? 'text-gray-300' : 'text-gray-700'}
            `}
            value={note.content}
            onChange={e => setNote({...note, content: e.target.value})}
            placeholder="Start writing..."
            style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
          />
          
          {/* Add Note Button */}
          <div className="px-16 pb-8">
            <button 
              onClick={isEditing ? () => handleUpdate(note._id) : () => addNote()}
              className={`
                inline-flex items-center gap-2
                px-4 py-2
                text-sm font-medium
                rounded-md
                transition-all duration-200
                ${isDark 
                  ? 'bg-white/10 text-white hover:bg-white/15' 
                  : 'bg-gray-900 text-white hover:bg-gray-800'
                }
              `}
            >
              {isEditing ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isEditing ? 'Save' : 'Add Note'}
            </button>
            {isEditing && (
              <button onClick={stopEditing} className={`
                inline-flex items-center gap-2
                ml-2
                px-4 py-2
                text-sm font-medium
                rounded-md
                transition-all duration-200
                ${isDark 
                  ? 'bg-white/10 text-white hover:bg-white/15' 
                  : 'bg-gray-900 text-white hover:bg-gray-800'
                }
              `}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}