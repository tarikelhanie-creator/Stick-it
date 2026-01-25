import React, { useState, useEffect } from "react";
import Sticker from "./sticker";
import Trash from "./Trash";
import { Plus } from "lucide-react";
import { Trash2, X } from 'lucide-react';

export default function Stickers() {
  const [stickers, setStickers] = useState([]);
  const [trash, setTrash] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTrash, setShowTrash] = useState(false);
  const [addingSticker, setAddingSticker] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  
    useEffect(() => {
      const timer = setTimeout(() => setShowWelcome(false), 2000);
      return () => clearTimeout(timer);
    }, []);
  

  const addSticker = () => {
    setStickers([
      ...stickers,
      {
        id: Date.now(),
        title,
        desc,
      },
    ]);
  };

  // MOVE TO TRASH
  const moveToTrash = (id) => {
    const sticker = stickers.find((s) => s.id === id);
    setStickers(stickers.filter((s) => s.id !== id));
    setTrash([...trash, sticker]);
  };

  // RECOVER
  const recoverSticker = (id) => {
    const sticker = trash.find((s) => s.id === id);
    setTrash(trash.filter((s) => s.id !== id));
    setStickers([...stickers, sticker]);
  };

  // DELETE FOREVER
  const deleteForever = (id) => {
    setTrash(trash.filter((s) => s.id !== id));
  };
  const deleteevrything =()=>{
    setTrash([]);
  }

  

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
            📓 Stickers!!
          </h1>
        </div>
      )}
      {showTrash && (
        <div className="
          fixed inset-0 z-50
          flex items-center justify-center
          bg-black bg-opacity-50
          ">
            <div className="
             bg-white rounded-2xl 
            w-full max-w-2xl 
            max-h-[80vh]
            overflow-hidden
            shadow-2xl
            animate-popUp
            ">
              <div className="
              flex items-center justify-between
              p-6 border-b
              bg-gradient-to-r from-red-50 to-pink-50
              ">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-8 h-8 text-red-500" />
                  <h2 className="text-2xl font-bold text-gray-800">Trash</h2>
                </div>
                  <button
                    onClick={() => setShowTrash(false)}
                    className="
                      rounded-full w-10 h-10
                      bg-red-500
                      text-white hover:text-red-500 hover:bg-red-200 
                      flex items-center justify-center
                      transition-colors">
                    <X className="w-5 h-5 hover:w-7 hover:h-7" />
                  </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <Trash
                  trash={trash}
                  onRecover={recoverSticker}
                  onDeleteForever={deleteForever}
                  onDeleteeverything ={deleteevrything}
                />
            </div>
            <div className="
              p-6 border-t
              bg-gray-50
              flex justify-between items-center
            ">
              <span className="text-gray-600 animate-pulse">
                {trash.length} items in trash
              </span>
              
            </div>
         </div>
         </div>)}

        {addingSticker && (
          <div
            className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black bg-opacity-50
          ">
            <div className="
               bg-white rounded-2xl 
                w-full max-w-2xl 
                max-h-[80vh]
                overflow-hidden
                shadow-2xl
                animate-popUp
             ">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
              <input type="button" onClick={() => {addSticker(); setAddingSticker(false);}} value="Add Sticker" />
             </div>

            
          </div>
        )}

     <button onClick={() => setAddingSticker(true)} className="
      rounded-full 
      w-12 h-12 
      bg-blue-500 
      text-white
      grid place-items-center
      hover:w-14 hover:h-14 active:w-10 active:h-10
      transition-all duration-200
      fixed bottom-8 right-8
      shadow-lg shadow-blue-300/50
      ">
        <Plus className="w-10 h-10" />
      </button>
            <button
        onClick={() => setShowTrash(true)}
        className="
          fixed bottom-8 right-23
          rounded-full w-12 h-12
          bg-red-500 text-white
          flex items-center justify-center
          shadow-xl hover:shadow-2xl
          hover:w-14 hover:h-14 active:w-10 active:h-10
          transition-all
          z-40
        "
      >
        <Trash2 className="w-7 h-7" />
      </button>



      <h2>📝 Notes</h2>
      <div style={{ display: "flex", gap: 10 }}>
        {stickers.map((s) => (
          <Sticker
            key={s.id}
            sticker={s}
            onDelete={() => moveToTrash(s.id)}
          />
        ))}
      </div>
    </>
  );
}