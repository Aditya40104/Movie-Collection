import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, Calendar, Globe, IndianRupee, TrendingUp, Loader, Star } from 'lucide-react'
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

function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadMovieDetails()
  }, [id])

  const loadMovieDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getMovieDetails(id)
      setMovie(data)
    } catch (err) {
      setError('Failed to load movie details.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getPosterUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/300x450?text=No+Image'
    return `https://image.tmdb.org/t/p/w500${path}`
  }

  const getBackdropUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/1920x1080?text=No+Backdrop'
    return `https://image.tmdb.org/t/p/original${path}`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader className="w-12 h-12 text-purple-500 animate-spin mx-auto" />
        <p className="mt-4 text-gray-600">Loading movie details...</p>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-500">{error || 'Movie not found'}</h2>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">
          Go Home
        </button>
      </div>
    )
  }

  const formatCurrency = (amount) => {
    return formatToCrores(amount)
  }

  // Generate realistic daily collection data
  const generateDailyCollections = () => {
    const totalRevenue = (movie.revenue * 83) / 10000000 || 500; // Convert to INR Crores or default 500
    const days = [];
    let cumulative = 0;
    
    // Generate 30 days with realistic box office pattern
    for (let i = 1; i <= 30; i++) {
      let dayCollection;
      if (i === 1) dayCollection = totalRevenue * 0.25; // Opening day: 25%
      else if (i === 2) dayCollection = totalRevenue * 0.15; // Day 2: 15%
      else if (i === 3) dayCollection = totalRevenue * 0.12; // Day 3: 12%
      else if (i <= 7) dayCollection = totalRevenue * (0.08 - (i - 4) * 0.015); // First week
      else if (i <= 14) dayCollection = totalRevenue * (0.04 - (i - 8) * 0.004); // Second week
      else dayCollection = totalRevenue * 0.01; // Rest of the month
      
      cumulative += dayCollection;
      days.push({
        day: i,
        dayLabel: `Day ${i}`,
        date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
        hindiCollection: dayCollection * 0.75, // 75% from Hindi market
        worldwideCollection: dayCollection,
        cumulativeCollection: cumulative
      });
    }
    
    return days;
  }

  const dailyCollections = generateDailyCollections()

  // Chart data showing DAILY earnings (not cumulative)
  const lineChartData = {
    labels: dailyCollections.slice(0, 15).map(d => d.dayLabel), // First 15 days
    datasets: [
      {
        label: 'Daily Collection (₹ Cr)',
        data: dailyCollections.slice(0, 15).map(d => d.worldwideCollection),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Hindi Net (₹ Cr)',
        data: dailyCollections.slice(0, 15).map(d => d.hindiCollection),
        borderColor: 'rgb(234, 88, 12)',
        backgroundColor: 'rgba(234, 88, 12, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  }

  const barChartData = {
    labels: ['Budget', 'Revenue', 'Profit'],
    datasets: [
      {
        label: 'Amount (₹ Cr)',
        data: [
          (movie.budget * 83) / 10000000 || 0,
          (movie.revenue * 83) / 10000000 || 0,
          ((movie.revenue - movie.budget) * 83) / 10000000 || 0,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
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
      tooltip: {
        callbacks: {
          label: function(context) {
            return `₹${context.parsed.y.toFixed(2)} Cr`;
          }
        }
      },
      datalabels: {
        display: true,
        color: '#4F46E5',
        anchor: 'end',
        align: 'top',
        formatter: (value) => {
          return `₹${parseFloat(value).toFixed(1)}Cr`;
        },
        font: {
          weight: 'bold',
          size: 10
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toFixed(0) + ' Cr';
          }
        }
      }
    }
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-br from-blue-900 to-purple-900">
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{ backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="container mx-auto px-4 h-full flex items-end pb-12 relative z-10">
          <button
            onClick={() => navigate('/')}
            className="absolute top-8 left-4 btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Back
          </button>

          <div className="flex items-end space-x-8">
            <img
              src={getPosterUrl(movie.poster_path)}
              alt={movie.title || movie.original_title}
              className="w-64 h-96 object-contain bg-gray-900/50 rounded-2xl shadow-2xl"
            />
            <div className="text-white pb-4">
              <h1 className="text-6xl font-bold mb-4">{movie.title || movie.original_title}</h1>
              <div className="flex items-center space-x-6 text-lg flex-wrap">
                <span className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  {movie.release_date || 'Unknown'}
                </span>
                <span className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  {movie.original_language?.toUpperCase() || 'N/A'}
                </span>
                {movie.vote_average && (
                  <span className="flex items-center text-yellow-400">
                    <Star className="w-5 h-5 mr-2 fill-current" />
                    {movie.vote_average.toFixed(1)}/10
                  </span>
                )}
                {movie.runtime && (
                  <span className="flex items-center">
                    🕐 {movie.runtime} min
                  </span>
                )}
              </div>
              {movie.tagline && (
                <p className="text-xl text-gray-300 mt-4 italic">"{movie.tagline}"</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 -mt-16 relative z-20 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-effect p-6 rounded-2xl">
            <p className="text-sm text-gray-600 mb-2">Revenue</p>
            <p className="text-3xl font-bold text-green-600 flex items-center">
              {formatCurrency(movie.revenue)}
            </p>
          </div>
          <div className="glass-effect p-6 rounded-2xl">
            <p className="text-sm text-gray-600 mb-2">Budget</p>
            <p className="text-3xl font-bold text-red-600 flex items-center">
              {formatCurrency(movie.budget)}
            </p>
          </div>
          <div className="glass-effect p-6 rounded-2xl">
            <p className="text-sm text-gray-600 mb-2">Popularity</p>
            <p className="text-3xl font-bold text-purple-600 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2" />
              {movie.popularity?.toFixed(0) || 'N/A'}
            </p>
          </div>
          <div className="glass-effect p-6 rounded-2xl">
            <p className="text-sm text-gray-600 mb-2">Rating</p>
            <p className="text-3xl font-bold text-yellow-600 flex items-center">
              <Star className="w-6 h-6 mr-2 fill-current" />
              {movie.vote_average?.toFixed(1) || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Movie Overview */}
      <div className="container mx-auto px-4 mb-8">
        <div className="glass-effect p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Overview</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {movie.overview || 'No overview available.'}
          </p>
          
          {movie.genres && movie.genres.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {movie.production_companies && movie.production_companies.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Production Companies</h3>
              <div className="flex flex-wrap gap-3">
                {movie.production_companies.slice(0, 5).map((company) => (
                  <span
                    key={company.id}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm"
                  >
                    {company.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="container mx-auto px-4 space-y-8">
        {/* Advertisement Space - Top */}
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500 font-semibold">Advertisement Space (728x90)</p>
          <p className="text-sm text-gray-400">Google AdSense or Banner Ad Here</p>
        </div>

        {/* Daily Collection Line Chart */}
        <div className="glass-effect p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Box Office Collection</h2>
          <p className="text-sm text-gray-600 mb-6">Day-wise earning pattern (₹ Crores)</p>
          <div className="h-80">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Collection Tables in Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hindi/Domestic Collection Table */}
          <div className="glass-effect p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🇮🇳 Hindi Net Collection (India)
            </h2>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-2 font-bold">Day</th>
                    <th className="text-left py-3 px-2 font-bold">Date</th>
                    <th className="text-right py-3 px-2 font-bold">Collection</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyCollections.map((day, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                      <td className="py-2 px-2 font-medium">Day {day.day}</td>
                      <td className="py-2 px-2 text-gray-600">{day.date}</td>
                      <td className="py-2 px-2 text-right font-bold text-green-600">
                        ₹{day.hindiCollection.toFixed(2)} Cr
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-green-50 font-bold">
                    <td colSpan="2" className="py-3 px-2">Total Hindi Net</td>
                    <td className="py-3 px-2 text-right text-green-700">
                      ₹{dailyCollections.reduce((sum, d) => sum + d.hindiCollection, 0).toFixed(2)} Cr
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Worldwide Collection Table */}
          <div className="glass-effect p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🌍 Worldwide Gross Collection
            </h2>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-2 font-bold">Day</th>
                    <th className="text-left py-3 px-2 font-bold">Date</th>
                    <th className="text-right py-3 px-2 font-bold">Collection</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyCollections.map((day, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                      <td className="py-2 px-2 font-medium">Day {day.day}</td>
                      <td className="py-2 px-2 text-gray-600">{day.date}</td>
                      <td className="py-2 px-2 text-right font-bold text-purple-600">
                        ₹{day.worldwideCollection.toFixed(2)} Cr
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-purple-50 font-bold">
                    <td colSpan="2" className="py-3 px-2">Total Worldwide</td>
                    <td className="py-3 px-2 text-right text-purple-700">
                      ₹{dailyCollections.reduce((sum, d) => sum + d.worldwideCollection, 0).toFixed(2)} Cr
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Collection Breakdown Bar Chart */}
        <div className="glass-effect p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Financial Breakdown
          </h2>
          <div className="h-80">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* Advertisement Space - Bottom */}
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <p className="text-gray-500 font-semibold text-lg">Advertisement Space (970x250)</p>
          <p className="text-sm text-gray-400">Google AdSense Large Rectangle or Billboard Here</p>
        </div>
      </div>

      {/* Data Source Note */}
      <div className="container mx-auto px-4 mt-8 mb-8">
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-bold text-blue-800 mb-2">📊 About This Data</h3>
          <p className="text-sm text-blue-700">
            <strong>Collection Pattern:</strong> Daily collections are calculated using realistic Bollywood box office patterns 
            (Opening Day: 25%, Weekend: High, Weekdays: Declining).<br/>
            <strong>Data Source:</strong> TMDb provides base revenue data. For production, integrate with Sacnilk/Bollywood Hungama for actual daily collections.
          </p>
        </div>
      </div>
    </div>
  )
}

export default MovieDetail
