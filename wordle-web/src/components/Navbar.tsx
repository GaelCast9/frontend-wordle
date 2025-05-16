import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Opcional: podrías recuperar el nombre de usuario del localStorage si lo guardas durante el login
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <Link to="/game" className="flex items-center">
              <span className="text-2xl font-bold tracking-wider">Wordle</span>
            </Link>
          </div>
          
          {/* Menú de navegación para pantallas medianas y grandes */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/game" className="py-2 px-3 hover:bg-blue-700 rounded-md transition-colors text-sm font-medium">
              Juego
            </Link>
            <Link to="/stats" className="py-2 px-3 hover:bg-blue-700 rounded-md transition-colors text-sm font-medium">
              Estadísticas
            </Link>
            <Link to="/ranking" className="py-2 px-3 hover:bg-blue-700 rounded-md transition-colors text-sm font-medium">
              Ranking
            </Link>
            <button 
              onClick={handleLogout} 
              className="py-2 px-3 hover:bg-red-600 rounded-md transition-colors text-sm font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Salir
            </button>
          </div>
          
          {/* Botón de menú para móviles */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/game" 
              className="block py-2 px-3 text-white hover:bg-blue-800 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Juego
            </Link>
            <Link 
              to="/stats" 
              className="block py-2 px-3 text-white hover:bg-blue-800 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Estadísticas
            </Link>
            <Link 
              to="/ranking" 
              className="block py-2 px-3 text-white hover:bg-blue-800 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Ranking
            </Link>
            <button 
              onClick={handleLogout} 
              className="block w-full text-left py-2 px-3 text-white hover:bg-red-600 rounded transition-colors"
            >
              Salir
            </button>
          </div>
        </div>  
      )}
    </nav>
  );
}