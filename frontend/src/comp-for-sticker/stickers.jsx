import React, { useState, useEffect } from "react";
import Sticker from "./sticker";
import { Plus } from "lucide-react";
import { Trash2, X } from 'lucide-react';
import ba from '../assets/sticker-bg.jpg';
import { useTheme } from "../ThemeContext";
import useThemeColors from "../useThemeColore";
import { useAuth } from "../AuthContex";


export default function Stickers() {
  const [stickers, setStickers] = useState([]);
  const [trash, setTrash] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTrash, setShowTrash] = useState(false);
  const [addingSticker, setAddingSticker] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const { isDark, toggleTheme } = useTheme();
  const { backgroundclr, darkbackgroundclr } = useThemeColors();
  const { token, user } = useAuth();
  const fetchStickers = async () => {
        fetch('http://localhost:5000/api/stickers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        .then(res => {
          if (!res.ok) throw new Error('GET failed');
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) setStickers(data);  // Only set if array
        })
        .catch(err => console.error('Error:', err));};


    useEffect(() => {
      const timer = setTimeout(() => setShowWelcome(false), 2000);
      return () => clearTimeout(timer);
    }, []);

  
    useEffect(() => {
        if (!token) return;
        fetchStickers();
      }, [token]);

    const addSticker = async () => {
      fetch('http://localhost:5000/api/stickers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          note_id: Date.now(), // Temporary ID, replace with actual note ID if needed
          title,
          content: desc,
          author_id: user.id
    })   })
      .then(res =>{
        if (!res.ok){
          throw new Error('Failed to add sticker');
        }
        return res.json();
      })
      .then(data =>{
        setStickers(prev => [...prev, data]);
        setTitle("");
        setDesc("");
      }).catch(err=>{console.error('Error adding sticker:', err)});}



  // DELETE FOREVER
  const deleteForever = async (id) => {
    try {
    await fetch(`http://localhost:5000/api/stickers/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    // Remove from local state after successful delete
    setStickers(prev => prev.filter(s => s._id !== id));
  } catch (err) {
    console.error('Delete failed:', err);
  }
  }

  

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

        {addingSticker && (
          
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm" >
            <div className="fixed top-8 right-83">
              <button
                    onClick={() => setAddingSticker(false)}
                  className={isDark ? " rounded-full w-10 h-10 bg-red-800 text-black hover:text-red-800 hover:bg-red-600  flex items-center justify-center transition-colors":" rounded-full w-10 h-10 bg-red-500 text-white hover:text-red-500 hover:bg-red-200  flex items-center justify-center transition-colors"}>
                    <X className="w-5 h-5 hover:w-7 hover:h-7" />
              </button>
            </div>
            <div className="
              bg-white rounded-2xl 
              w-full max-w-md 
              h-full max-h-md
              p-6
              
             ">
              <div className=" text-neutral-50 min-h-full flex justify-center items-center rounded-lg border border-opacity-5"
                style={
                  isDark ? {backgroundColor:darkbackgroundclr} : {backgroundColor:backgroundclr}
                }>
                <div className="flex flex-col h-full justify-center items-center gap-4">
                  <div className="flex flex-col">
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className=" border-4 rounded-2xl p-4 border-white h-7 mb-4 text-white font-bold outline-none focus:bg-amber-50 font-chalk focus:text-black transition-all duration-200"
                      />
                    <textarea
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className="bg-transparent border-4 rounded-2xl p-2 border-white text-white outline-none focus:bg-amber-50 focus:text-black transition-all duration-200 mb-4 w-70 h-35"
                    />
                  </div>
                  <button
                  onClick={() => {
                    addSticker();
                    setAddingSticker(false);
                    setTitle("");
                    setDesc("");
                  }}
                  className={"relative py-2 px-8 text-black text-base font-bold nded-full overflow-hidden bg-white rounded-full transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 " + (isDark ? "before:from-gray-700 before:to-gray-900" : "before:from-yellow-400 before:to-red-500")}
                >
                  ADD STICKER!
                </button>

                </div>
             </div>
             </div>

            
          </div>
        )}

     <button onClick={() => setAddingSticker(true)} className="
      rounded-full 
      w-12 h-12 
      bg-blue-500 
      text-white
      grid place-items-center
      hover:w-14 hover:h-14 active:w-12 active:h-12
      transition-all duration-200
      fixed bottom-8 right-8
      shadow-lg 
      ">
        <Plus className="w-10 h-10" />
      </button>


      <div className="w-290 h-127  m-2 overflow-y-scroll border-5 pt-2 scrollbar-none" style={{
        backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',
        borderRadius: '15px',
        border: isDark ? '4px solid white' : '4px solid black',
        backdropFilter: 'blur(10px)',

      }}>
        <div style={{
            display: "flex", 
            gap: 10, 
            flexWrap: "wrap", 
            padding: '10px', 
            borderRadius: '10px',
            paddingTop: '20px'
          }}>
            {Array.isArray(stickers) && stickers.map((s) => (

              <Sticker
                key={s._id}
                sticker={s}
                onDelete={() => deleteForever(s._id)}
              />
            ))}
        </div>
      </div>
      
      
    </>
  );
}