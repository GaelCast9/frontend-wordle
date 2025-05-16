import { useEffect, useState } from 'react';
import { fetchRanking } from '../services/userService';
import Navbar from '../components/Navbar';

type Player = {
    username: string;
    victories: number;
};

export default function Ranking() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRanking()
            .then(data => setPlayers(data))
            .catch(err => console.error('Error al cargar ranking:', err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto p-4 sm:p-6">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                            <h1 className="text-2xl sm:text-3xl font-bold text-center flex items-center justify-center">
                                <span className="text-4xl mr-2">🏆</span> Top 10 Jugadores
                            </h1>
                        </div>
                        
                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
                                <p className="text-gray-600">Cargando ranking...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="py-4 px-6 text-sm font-semibold text-gray-700">#</th>
                                            <th className="py-4 px-6 text-sm font-semibold text-gray-700">Usuario</th>
                                            <th className="py-4 px-6 text-sm font-semibold text-gray-700">Victorias</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {players.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="py-6 px-6 text-center text-gray-500">
                                                    No hay jugadores registrados aún
                                                </td>
                                            </tr>
                                        ) : (
                                            players.map((player, index) => (
                                                <tr 
                                                    key={player.username} 
                                                    className={`border-b ${index < 3 ? 'bg-blue-50' : ''} hover:bg-gray-50 transition-colors`}
                                                >
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center">
                                                            {index === 0 && <span className="text-2xl mr-1">🥇</span>}
                                                            {index === 1 && <span className="text-2xl mr-1">🥈</span>}
                                                            {index === 2 && <span className="text-2xl mr-1">🥉</span>}
                                                            {index > 2 && <span className="font-medium">{index + 1}</span>}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 font-medium">{player.username}</td>
                                                    <td className="py-4 px-6 text-blue-600 font-semibold">{player.victories}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}