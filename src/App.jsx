import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import Home from "./Pages/Static/Home.jsx";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={Home}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
