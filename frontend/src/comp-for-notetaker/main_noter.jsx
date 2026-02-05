import { useState, useEffect } from "react";
import { useTheme } from "../ThemeContext";
import { useSidebar } from "../sidebarcontext";

export default function Noter() {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState({
    id: Date.now(),
    title: "",
    content: ""
  });
  const [showWelcome, setShowWelcome] = useState(true);
  const { isDark, toggleTheme } = useTheme();
  const { setNotes: setSidebarNotes, toggleSidebar } = useSidebar(); // Update this line
  

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSidebarNotes(notes);
  }, [notes, setSidebarNotes]);

  const addNote = () => {
    if (note.content.trim() === "") return;
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes); // Update local state
    setSidebarNotes(updatedNotes); // Sync to context
    setNote({
      id: Date.now(),
      category: "",
      title: "",
      content: ""
    });
  };

  return (
    <>
      {/* Welcome Overlay */}
      {showWelcome && (
        <div className={
          isDark ? 'fixed inset-0 z-50 flex items-center justify-center bg-black animate-fadeOut':'fixed inset-0 z-50 flex items-center justify-center bg-white animate-fadeOut'
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

      <div className="flex flex-col h-screen w-full max-w-7xl mx-auto px-6 py-8">
        
        <div className={'border-4 ' + (isDark ? "flex-grow flex flex-col bg-blue-900 border-blue-700  p-6 rounded-lg shadow-md overflow-y-auto":"flex-grow flex flex-col bg-blue-50 border-blue-300 p-6 rounded-lg shadow-md overflow-y-auto")}>
          <input 
            type="text" 
            value={note.title}
            onChange={e => setNote({...note, title: e.target.value})}
            placeholder="Note Title" 
            className={isDark ? "w-full p-3 mb-4 text-3xl text-amber-50  font-bold border-0 border-b-2 border-blue-700 focus:outline-none focus:border-none placeholder-gray-400" : "w-full p-3 mb-4 text-3xl font-bold border-0 border-b-2 border-gray-200 focus:outline-none placeholder-gray-400" 
            }
          />
          
          <textarea
            className={isDark ? "flex-grow w-full p-3 mt-4 text-lg bg-transparent resize-none focus:outline-none placeholder-gray-400":"flex-grow w-full p-3 mt-4 text-lg bg-transparent resize-none focus:outline-none placeholder-gray-600"}
            value={note.content}
            onChange={e => setNote({...note, content: e.target.value})}
            placeholder="What's on your mind?"
          />
          
          <button 
            onClick={addNote}
            className="
              mt-6 px-6 py-3
              bg-blue-500 text-white font-bold
              rounded-lg hover:bg-blue-600
              transition-colors self-end
            "
          >
            + Add Note
          </button>
        </div>
      </div>

    </>
  );
}