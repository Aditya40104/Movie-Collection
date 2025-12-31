import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import MovieDetail from './pages/MovieDetail'
import Compare from './pages/Compare'

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </div>
  )
}

export default App
