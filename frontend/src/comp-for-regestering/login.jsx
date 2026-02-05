import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContex.jsx";

export default function Log_in(){
    const [message, setMessage]= useState('');
    const {login} = useAuth();
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
        <div>
            <form onSubmit={handleSubmit}>
                {message && <p>{message}</p>}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={formData.email}
                    required />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={formData.password}
                    required />
                <input type="submit" />
            </form>
        </div>
    )
}