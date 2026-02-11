import { useState, useEffect } from "react";
import { useAuth } from "../AuthContex.jsx";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext.jsx";

export default function Sign_in(){
    const [message, setMessage]= useState('');
    const {isDark} = useTheme();
    const navigate = useNavigate();
    const {login} = useAuth();
    const [formData, setFormData]= useState({
        username:'',
        email:'',
        age:'',
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
        fetch('http://localhost:5000/api/users/register',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'},
            body: JSON.stringify(formData)
        })
        .then(res => {
            if (!res.ok){
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data =>{
            if (data.error){
                setMessage(data.error);
                return;
            }
            login(data.token, data.user);
            setMessage(data.message || 'Registration successful');
            setFormData({username:'', email:'', age:'', password:''});
            navigate('/');
        })
        .catch(err => {
            setMessage('Registration failed'); 
            console.error('Error:', err);
        });
            
    };

    return(
        <div className={`flex justify-center items-center min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
            <form 
                onSubmit={handleSubmit} 
                className={`relative ${isDark ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-yellow-200 to-yellow-300'} p-8 rounded-sm shadow-2xl w-80 transform -rotate-1 hover:rotate-0 transition-transform duration-300`}
            >
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 w-20 h-6 ${isDark ? 'bg-gray-600/40' : 'bg-white/40'} rounded-sm`}></div>
                
                <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-6 text-center`}>
                    Sign Up
                </h2>
                
                {message && (
                    <p className={`text-sm mb-4 text-center p-2 rounded ${isDark ? 'text-red-400 bg-red-900/30' : 'text-red-600 bg-red-100'}`}>
                        {message}
                    </p>
                )}
                
                <input 
                    type="text"
                    name="username"
                    placeholder="User name"
                    onChange={handleChange}
                    value={formData.username}
                    className={`w-full ${isDark ? 'bg-gray-600/50 border-gray-500 text-white placeholder:text-gray-400' : 'bg-yellow-100/50 border-gray-400 text-gray-800 placeholder:text-gray-500'} border-b-2 px-3 py-3 mb-4 focus:outline-none ${isDark ? 'focus:border-gray-300' : 'focus:border-gray-600'}`}
                    required
                />
                
                <input
                    type="email"
                    onChange={handleChange}
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    className={`w-full ${isDark ? 'bg-gray-600/50 border-gray-500 text-white placeholder:text-gray-400' : 'bg-yellow-100/50 border-gray-400 text-gray-800 placeholder:text-gray-500'} border-b-2 px-3 py-3 mb-4 focus:outline-none ${isDark ? 'focus:border-gray-300' : 'focus:border-gray-600'}`}
                    required
                />
                
                <input
                    type="number"
                    onChange={handleChange}
                    placeholder="Age"
                    name="age"
                    value={formData.age}
                    className={`w-full ${isDark ? 'bg-gray-600/50 border-gray-500 text-white placeholder:text-gray-400' : 'bg-yellow-100/50 border-gray-400 text-gray-800 placeholder:text-gray-500'} border-b-2 px-3 py-3 mb-4 focus:outline-none ${isDark ? 'focus:border-gray-300' : 'focus:border-gray-600'}`}
                    required
                />
                
                <input
                    type="password"
                    onChange={handleChange}
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    className={`w-full ${isDark ? 'bg-gray-600/50 border-gray-500 text-white placeholder:text-gray-400' : 'bg-yellow-100/50 border-gray-400 text-gray-800 placeholder:text-gray-500'} border-b-2 px-3 py-3 mb-6 focus:outline-none ${isDark ? 'focus:border-gray-300' : 'focus:border-gray-600'}`}
                    required
                />
                
                <button 
                    type="submit"
                    className={`w-full ${isDark ? 'bg-white text-gray-900 hover:bg-gray-200' : 'bg-gray-800 text-white hover:bg-gray-900'} py-3 rounded-md transition-colors duration-200 font-semibold mb-4`}
                >
                    ✨ Sign Up
                </button>
                
                <p className={`text-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Already have an account?{' '}
                    <a href="/login-form" className={`font-semibold ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'} underline`}>
                        Login
                    </a>
                </p>
            </form>
        </div>
    )
    


}