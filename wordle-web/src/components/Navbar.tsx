import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <div className="font-bold text-xl">Wordle</div>
      <div className="space-x-4">
        <Link to="/game" className="hover:underline">Juego</Link>
        <Link to="/stats" className="hover:underline">Estadísticas</Link>
        <Link to="/ranking" className="hover:underline">Ranking</Link>
        <button onClick={handleLogout} className="hover:underline text-red-400">Salir</button>
      </div>
    </nav>
  );
}
