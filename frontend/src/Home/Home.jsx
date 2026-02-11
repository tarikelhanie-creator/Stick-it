import { useState } from "react";
import { useAuth } from "../AuthContex.jsx";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";

export default function Home(){

    const [message, setMessage]= useState('');
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const {user, logout} = useAuth();

    const handleLogout = ()=>{
        logout();
        navigate('/login-form');
    }

    return(
    <div className="flex flex-col items-center justify-center text-center mt-30 h-full w-full max-w-7xl mx-auto px-8 py-12">
        <h1 
            className={isDark 
                ? "text-7xl font-bold bg-gradient-to-r text-amber-400 animate-pulse hover:text-amber-300 transition-colors active:text-amber-300" 
                : "text-7xl font-bold bg-gradient-to-r text-orange-500 animate-pulse hover:text-orange-600 transition-colors active:text-orange-600"
            }
            style={{ fontFamily: 'Baloo 2, cursive' }}
        >
            Welcome {user?.username}
        </h1>
        
        <p className={`text-2xl mt-8 max-w-2xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontFamily: 'Baloo 2, cursive' }}>
            Your brain's messy. We get it.
        </p>
        
        <p className={`text-lg mt-4 max-w-3xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Stick your thoughts here, turn them into fun little stickers with AI magic, and watch your chaos become... slightly organized chaos!
        </p>
    </div>
    )
}
