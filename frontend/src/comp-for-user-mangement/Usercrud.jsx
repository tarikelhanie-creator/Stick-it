import React, {useState, useEffect} from "react";

export default function Usecrud(){
    const [users, setUsers]= useState([]);
    const [formData, setFormData]= useState({
        username: '',
        email: '',
        age: ''
    });

useEffect(()=>{
    fetchUsers();

},[]);

const fetchUsers = ()=>{
    fetch('http://localhost:5000/api/users')
    .then(res => res.json())
    .then(data=> setUsers(data))
    .catch(err => console.error('Error:',err));};

const handleChange = (e)=>{
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
};

const handleSubmit = (e)=>{
    e.preventDefault();

    fetch('http://localhost:5000/api/users', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(newUser =>{
        setUsers([...users, newUser]);
        setFormData({username:'', email:'', age:''});
    })
    .catch(err => console.error('Error:',err));
};


return(
    <div>
        <h1>User form</h1>

        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                name="username"
                placeholder="User Name"
                value={formData.username}
                onChange={handleChange}
                required
            />
            <input type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required   
            />
            <button type="submit">Add User</button>
        </form>
        <ul>
            {users.map(user=>(
                <li key={user._id}>
                    {user.username}-{user.email} - Age {user.age} 
                </li>
            ))}
        </ul>
    </div>
)


}