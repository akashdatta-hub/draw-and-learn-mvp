import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnalyticsProvider } from './contexts/AnalyticsContext'
import { GameProvider } from './contexts/GameContext'
import Home from './pages/index'
import WordPage from './pages/word/[wordId]'
import ReviewPage from './pages/review'
import LeaderboardPage from './pages/leaderboard'
import DebugPage from './pages/debug'

function App() {
  return (
    <BrowserRouter>
      <AnalyticsProvider>
        <GameProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/word/:wordId" element={<WordPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/debug" element={<DebugPage />} />
          </Routes>
        </GameProvider>
      </AnalyticsProvider>
    </BrowserRouter>
  )
}

export default App
