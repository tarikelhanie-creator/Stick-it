import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sticker from './comp-for-sticker/sticker'
import Stickers from './comp-for-sticker/stickers'
import { Router, Route, Link ,Routes } from 'react-router-dom'
import Noter from './comp-for-notetaker/main_noter'
import Nav from './navbar/Nav'
import { ThemeProvider } from './ThemeContext'
import { useTheme } from './ThemeContext'


function App() {

  const { isDark, toggleTheme } = useTheme();
  return (
    <ThemeProvider>
        <div>
          <Nav/>
        </div>
        <Routes>
          <Route path="/sticker-notes" element={<Stickers/>} />
          <Route path="/normal-notes" element={<Noter/>} />
        </Routes>
    </ThemeProvider>
  );

}

export default App
