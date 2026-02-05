import { useState, useEffect } from "react";
import { useAuth } from "../AuthContex.jsx";
import { useNavigate } from "react-router-dom";

export default function Sign_in(){
    const [message, setMessage]= useState('');
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
        <div>
            <form onSubmit={handleSubmit}>
                {message && <p>{message}</p>}
                <input 
                    type="text"
                    name="username"
                    placeholder="User name"
                    onChange={handleChange}
                    value={formData.username}
                    required
                />
                <input
                    type="email"
                    onChange={handleChange}
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    required
                />
                <input
                    type="number"
                    onChange={handleChange}
                    placeholder="Age"
                    name="age"
                    value={formData.age}
                    required
                />
                <input
                    type="password"
                    onChange={handleChange}
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    required
                />
                <input type="submit" value="Sign In" />
            </form>
        </div>
    )
    


}