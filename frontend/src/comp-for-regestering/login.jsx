import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContex.jsx";
import { useTheme } from "../ThemeContext.jsx";

export default function Log_in(){
    const [message, setMessage]= useState('');
    const {login} = useAuth();
    const {isDark}=useTheme()
    const navigate = useNavigate();
    const [formData, setFormData]= useState({
        email:'',
        password:''
    });

    const handleChange = (e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = (e)=>{
        e.preventDefault();

        fetch('http://localhost:5000/api/users/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'},
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => {
            console.log('Login response:', data);
            if (data.token){
                login(data.token, data.user);
                setMessage(data.message || 'Login successful');
                setFormData({email:'', password:''});
                navigate('/');
            } else if (data.error){
                setMessage(data.error);
            }
        })
        .catch(err => {
            setMessage('Login failed');
            console.error('Error:', err);
        });

    }
    
    return(
        <div className={`flex justify-center items-center min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
            <form 
                onSubmit={handleSubmit} 
                className={`relative ${isDark ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-yellow-200 to-yellow-300'} p-8 rounded-sm shadow-2xl w-80 transform -rotate-1 hover:rotate-0 transition-transform duration-300`}
            >
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 w-20 h-6 ${isDark ? 'bg-gray-600/40' : 'bg-white/40'} rounded-sm`}></div>
                
                <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-6 text-center`}>
                    Login
                </h2>
                
                {message && (
                    <p className={`text-sm mb-4 text-center p-2 rounded ${isDark ? 'text-red-400 bg-red-900/30' : 'text-red-600 bg-red-100'}`}>
                        {message}
                    </p>
                )}
                
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={formData.email}
                    className={`w-full ${isDark ? 'bg-gray-600/50 border-gray-500 text-white placeholder:text-gray-400' : 'bg-yellow-100/50 border-gray-400 text-gray-800 placeholder:text-gray-500'} border-b-2 px-3 py-3 mb-4 focus:outline-none ${isDark ? 'focus:border-gray-300' : 'focus:border-gray-600'}`}
                    required 
                />
                
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={formData.password}
                    className={`w-full ${isDark ? 'bg-gray-600/50 border-gray-500 text-white placeholder:text-gray-400' : 'bg-yellow-100/50 border-gray-400 text-gray-800 placeholder:text-gray-500'} border-b-2 px-3 py-3 mb-6 focus:outline-none ${isDark ? 'focus:border-gray-300' : 'focus:border-gray-600'}`}
                    required 
                />
                
                <button 
                    type="submit"
                    className={`w-full ${isDark ? 'bg-white text-gray-900 hover:bg-gray-200' : 'bg-gray-800 text-white hover:bg-gray-900'} py-3 rounded-md transition-colors duration-200 font-semibold`}
                >
                    ✨ Sign In
                </button>
                <p className={`text-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Don't have an account?{' '}
                    <a href="/signin-form" className={`font-semibold ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'} underline`}>
                        Sign Up
                    </a>
                </p>
            </form>
        </div>
    )
}