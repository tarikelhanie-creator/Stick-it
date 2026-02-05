import { useState } from 'react'
import './App.css'
import Stickers from './comp-for-sticker/stickers'
import { Routes, Route } from 'react-router-dom'
import Noter from './comp-for-notetaker/main_noter'
import Nav from './navbar/Nav'
import { useTheme } from './ThemeContext'
import { SidebarProvider } from './sidebarcontext'
import Sidebar from './sidebar/sidebar'
import UserList from './comp-for-user-mangement/UserList'
import Sign_in from './comp-for-regestering/Signin'
import Log_in from './comp-for-regestering/login'
import Fullboard from './comp-for-sticker/fullboared'

function App() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <SidebarProvider>
      <Sidebar />
      <div>
        <Nav />
      </div>
      <Routes>
        <Route path='/' element={<Fullboard />} />
        <Route path="/sticker-notes" element={<Stickers />} />
        <Route path="/normal-notes" element={<Noter />} />
        <Route path="/users" element={<UserList />} />
        <Route path='/signin-form' element={<Sign_in />}/>
        <Route path='/login-form' element={<Log_in />}/>

      </Routes>
    </SidebarProvider>
  );
}

export default App