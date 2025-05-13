import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import './App.css';
// import { useState } from 'react';
import Game from './pages/Game';
import Stats from './pages/Stats';
import Ranking from './pages/Ranking';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/game" element={<Game />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/ranking" element={<Ranking />} />
    </Routes>
  );
}

export default App;
