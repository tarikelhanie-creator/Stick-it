import { useState, useEffect } from "react";
import { useTheme } from "../ThemeContext";
import { Plus } from "lucide-react";
import { useAuth } from "../AuthContex";

export default function Noter() {
  const [notes, setNotes] = useState([]);
  const { token } = useAuth();
  const [note, setNote] = useState({
    title: "",
    content: "",  // ← Changed from description
    category: "General"  // ← Changed from "porn"
  });
  const [showWelcome, setShowWelcome] = useState(true);
  const { isDark } = useTheme();

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
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const addNote = async () => {
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

      <div className="flex flex-col h-screen w-full max-w-4xl mx-auto px-8 py-12">
        
        <div className={`
          flex-grow flex flex-col
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
              onClick={addNote}
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
              <Plus className="w-4 h-4" />
              Add Note
            </button>
          </div>
        </div>
      </div>
    </>
  );
}