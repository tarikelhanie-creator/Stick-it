import { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [notesByCategory, setNotesByCategory] = useState({});
  const [stickersByCategory, setStickersByCategory] = useState({});

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Group notes by category whenever notes change
  useEffect(() => {
    const grouped = notes.reduce((acc, note) => {
      const category = note.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(note);
      return acc;
    }, {});
    setNotesByCategory(grouped);
  }, [notes]);

  // Group stickers by category whenever stickers change
  useEffect(() => {
    const grouped = stickers.reduce((acc, sticker) => {
      const category = sticker.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(sticker);
      return acc;
    }, {});
    setStickersByCategory(grouped);
  }, [stickers]);

  return (
    <SidebarContext.Provider value={{ 
      isSidebarOpen, 
      toggleSidebar, 
      openSidebar, 
      closeSidebar,
      notes,
      setNotes,
      stickers,
      setStickers,
      notesByCategory,
      stickersByCategory
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};