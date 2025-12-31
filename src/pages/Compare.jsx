import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, IndianRupee, X, Loader } from 'lucide-react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { getMovieDetails, formatToCrores } from '../services/api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
)

function Compare() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [selectedMovies, setSelectedMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMovies()
  }, [searchParams])

  const loadMovies = async () => {
    const moviesParam = searchParams.get('movies')
    if (!moviesParam) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const ids = moviesParam.split(',')
      const moviePromises = ids.map(id => getMovieDetails(id))
      const movies = await Promise.all(moviePromises)
      setSelectedMovies(movies.filter(m => m !== null))
    } catch (error) {
      console.error('Error loading movies:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return formatToCrores(amount)
  }

  // Generate mock daily data for comparison
  const generateMockDailyData = (movie) => {
    if (!movie.revenue) return []
    const days = ['Day 1', 'Day 3', 'Day 7', 'Day 14', 'Day 21', 'Day 28']
    return days.map((day, i) => ({
      day,
      collection: (movie.revenue * 83 / 10000000) * (1 - i * 0.15) / 6
    }))
  }

  const colors = [
    { border: 'rgb(59, 130, 246)', bg: 'rgba(59, 130, 246, 0.1)' },
    { border: 'rgb(168, 85, 247)', bg: 'rgba(168, 85, 247, 0.1)' },
    { border: 'rgb(236, 72, 153)', bg: 'rgba(236, 72, 153, 0.1)' },
    { border: 'rgb(34, 197, 94)', bg: 'rgba(34, 197, 94, 0.1)' },
  ]

  // Daily Collection Comparison
  const dailyComparisonData = {
    labels: ['Day 1', 'Day 3', 'Day 7', 'Day 14', 'Day 21', 'Day 28'],
    datasets: selectedMovies.map((movie, index) => {
      const dailyData = generateMockDailyData(movie)
      return {
        label: movie.title || movie.original_title,
        data: dailyData.map(d => d.collection),
        borderColor: colors[index].border,
        backgroundColor: colors[index].bg,
        fill: true,
        tension: 0.4,
      }
    })
  }

  // Total Collection Comparison
  const totalComparisonData = {
    labels: selectedMovies.map(m => m.title || m.original_title),
    datasets: [
      {
        label: 'Revenue (₹ Cr)',
        data: selectedMovies.map(m => (m.revenue * 83) / 10000000 || 0),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: 'Budget (₹ Cr)',
        data: selectedMovies.map(m => (m.budget * 83) / 10000000 || 0),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  }

  const handleRemoveMovie = (movieId) => {
    const newMovies = selectedMovies.filter(m => (m.id || m.tmdb_id) !== movieId)
    setSelectedMovies(newMovies)
    if (newMovies.length < 2) {
      navigate('/')
    } else {
      const newIds = newMovies.map(m => m.id || m.tmdb_id)
      navigate(`/compare?movies=${newIds.join(',')}`)
    }
  }

  const handleAddMore = () => {
    navigate('/')
  }

  if (selectedMovies.length < 2) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Select at least 2 movies to compare
        </h2>
        <button onClick={() => navigate('/')} className="btn-primary">
          Go Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <button onClick={() => navigate('/')} className="btn-secondary mb-6">
          <ArrowLeft className="w-4 h-4 inline mr-2" />
          Back
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">
              Compare Movies
            </h1>
            <p className="text-gray-600 text-lg">
              Analyzing {selectedMovies.length} movies side by side
            </p>
          </div>
          <button onClick={handleAddMore} className="btn-primary">
            Add More Movies
          </button>
        </div>

        {/* Selected Movies Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {selectedMovies.map((movie, index) => (
            <div key={movie.id} className="glass-effect rounded-2xl overflow-hidden relative">
              <button
                onClick={() => handleRemoveMovie(movie.id)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {movie.releaseDate} • {movie.language}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Worldwide</span>
                    <span className="font-bold text-purple-600 flex items-center text-sm">
                      <IndianRupee className="w-3 h-3" />
                      {formatCurrency(movie.worldwideCollection)}
                    </span>
                  </div>
                  {movie.trend && (
                    <div className="flex items-center space-x-1 text-green-600 text-xs">
                      <TrendingUp className="w-3 h-3" />
                      <span>{movie.trend}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="space-y-8">
          {/* Daily Collection Trend Comparison */}
          <div className="glass-effect p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Daily Collection Trend Comparison
            </h2>
            <div className="h-96">
              <Line data={dailyComparisonData} options={chartOptions} />
            </div>
          </div>

          {/* Total Collection Comparison */}
          <div className="glass-effect p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Total Collection Comparison
            </h2>
            <div className="h-96">
              <Bar data={totalComparisonData} options={chartOptions} />
            </div>
          </div>

          {/* Comparison Table */}
          <div className="glass-effect p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Detailed Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4">Movie</th>
                    <th className="text-right py-3 px-4">Worldwide</th>
                    <th className="text-right py-3 px-4">India</th>
                    <th className="text-right py-3 px-4">Overseas</th>
                    <th className="text-right py-3 px-4">Language</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMovies.map((movie) => (
                    <tr key={movie.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                      <td className="py-3 px-4 font-medium">{movie.title}</td>
                      <td className="py-3 px-4 text-right font-bold text-purple-600">
                        {formatCurrency(movie.worldwideCollection)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-green-600">
                        {formatCurrency(movie.indiaCollection)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-blue-600">
                        {formatCurrency(movie.overseas)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        {movie.language}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Compare
