// src/utils/rawgApi.ts
const RAWG_BASE_URL = 'https://api.rawg.io/api';
const API_KEY = import.meta.env.VITE_RAWG_API_KEY as string;

if (!API_KEY) {
    console.error('¡Falta VITE_RAWG_API_KEY en el archivo .env!');
    throw new Error('RAWG API key no configurada');
}

export async function rawgFetch<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(`${RAWG_BASE_URL}${endpoint}`);
    url.searchParams.append('key', API_KEY);

    // Agregar parámetros opcionales
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
                url.searchParams.append(key, value.join(','));
            } else {
                url.searchParams.append(key, String(value));
            }
        }
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`RAWG error ${response.status}: ${errorText || response.statusText}`);
    }

    return response.json() as Promise<T>;
}

// Interfaces básicas (puedes expandirlas según necesites)
export interface Game {
    id: number;
    name: string;
    slug: string;
    background_image?: string;
    released?: string;
    metacritic?: number;
    genres?: { name: string }[];
    platforms?: { platform: { name: string } }[];
    rating?: number;
}

export interface GamesResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Game[];
}

// Función principal para listar juegos (muy flexible)
export const listGames = (options: {
    page?: number;              // página actual (default 1)
    page_size?: number;         // cuántos por página (máx ~40-50 recomendado)
    search?: string;            // búsqueda por nombre
    ordering?: string;          // ej: '-released' (más reciente primero), '-rating', 'metacritic'
    platforms?: number | number[];  // IDs de plataformas (ej: 4=PC, 18=PS5, 1=Xbox)
    genres?: number | number[];     // IDs de géneros
    dates?: string;             // rango de fechas: '2025-01-01,2026-12-31'
    metacritic?: string;        // ej: '70,100'
} = {}) => {
    return rawgFetch<GamesResponse>('/games', {
        page: options.page ?? 1,
        page_size: options.page_size ?? 20,
        search: options.search,
        ordering: options.ordering,
        platforms: options.platforms,
        genres: options.genres,
        dates: options.dates,
        metacritic: options.metacritic,
    });
};

export const listAllGames = (options: {
    page?: number;
    page_size?: number;           // Máximo efectivo ~40, más puede fallar o ser lento
    ordering?: string;            // Ej: '-released' (más nuevos primero), '-rating', 'name'
    platforms?: number | number[]; // Opcional: ej [4] para solo PC
} = {}) => {
    return rawgFetch<GamesResponse>('/games', {
        page: options.page ?? 1,
        page_size: options.page_size ?? 20,
        ordering: options.ordering ?? '-rating',  // Por defecto: populares primero
        // NO pongas search ni dates aquí si quieres "todos"
        // platforms: options.platforms,          // descomenta si quieres filtrar consolas
    });
};



// Ejemplos de uso rápido (puedes exportar estas también)
export const getPopularGames = (page = 1) => listGames({ page, ordering: '-rating' });
export const getRecentGames = (page = 1) => listGames({ page, ordering: '-released', dates: '2025-01-01,2026-12-31' });
export const getUpcomingGames = (page = 1) => listGames({ page, ordering: 'released', dates: `${new Date().toISOString().split('T')[0]},2027-12-31` });
export const searchGames = (query: string, page = 1) => listGames({ search: query, page });