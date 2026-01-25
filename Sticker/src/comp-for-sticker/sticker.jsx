import React, { useState } from "react";

export default function Sticker({ sticker, onDelete }) {



  const [title, setTitle] = useState(sticker?.title || "");
  const [desc, setDesc] = useState(sticker?.desc || "");
  const [isEditing, setIsEditing] = useState(false);
 const getLightColor = () => {
    const r = Math.floor(Math.random() * 106) + 150; // 150–255
    const g = Math.floor(Math.random() * 106) + 150;
    const b = Math.floor(Math.random() * 106) + 150;

    return `rgb(${r}, ${g}, ${b})`;
  };
  const [backgroundclr,setbackgrclr]=useState(getLightColor());
  

  return (
    <div style={{ backgroundColor: backgroundclr, padding: 10, width: 200 }}>
      {isEditing ? (
        <>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
        </>
      ) : (
        <>
          <h4>{title || "Untitled"}</h4>
          <p>{desc || "Empty note"}</p>
        </>
      )}

      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? "Save" : "Edit"}
      </button>
      <button onClick={onDelete}>🗑️</button>
    </div>
  );
}
