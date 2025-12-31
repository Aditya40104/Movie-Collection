import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, TrendingUp, Loader, RefreshCw } from 'lucide-react'
import MovieCard from '../components/MovieCard'
import SearchBar from '../components/SearchBar'
import { getIndianMoviesWithRealBoxOffice, searchMovies as apiSearchMovies } from '../services/api'

function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMovies, setSelectedMovies] = useState([])
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadMovies()
  }, [])

  const loadMovies = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getIndianMoviesWithRealBoxOffice()
      setMovies(data)
    } catch (err) {
      setError('Failed to load movies. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      loadMovies()
      return
    }
    
    try {
      setLoading(true)
      const results = await apiSearchMovies(query)
      setMovies(results)
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCompareToggle = (movieId) => {
    setSelectedMovies(prev => {
      if (prev.includes(movieId)) {
        return prev.filter(id => id !== movieId)
      } else {
        return [...prev, movieId]
      }
    })
  }

  const handleCompare = () => {
    if (selectedMovies.length >= 2) {
      navigate(`/compare?movies=${selectedMovies.join(',')}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-6">
        <div className="inline-flex items-center space-x-2 glass-effect px-4 py-2 rounded-full">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">
            Real-time Box Office Tracking
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold gradient-text">
          Indian Movie<br />Box Office Rankings
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Track worldwide collections, compare movies, and analyze daily trends
        </p>

        {/* Search Bar */}
        <div className="pt-6">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by movie name..."
          />
        </div>

        {/* Refresh Button */}
        {!loading && (
          <button
            onClick={loadMovies}
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Movies</span>
          </button>
        )}
      </div>

      {/* Compare Button (Sticky) */}
      {selectedMovies.length >= 2 && (
        <div className="fixed bottom-8 right-8 z-40">
          <button
            onClick={handleCompare}
            className="btn-primary shadow-2xl flex items-center space-x-2 animate-bounce"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Compare {selectedMovies.length} Movies</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader className="w-12 h-12 text-purple-500 animate-spin" />
          <span className="ml-4 text-xl text-gray-600">Loading movies...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-20">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={loadMovies}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      )}

      {/* Movies Grid */}
      {!loading && !error && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {searchQuery ? 'Search Results' : 'Popular Indian Movies'}
            </h2>
            <p className="text-gray-600">{movies.length} movies</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {movies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                rank={index + 1}
                onCompareToggle={handleCompareToggle}
                isSelected={selectedMovies.includes(movie.id)}
              />
            ))}
          </div>

          {movies.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No movies found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}

      {/* Stats Section */}
      {!loading && movies.length > 0 && (
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-effect p-6 rounded-2xl text-center">
            <p className="text-4xl font-bold gradient-text">
              {movies.length}+
            </p>
            <p className="text-gray-600 mt-2">Movies Tracked</p>
          </div>
          <div className="glass-effect p-6 rounded-2xl text-center">
            <p className="text-4xl font-bold gradient-text">
              Real-time
            </p>
            <p className="text-gray-600 mt-2">TMDb API Data</p>
          </div>
          <div className="glass-effect p-6 rounded-2xl text-center">
            <p className="text-4xl font-bold gradient-text">
              Daily
            </p>
            <p className="text-gray-600 mt-2">Updates</p>
          </div>
        </div>
      )}

      {/* Data Source Info */}
      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>✅ Data Sources:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Box Office Collections:</strong> Real-time data from Sacnilk.com (updated every 6 hours)</li>
            <li><strong>Movie Info & Images:</strong> TMDb API (posters, ratings, descriptions)</li>
          </ul>
        </p>
        <p className="text-xs text-green-700 mt-2">
          Note: Daily collections are estimated. For 100% accurate day-wise breakdown, manual data entry is recommended.
        </p>
      </div>
    </div>
  )
}

export default Home
