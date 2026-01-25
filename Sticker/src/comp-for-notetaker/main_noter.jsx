import { useState, useEffect } from "react";

export default function Noter() {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState({
    id: Date.now(),
    title: "",
    content: ""
  });
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const addNote = () => {
    if (note.content.trim() === "") return;
    setNotes([...notes, note]);
    setNote({
      id: Date.now(),
      title: "",
      content: ""
    });
  };

  return (
    <>
      {/* Welcome Overlay */}
      {showWelcome && (
        <div className="
          fixed inset-0 z-50
          flex items-center justify-center
          bg-white
          animate-fadeOut
        ">
          <h1 className="
            text-7xl font-black
            bg-gradient-to-r from-blue-600 to-purple-600
            text-transparent bg-clip-text
            animate-pop
          ">
            📓 Note Taker
          </h1>
        </div>
      )}

      <div className="flex flex-col h-screen w-full max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          ✨ Your Notes ✨
        </h2>
        
        <div className="flex-grow flex flex-col">
          <input 
            type="text" 
            value={note.title}
            onChange={e => setNote({...note, title: e.target.value})}
            placeholder="Note Title" 
            className="
              w-full p-3 mb-4
              text-3xl font-bold
              border-0 border-b-2 border-gray-200
              focus:outline-none focus:border-blue-500
              placeholder-gray-400
            "
          />
          
          <textarea
            className="
              w-full flex-grow p-4
              rounded-lg border-2 border-gray-200
              focus:outline-none focus:border-blue-400
              resize-none text-lg
              placeholder-gray-400
            "
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