import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import RequireAuth from './auth/RequireAuth.jsx'

<<<<<<< HEAD
import GamePage from './pages/Game/GamePage.jsx'
import ResultPage from './pages/Certificate/ResultPage.jsx'
import ScorePageStandalone from './pages/ScorePageStandalone.jsx'
import LeaderboardPage from './pages/LeaderboardPage.jsx'

=======
>>>>>>> c4aab529800c7f6d987e53657184410f45f54862
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<LoginPage />} />
      <Route
        path="/home"
        element={
          <RequireAuth>
            <LandingPage />
          </RequireAuth>
        }
      />
<<<<<<< HEAD
      <Route
        path="/game"
        element={
          <RequireAuth>
            <GamePage />
          </RequireAuth>
        }
      />
      <Route
        path="/result"
        element={
          <RequireAuth>
            <ResultPage />
          </RequireAuth>
        }
      />
      <Route
        path="/score-standalone"
        element={
          <RequireAuth>
            <ScorePageStandalone />
          </RequireAuth>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <RequireAuth>
            <LeaderboardPage />
          </RequireAuth>
        }
      />
=======
>>>>>>> c4aab529800c7f6d987e53657184410f45f54862
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  )
}

export default App
