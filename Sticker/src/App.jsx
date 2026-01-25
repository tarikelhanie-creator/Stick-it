import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sticker from './comp-for-sticker/sticker'
import Stickers from './comp-for-sticker/stickers'
import { Router, Route, Link ,Routes } from 'react-router-dom'
import Noter from './comp-for-notetaker/main_noter'
import Nav from './navbar/Nav'

function App() {

  return (
    <>
        <div>
          <Nav/>
        </div>
        <Routes>
          <Route path="/sticker-notes" element={<Stickers/>} />
          <Route path="/normal-notes" element={<Noter/>} />
        </Routes>
    </>
  );

}

export default App
