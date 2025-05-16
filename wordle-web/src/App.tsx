// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Game from './pages/Game';
import Stats from './pages/Stats';
import Ranking from './pages/Ranking';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/game"
        element={
          <ProtectedRoute>
            <Game />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <Stats />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ranking"
        element={
          <ProtectedRoute>
            <Ranking />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
