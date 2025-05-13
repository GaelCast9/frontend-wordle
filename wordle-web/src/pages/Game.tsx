import { useEffect, useState } from 'react';
import { sendGuess, getNextWord } from '../services/gameService';
import Navbar from '../components/Navbar';

export default function Game() {
    const [guess, setGuess] = useState('');
    const [attempts, setAttempts] = useState<{ letter: string; value: number }[][]>([]);
    const [message, setMessage] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('token');
        if (stored) setToken(stored);
    }, []);

    const handleGuess = async () => {
        if (guess.length !== 5) {
            alert('La palabra debe tener 5 letras');
            return;
        }

        try {
            const res = await sendGuess(guess, token);
            if (typeof res === 'string') {
                setMessage(res);
            } else {
                setAttempts(prev => [...prev, res.result]);
                setMessage(res.message || '');
            }
            setGuess('');
        } catch (err) {
            setMessage('Error al enviar intento');
        }
    };

    const handleNext = async () => {
        try {
            const res = await getNextWord(token);
            setMessage(res.message);
            setAttempts([]);
            setGuess('');
        } catch (err) {
            setMessage('Error al obtener nueva palabra');
        }
    };

    return (
        <>
            <Navbar />
            <div className="p-4 max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-center">Juego de Palabras</h1>

                <input
                    type="text"
                    maxLength={5}
                    value={guess}
                    onChange={(e) => setGuess(e.target.value.toUpperCase())}
                    className="border p-2 w-full mb-4 text-center uppercase tracking-widest"
                    placeholder="Ingresa tu intento"
                    disabled={attempts.length >= 5 || message.includes('Felicidades')}
                />
                {(attempts.length >= 5 || message.includes('Felicidades')) && (
                    <p className="text-center text-red-500 text-sm mb-2">
                        {attempts.length >= 5
                            ? 'Ya alcanzaste el límite de 5 intentos.'
                            : '¡Felicidades! Ya adivinaste la palabra.'}
                    </p>
                )}


                <button
                    onClick={handleGuess}
                    disabled={attempts.length >= 5 || message.includes('Felicidades')}
                    className={`px-4 py-2 rounded mb-2 w-full font-semibold ${attempts.length >= 5 || message.includes('Felicidades')
                        ? 'bg-gray-500 text-white cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                >
                    Enviar intento
                </button>



                <button
                    onClick={handleNext}
                    className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600"
                >
                    Nueva palabra
                </button>

                {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}

                <div className="mt-6 grid grid-rows-5 gap-2">
                    {[...Array(5)].map((_, rowIndex) => (
                        <div key={rowIndex} className="grid grid-cols-5 gap-2">
                            {[...Array(5)].map((_, colIndex) => {
                                const letterObj = attempts[rowIndex]?.[colIndex];
                                const color = letterObj
                                    ? letterObj.value === 1
                                        ? 'bg-green-500'
                                        : letterObj.value === 2
                                            ? 'bg-yellow-400'
                                            : 'bg-gray-400'
                                    : 'bg-gray-100';

                                return (
                                    <div
                                        key={colIndex}
                                        className={`w-12 h-12 rounded text-center flex items-center justify-center font-bold text-xl text-white ${color}`}
                                    >
                                        {letterObj?.letter || ''}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Intentos restantes: {5 - attempts.length}
                </p>

            </div>
        </>
    );
}
