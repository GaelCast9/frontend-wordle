import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/auth/register', {
        username,
        password,
      });

      localStorage.setItem('token', res.data.access_token);
      navigate('/game');
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleRegister} 
          className="bg-white p-8 rounded-lg shadow-lg border border-gray-200"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear cuenta</h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-1">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              placeholder="Elige un nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Crea una contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirm" className="block text-gray-700 text-sm font-medium mb-1">
              Confirmar contraseña
            </label>
            <input
              id="confirm"
              type="password"
              placeholder="Confirma tu contraseña"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium disabled:bg-green-400"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <a href="/" className="text-green-600 hover:underline font-medium">
                Inicia sesión
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}