import { useState } from "react";
import { useAuth } from "../AuthContex.jsx";
import { useNavigate } from "react-router-dom";

export default function Fullboard(){

    const [message, setMessage]= useState('');
    const navigate = useNavigate();
    const {user, logout} = useAuth();

    const handleLogout = ()=>{
        logout();
        navigate('/login-form');
    }

    return(
        <div>
            <h1>HELLO {user?.username}</h1>
            <button onClick={handleLogout}>Logout</button>

        </div>
    )
}