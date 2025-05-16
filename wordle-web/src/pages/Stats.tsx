import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Stats() {
    const [totalGames, setTotalGames] = useState(0);
    const [victories, setVictories] = useState(0);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('token');
        if (stored) {
            setToken(stored);
            fetchStats(stored);
        } else {
            setError('No hay sesión activa');
            setLoading(false);
        }
    }, []);

    const fetchStats = async (token: string) => {
        try {
            const res = await axios.get('http://localhost:3000/users/me/stats', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTotalGames(res.data.totalGames);
            setVictories(res.data.totalVictories);
        } catch (err) {
            console.error('Error al obtener estadísticas:', err);
            setError('No se pudieron cargar las estadísticas');
        } finally {
            setLoading(false);
        }
    };

    // Calcular porcentaje de victorias
    const winPercentage = totalGames > 0 ? Math.round((victories / totalGames) * 100) : 0;

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 min-h-screen py-6">
                <div className="max-w-lg mx-auto px-4">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                            <h1 className="text-2xl font-bold text-center">Tus estadísticas</h1>
                        </div>
                        
                        {loading ? (
                            <div className="p-10 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
                                <p className="text-gray-600">Cargando estadísticas...</p>
                            </div>
                        ) : error ? (
                            <div className="p-6 text-center">
                                <div className="bg-red-50 text-red-600 p-4 rounded-md">
                                    <p>{error}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Juegos jugados */}
                                    <div className="bg-blue-50 rounded-lg p-6 text-center">
                                        <div className="text-5xl text-blue-600 mb-2">🎮</div>
                                        <p className="text-gray-600 mb-1">Juegos jugados</p>
                                        <p className="text-3xl font-bold text-gray-800">{totalGames}</p>
                                    </div>
                                    
                                    {/* Victorias */}
                                    <div className="bg-green-50 rounded-lg p-6 text-center">
                                        <div className="text-5xl text-green-600 mb-2">🏆</div>
                                        <p className="text-gray-600 mb-1">Victorias</p>
                                        <p className="text-3xl font-bold text-gray-800">{victories}</p>
                                    </div>
                                </div>
                                
                                {/* Porcentaje de victorias */}
                                <div className="mt-6">
                                    <p className="text-gray-600 text-center mb-2">Porcentaje de victorias</p>
                                    <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500 ease-out"
                                            style={{ width: `${winPercentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-right mt-1 text-sm text-gray-600 font-medium">{winPercentage}%</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}