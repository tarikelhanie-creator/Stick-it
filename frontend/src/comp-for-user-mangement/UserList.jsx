import React, { useEffect, useState } from 'react';

function UserList(){
    const [users, setUsers]= useState([]);

    useEffect(()=>{
        fetch('http://localhost:5000/api/users')
        .then(res => res.json())
        .then(data=> setUsers(data))
        .catch(err => console.error('Error:',err));
    }, []);

    return(
        <div>
            <h1>User List</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name} - {user.email} - Age: {user.age}</li>
                ))

                }
            </ul>
        </div>
    )
}

export default UserList;