import React, { useState } from "react";
import { useTheme } from "../ThemeContext";
import { Trash2 } from 'lucide-react';
import useThemeColors from "../useThemeColore";

export default function Sticker({ sticker, onDelete }) {



  const [title, setTitle] = useState(sticker?.title || "");
  const [desc, setDesc] = useState(sticker?.desc || "");
  const [isEditing, setIsEditing] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { backgroundclr, darkbackgroundclr } = useThemeColors();


  return (
    <>
    <div
      class={"relative rounded-lg -skew-x-6 -translate-y-2 -translate-y-6 hover:-translate-y-1 hover:-translate-x-0 hover:skew-x-0 duration-500 w-52 h-24 p-2  card-compact hover:bg-base-200 transition-all duration-200 [box-shadow:12px_12px] hover:[box-shadow:4px_4px] mb-6 mx-4 cursor-pointer " + (isDark ? "bg-neutral-600" : "bg-neutral-50")}
    >
      <figure class="w-full h-full">
        <div
          alt="change to a img tag"
          class=" text-neutral-50 min-h-full rounded-lg border border-opacity-5"
          style={
            isDark ? {backgroundColor:darkbackgroundclr} : {backgroundColor:backgroundclr}
          }
        ></div>
      </figure>
      <div class={isDark ? "absolute text-neutral-50 bottom-4 left-0 px-4 pt-5 flex-row justify-between w-full flex" : "absolute text-black bottom-4 left-0 px-4 pt-5 flex-row justify-between w-full flex"}>
        <div className="flex">
          <span class="font-bold">{title || "Untitled"}</span>
          <Trash2 className="ml-2 cursor-pointer" onClick={onDelete} />
        </div>
      </div>
    </div>

    </>
  );
}
