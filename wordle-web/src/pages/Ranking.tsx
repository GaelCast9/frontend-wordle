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
            <div className="p-4">
                <div className="p-4 max-w-xl mx-auto">
                    <h1 className="text-2xl font-bold text-center mb-4">🏆 Top 10 Jugadores</h1>
                    {loading ? (
                        <p className="text-center">Cargando ranking...</p>
                    ) : (
                        <table className="w-full border border-gray-300 rounded overflow-hidden shadow">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 text-left">#</th>
                                    <th className="py-2 px-4 text-left">Usuario</th>
                                    <th className="py-2 px-4 text-left">Victorias</th>
                                </tr>
                            </thead>
                            <tbody>
                                {players.map((player, index) => (
                                    <tr key={player.username} className="border-t">
                                        <td className="py-2 px-4">{index + 1}</td>
                                        <td className="py-2 px-4 font-medium">{player.username}</td>
                                        <td className="py-2 px-4">{player.victories}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>


    );
}
