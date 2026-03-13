// src/pages/Home.tsx  o src/components/GameListFull.tsx
import { useState, useEffect } from 'react';
import { listAllGames } from '../utils/rawgApi';  // ajusta la ruta según tu estructura
import type { Game } from '../utils/rawgApi';

function Home() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadGames = async (pageNum: number) => {
        setLoading(true);
        setError(null);

        try {
            const data = await listAllGames({
                page: pageNum,
                page_size: 20,                // Puedes subir a 30-40 si quieres más por carga
                ordering: '-released',        // Cambia a '-rating' para populares, o quítalo para orden por defecto (relevancia)
                // ordering: '-metacritic',   // Otra opción: por puntuación Metacritic
            });

            // Agrega los nuevos juegos a la lista existente (para "cargar más")
            setGames((prev) => [...prev, ...data.results]);

            // Si no hay "next" o menos resultados de lo esperado → no hay más
            setHasMore(!!data.next && data.results.length > 0);
        } catch (err: any) {
            setError(err.message || 'Error al cargar los juegos. Revisa tu API key o conexión.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Carga la primera página al montar el componente
    useEffect(() => {
        loadGames(1);
    }, []);

    // Función para cargar la siguiente página
    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadGames(nextPage);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Todos los Juegos</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
                    >
                        {game.background_image ? (
                            <img
                                src={game.background_image}
                                alt={game.name}
                                className="w-full h-48 object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                                Sin imagen
                            </div>
                        )}
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1 line-clamp-2">{game.name}</h3>
                            {game.released && (
                                <p className="text-sm text-gray-400">
                                    Lanzado: {new Date(game.released).toLocaleDateString()}
                                </p>
                            )}
                            {game.metacritic && (
                                <p className="text-sm text-yellow-400">Metacritic: {game.metacritic}</p>
                            )}
                            {/* Botón para añadir a wishlist (lo conectas después con Supabase) */}
                            <button className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-medium">
                                Añadir a mi lista
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="text-center my-8">
                    <p className="text-lg">Cargando juegos...</p>
                </div>
            )}

            {!loading && hasMore && (
                <div className="text-center my-10">
                    <button
                        onClick={handleLoadMore}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg"
                    >
                        Cargar más juegos
                    </button>
                </div>
            )}

            {!loading && !hasMore && games.length > 0 && (
                <p className="text-center text-gray-500 my-8">Has llegado al final de la lista 📚</p>
            )}

            {games.length === 0 && !loading && !error && (
                <p className="text-center text-gray-400 my-8">No se encontraron juegos aún...</p>
            )}
        </div>
    );
}

export default Home;