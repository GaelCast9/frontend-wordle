import { useEffect, useState } from 'react';
import { sendGuess, getNextWord } from '../services/gameService';
import Navbar from '../components/Navbar';

const WORD_INTERVAL = 5 * 60; // 5 minutos

export default function Game() {
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<{ letter: string; value: number }[][]>([]);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);

  // Cargar datos guardados
  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) setToken(stored);

    const savedStart = localStorage.getItem('start_time');
    if (savedStart) updateTimeLeft(parseInt(savedStart, 10));

    const savedAttempts = localStorage.getItem('attempts');
    if (savedAttempts) setAttempts(JSON.parse(savedAttempts));

    const savedMessage = localStorage.getItem('message');
    if (savedMessage) setMessage(savedMessage);

    const savedGuess = localStorage.getItem('guess');
    if (savedGuess) setGuess(savedGuess);

    const interval = setInterval(() => {
      const saved = localStorage.getItem('start_time');
      if (saved) updateTimeLeft(parseInt(saved, 10));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Guardar estado en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('attempts', JSON.stringify(attempts));
  }, [attempts]);

  useEffect(() => {
    localStorage.setItem('message', message);
  }, [message]);

  useEffect(() => {
    localStorage.setItem('guess', guess);
  }, [guess]);

  const updateTimeLeft = (start: number) => {
    const now = Math.floor(Date.now() / 1000);
    const elapsed = now - start;
    const remaining = Math.max(0, WORD_INTERVAL - elapsed);
    setTimeLeft(remaining);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleGuess = async () => {
    if (guess.length !== 5) {
      setMessage('La palabra debe tener 5 letras');
      return;
    }

    setLoading(true);
    try {
      const res = await sendGuess(guess, token);
      if (typeof res === 'string') {
        setMessage(res);
      } else {
        const newAttempts = [...attempts, res.result];
        setAttempts(newAttempts);
        setMessage(res.message || '');
      }
      setGuess('');
    } catch {
      setMessage('Error al enviar intento');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      const res = await getNextWord(token);
      setMessage(res.message);
      setAttempts([]);
      setGuess('');
      const now = Math.floor(Date.now() / 1000);
      localStorage.setItem('start_time', now.toString());
      setTimeLeft(WORD_INTERVAL);

      // Limpiar localStorage de la partida
      localStorage.removeItem('attempts');
      localStorage.removeItem('message');
      localStorage.removeItem('guess');
    } catch {
      setMessage('Error al obtener nueva palabra');
    } finally {
      setLoading(false);
    }
  };

  const isGameOver = attempts.length >= 5 || message.includes('Felicidades');
  const timePercentage = (timeLeft / WORD_INTERVAL) * 100;

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-4">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Cabecera del juego */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <h1 className="text-xl sm:text-2xl font-bold text-center">Juego de Palabras</h1>
            </div>
            
            <div className="p-4 sm:p-6">
              {/* Timer */}
              <div className="mb-4">
                <div className="text-center text-gray-600 mb-2">
                  Nueva palabra en: <span className="font-semibold">{formatTime(timeLeft)}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-1000 ease-linear" 
                    style={{ width: `${timePercentage}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Campo de entrada */}
              <input
                type="text"
                maxLength={5}
                value={guess}
                onChange={(e) => setGuess(e.target.value.toUpperCase())}
                className="border p-3 w-full mb-3 text-center uppercase tracking-widest font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Ingresa tu intento"
                disabled={isGameOver || loading}
              />

              {/* Mensaje de fin de juego */}
              {isGameOver && (
                <div className="text-center mb-3">
                  <p className={`text-sm ${attempts.length >= 5 ? 'text-red-500' : 'text-green-500'} font-medium`}>
                    {attempts.length >= 5
                      ? 'Ya alcanzaste el límite de 5 intentos.'
                      : '¡Felicidades! Adivinaste la palabra.'}
                  </p>
                </div>
              )}

              {/* Botones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                <button
                  onClick={handleGuess}
                  disabled={isGameOver || loading}
                  className={`px-4 py-2 rounded font-semibold transition ${
                    isGameOver || loading
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Enviando...' : 'Enviar intento'}
                </button>

                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition font-semibold disabled:bg-green-400"
                >
                  {loading ? 'Cargando...' : 'Nueva palabra'}
                </button>
              </div>

              {/* Mensaje */}
              {message && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 rounded text-sm text-gray-700">
                  {message}
                </div>
              )}

              {/* Tablero de juego */}
              <div className="grid grid-rows-5 gap-2 max-w-xs mx-auto">
                {[...Array(5)].map((_, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-5 gap-2">
                    {[...Array(5)].map((_, colIndex) => {
                      const letterObj = attempts[rowIndex]?.[colIndex];
                      let color = 'bg-gray-100';
                      let textColor = 'text-gray-400';
                      
                      if (letterObj) {
                        textColor = 'text-white';
                        if (letterObj.value === 1) {
                          color = 'bg-green-500';
                        } else if (letterObj.value === 2) {
                          color = 'bg-yellow-400';
                        } else {
                          color = 'bg-gray-400';
                        }
                      }

                      return (
                        <div
                          key={colIndex}
                          className={`aspect-square flex items-center justify-center rounded font-bold text-lg sm:text-xl ${color} ${textColor} transition-colors duration-300`}
                        >
                          {letterObj?.letter || ''}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Intentos restantes */}
              <p className="mt-4 text-center text-sm text-gray-600 font-medium">
                Intentos restantes: {5 - attempts.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}