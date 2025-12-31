import { useNavigate } from 'react-router-dom'
import { TrendingUp, IndianRupee } from 'lucide-react'
import { formatToCrores } from '../services/api'

function MovieCard({ movie, rank, onCompareToggle, isSelected }) {
  const navigate = useNavigate()

  const formatCurrency = (amount) => {
    return formatToCrores(amount)
  }

  // Get poster image URL from TMDb
  const getPosterUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/300x450?text=No+Image'
    return `https://image.tmdb.org/t/p/w500${path}`
  }

  // Format release date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).getFullYear()
  }

  return (
    <div className="glass-effect rounded-2xl overflow-hidden card-hover cursor-pointer relative">
      {/* Rank Badge */}
      <div className="absolute top-4 left-4 z-10 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-lg">#{rank}</span>
      </div>

      {/* Compare Checkbox */}
      <div className="absolute top-4 right-4 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation()
            onCompareToggle(movie.id)
          }}
          className="w-5 h-5 rounded accent-blue-600 cursor-pointer"
        />
      </div>

      {/* Rating Badge */}
      {movie.vote_average && (
        <div className="absolute top-20 right-4 z-10 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
          <span className="text-yellow-400 text-sm font-bold">⭐ {movie.vote_average.toFixed(1)}</span>
        </div>
      )}

      {/* Movie Poster */}
      <div
        onClick={() => navigate(`/movie/${movie.id}`)}
        className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden"
      >
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title || movie.original_title}
          className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'
          }}
        />
      </div>

      {/* Movie Info */}
      <div
        onClick={() => navigate(`/movie/${movie.id}`)}
        className="p-5"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {movie.title || movie.original_title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3">
          {formatDate(movie.release_date)} • {movie.original_language?.toUpperCase() || 'N/A'}
        </p>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
          {movie.overview ? movie.overview.substring(0, 80) + '...' : 'No description available'}
        </p>

        {/* Collection Info */}
        <div className="space-y-2">
          {movie.collection && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Worldwide</span>
              <span className="text-lg font-bold text-green-600 flex items-center">
                <IndianRupee className="w-4 h-4" />
                {movie.collection}
              </span>
            </div>
          )}

          {movie.vote_average && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rating</span>
              <span className="text-md font-semibold text-yellow-600 flex items-center">
                ⭐ {movie.vote_average.toFixed(1)}/10
              </span>
            </div>
          )}

          {!movie.collection && movie.revenue > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Revenue</span>
              <span className="text-md font-semibold text-green-600 flex items-center">
                <IndianRupee className="w-4 h-4" />
                {formatCurrency(movie.revenue)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieCard
