// src/components/GameList.tsx
import { useState, useEffect } from 'react';
import { listGames } from '../utils/rawgApi';
import type { Game } from '../utils/rawgApi';

function GameList() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true);
            setError(null);

            try {
                // Ejemplo: juegos populares, puedes cambiar los parámetros
                const data = await listGames({
                    page,
                    page_size: 15,
                    ordering: '-rating',          // populares por rating descendente
                    // dates: '2025-01-01,2026-12-31', // descomenta para juegos recientes
                    // platforms: [4, 18],          // solo PC + PS5 (IDs de RAWG)
                });

                setGames(data.results);
            } catch (err: any) {
                setError(err.message || 'No se pudieron cargar los juegos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [page]); // se vuelve a ejecutar al cambiar página

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Lista de Juegos</h2>

            {loading && <p className="text-center">Cargando juegos...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {!loading && !error && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {games.map((game) => (
                            <div
                                key={game.id}
                                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
                            >
                                {game.background_image && (
                                    <img
                                        src={game.background_image}
                                        alt={game.name}
                                        className="w-full h-48 object-cover"
                                        loading="lazy"
                                    />
                                )}
                                <div className="p-4">
                                    <h3 className="font-bold text-lg">{game.name}</h3>
                                    {game.released && <p className="text-sm text-gray-400">Lanzamiento: {game.released}</p>}
                                    {game.metacritic && <p className="text-sm">Metacritic: {game.metacritic}</p>}
                                    {/* Aquí podrías agregar botón: Añadir a wishlist */}
                                    <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                                        Añadir a lista
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Paginación simple */}
                    <div className="flex justify-center mt-8 gap-4">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2">Página {page}</span>
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            className="px-4 py-2 bg-gray-700 rounded"
                        >
                            Siguiente
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default GameList;