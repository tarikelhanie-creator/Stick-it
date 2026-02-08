import React, { useState } from "react";
import { useTheme } from "../ThemeContext";
import { Trash2 } from 'lucide-react';
import useThemeColors from "../useThemeColore";

export default function Sticker({ sticker, onDelete }) {
  const [title, setTitle] = useState(sticker?.title || "");
  const [desc, setDesc] = useState(sticker?.content || "");
  const [isEditing, setIsEditing] = useState(false);
  const { isDark } = useTheme();
  const { backgroundclr, darkbackgroundclr } = useThemeColors();

  return (
    <div
      className={`
        border-4 border-solid border-white rounded-2xl
        relative w-52 h-52 p-4
        rounded-lg shadow-lg
        transition-all duration-300
        hover:scale-105 hover:rotate-2 hover:shadow-xl
        cursor-pointer
        ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-yellow-100 border border-yellow-300'}
      `}
      style={isDark ? {backgroundColor: darkbackgroundclr} : {backgroundColor: backgroundclr}}
    >
      {/* Content */}
      <div className="flex flex-col h-full">
        <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title || "Untitled"}
        </h3>
        <p className={`flex-grow text-sm overflow-hidden ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {desc?.substring(0, 100) || "No description"}
          {desc?.length > 100 && "..."}
        </p>
        
        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={`
            self-end mt-2 p-2 rounded-full
            transition-all duration-200
            hover:scale-110
            ${isDark 
              ? 'bg-red-900/50 text-red-400 hover:bg-red-800' 
              : 'bg-red-100 text-red-600 hover:bg-red-200'
            }
          `}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Sticky note "tape" effect */}
      <div 
        className={`
          absolute -top-2 left-1/2 -translate-x-1/2
          w-16 h-4 rounded-sm
          ${isDark ? 'bg-gray-700/50' : 'bg-yellow-300/50'}
        `}
      />
    </div>
  );
}