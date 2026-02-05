import { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }){
    const [user, setUser]= useState(null);
    const [token, setToken]= useState(null);
    const [loading, setLoading]= useState(true);

    useEffect(()=>{
        const savedToken = localStorage.getItem('token');

        if(savedToken){
            const decoded = jwtDecode(savedToken);
            setToken(savedToken);
            setUser(decoded);
        }

        setLoading(false);
    },[]);

    const login = (token, userData)=>{
        localStorage.setItem('token', token);
        console.log('the contex is working twin')
        setToken(token);
        setUser(userData);
    }

    const logout = ()=>{
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext(AuthContext);
}