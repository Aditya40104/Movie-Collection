import { Link, useNavigate } from 'react-router-dom'
import { Film, BarChart3 } from 'lucide-react'

function Header() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 glass-effect">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                Movie Collection
              </h1>
              <p className="text-xs text-gray-600">Track & Compare</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Rankings
            </Link>
            <Link
              to="/compare"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Compare</span>
            </Link>
          </nav>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/compare')}
            className="btn-primary"
          >
            Compare Movies
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
