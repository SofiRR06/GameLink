import { useState, useEffect } from 'react'
import supabase from './utils/supabase'

function Page() {
  const [games, setGames] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function getGames() {
      const { data, error } = await supabase.from('games').select()

      if (error) {
        console.error('Error fetching games:', error)
        setError(error.message)
        return
      }

      if (data) {
        setGames(data)
      }
    }

    getGames()
  }, [])

  return (
    <div>
      <h1>Bienvenido a GameLink</h1>
      {error && <p style={{ color: 'red' }}>Error fetch: {error}</p>}
      {games.length === 0 && !error && <p>No hay juegos (o cargando)...</p>}
      <ul>
        {games.map((game) => (
          <li key={game.id}>{game.title}</li>
        ))}
      </ul>
    </div>
  )
}
export default Page