import { useState } from 'react'
import './App.css'
import Stickers from './comp-for-sticker/stickers'
import { Routes, Route } from 'react-router-dom'
import Noter from './comp-for-notetaker/main_noter'
import Nav from './navbar/Nav'
import { useTheme } from './ThemeContext'
import UserList from './comp-for-user-mangement/UserList'
import Sign_in from './comp-for-regestering/Signin'
import Log_in from './comp-for-regestering/login'
import Home from './Home/Home'
import PrivateRoute from './PrivateRoutes'

function App() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <>
      <div>
        <Nav />
      </div>
      <Routes>
        <Route path='/' element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/sticker-notes" element={<PrivateRoute><Stickers /></PrivateRoute>} />
        <Route path="/normal-notes" element={<PrivateRoute><Noter /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><UserList /></PrivateRoute>} />
        <Route path='/signin-form' element={<Sign_in />}/>
        <Route path='/login-form' element={<Log_in />}/>

      </Routes>
    </>
  );
}

export default App