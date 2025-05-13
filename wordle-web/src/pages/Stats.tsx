import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';


export default function Stats() {
    const [totalGames, setTotalGames] = useState(0);
    const [victories, setVictories] = useState(0);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('token');
        if (stored) {
            setToken(stored);
            fetchStats(stored);
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
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-4 text-center">Cargando estadísticas...</div>;

    return (
        <>
            <Navbar />
            <div className="p-4">
                <div className="p-4 max-w-md mx-auto">
                    <h1 className="text-2xl font-bold mb-4">Tus estadísticas</h1>
                    <div className="bg-white shadow-md rounded p-4 text-center">
                        <p className="text-lg">🎮 Juegos jugados: <strong>{totalGames}</strong></p>
                        <p className="text-lg mt-2">🏆 Victorias: <strong>{victories}</strong></p>
                    </div>
                </div>
            </div>
        </>



    );
}
