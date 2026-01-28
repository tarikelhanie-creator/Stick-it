import React from "react";

export default function Trash({ trash, onRecover, onDeleteForever,onDeleteeverything }) {
  if (trash.length === 0) return <p>Trash is empty</p>;

  return (
    <div style={{ display: "flex", gap: 10 }}>
        <button onClick={()=>onDeleteeverything()}>Delete everything</button>
      {trash.map((s) => (
        <div
          key={s.id}

          style={{padding: 10, width: 200 }}
        >
          <h4>{s.title || "Untitled"}</h4>
          <p>{s.desc || "Empty note"}</p>

          <button onClick={() => onRecover(s.id)}>♻️ Recover</button>
          <button onClick={() => onDeleteForever(s.id)}>❌ Delete</button>
        </div>
      ))}
    </div>
  );
}
