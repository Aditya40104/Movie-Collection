import axios from 'axios'

// TMDb API configuration
// Get your free API key from: https://www.themoviedb.org/settings/api
const TMDB_API_KEY = '8265bd1679663a7ea12ac168da84d2e8' // Demo key - replace with your own for production
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

// Convert USD to Indian Crores (1 USD ≈ 83 INR, 1 Crore = 10 million)
export const formatToCrores = (usd) => {
  if (!usd || usd === 0) return 'N/A'
  const inr = usd * 83 // Convert to INR
  const crores = inr / 10000000 // Convert to crores
  return `₹${crores.toFixed(2)} Cr`
}

export const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  }
})

// Fetch popular Indian movies (multiple pages)
export const getPopularIndianMovies = async () => {
  try {
    let allMovies = []
    // Fetch first 5 pages to get more movies
    for (let page = 1; page <= 5; page++) {
      const response = await tmdbApi.get('/discover/movie', {
        params: {
          with_original_language: 'hi',
          sort_by: 'popularity.desc',
          'primary_release_date.gte': '2010-01-01', // Movies from 2010 onwards
          page: page
        }
      })
      allMovies = [...allMovies, ...response.data.results]
    }
    // Sort by popularity and revenue
    return allMovies.sort((a, b) => {
      // Prioritize movies with revenue data
      if (b.revenue && !a.revenue) return 1
      if (a.revenue && !b.revenue) return -1
      // Then sort by vote_count * vote_average (popularity metric)
      return (b.vote_count * b.vote_average) - (a.vote_count * a.vote_average)
    })
  } catch (error) {
    console.error('Error fetching movies:', error)
    return []
  }
}

// Fetch movie details
export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching movie details:', error)
    return null
  }
}

// Search movies
export const searchMovies = async (query) => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: {
        query,
        language: 'en-US'
      }
    })
    return response.data.results
  } catch (error) {
    console.error('Error searching movies:', error)
    return []
  }
}

// Fetch real box office data from Sacnilk scraper (Vercel serverless)
export const getSacnilkMovies = async () => {
  try {
    const response = await axios.get('/api/movies')
    console.log('Sacnilk API response:', response.data)
    return response.data.data || []
  } catch (error) {
    console.error('Error fetching Sacnilk data:', error)
    console.error('Error details:', error.response?.data || error.message)
    throw error
  }
}

// Merge TMDb data (posters, info) with Sacnilk data (real box office)
export const getIndianMoviesWithRealBoxOffice = async () => {
  try {
    // Fetch both sources
    const [sacnilkMovies, tmdbMovies] = await Promise.all([
      getSacnilkMovies(),
      getPopularIndianMovies()
    ])

    console.log(`Fetched ${sacnilkMovies.length} movies from Sacnilk`)
    console.log(`Fetched ${tmdbMovies.length} movies from TMDb`)

    // If no Sacnilk data, use TMDb
    if (!sacnilkMovies || sacnilkMovies.length === 0) {
      console.warn('No Sacnilk data available, using TMDb only')
      return tmdbMovies
    }

    // Create a map of TMDb movies by title for quick lookup
    const tmdbMap = new Map()
    tmdbMovies.forEach(movie => {
      const cleanTitle = movie.title?.toLowerCase().trim() || movie.original_title?.toLowerCase().trim()
      if (cleanTitle) {
        tmdbMap.set(cleanTitle, movie)
      }
    })

    // Merge: Use Sacnilk collections + TMDb for images/info
    const mergedMovies = sacnilkMovies.map(sacnilkMovie => {
      const cleanTitle = sacnilkMovie.title.toLowerCase().trim()
      const tmdbMovie = tmdbMap.get(cleanTitle) || 
                       Array.from(tmdbMap.values()).find(m => 
                         m.title?.toLowerCase().includes(cleanTitle.split(' ')[0]) ||
                         cleanTitle.includes(m.title?.toLowerCase().split(' ')[0])
                       )

      return {
        id: sacnilkMovie.id,
        rank: sacnilkMovie.rank,
        title: sacnilkMovie.title,
        collection: sacnilkMovie.collection,
        year: sacnilkMovie.year,
        dailyCollections: sacnilkMovie.dailyCollections,
        // TMDb data
        poster_path: tmdbMovie?.poster_path,
        backdrop_path: tmdbMovie?.backdrop_path,
        overview: tmdbMovie?.overview,
        vote_average: tmdbMovie?.vote_average,
        vote_count: tmdbMovie?.vote_count,
        release_date: tmdbMovie?.release_date,
        original_language: tmdbMovie?.original_language,
        tmdb_id: tmdbMovie?.id
      }
    })

    return mergedMovies
  } catch (error) {
    console.error('Error in getIndianMoviesWithRealBoxOffice:', error)
    // Fallback to TMDb if Sacnilk fails
    console.warn('Falling back to TMDb data only')
    return getPopularIndianMovies()
  }
}
