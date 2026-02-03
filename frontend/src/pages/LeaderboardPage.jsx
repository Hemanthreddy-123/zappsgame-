<<<<<<< HEAD
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLeaderboard } from '../api/gameApi.js'
import { useAuth } from '../auth/AuthContext.jsx'
import './LeaderboardPage.css'
import { useTheme } from '../hooks/useTheme'

function LeaderboardPage() {
  const navigate = useNavigate()
  const { token, member } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const { theme, toggleTheme } = useTheme()
  const [timeFilter, setTimeFilter] = useState('all') // 'today' | 'all'
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const period = timeFilter === 'today' ? 'today' : undefined;
        const data = await getLeaderboard({ token, period })
        setLeaderboard(data.leaderboard || [])
      } catch (err) {
        console.error('Failed to load leaderboard', err)
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [token, timeFilter])

  const getDisplayName = (entry) => {
    if (entry.player_name) return entry.player_name;
    if (entry.player_email) return entry.player_email.split('@')[0];
    return "Unknown Player";
  }

  // Formatting helpers
  const formatScore = (score) => Math.round(score || 0);
  const formatTime = (time) => Math.round(time || 0);

  // Sorting/Filtering could happen here if API supported it
  const displayList = leaderboard.filter(entry => {
    const name = getDisplayName(entry).toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="game-lb-page">
      {/* 1. Trapezoid Header */}
      <div className="game-lb-header-container">
        <div className="trapezoid-title-block">
          <h2 className="game-title-small">SORTONYM</h2>
          <h1 className="game-lb-title">LEADERBOARD</h1>
        </div>
      </div>

      {/* 2. Controls / Toggle (Styled as tech bars) */}
      <div className="game-lb-controls">
        <button className="game-btn-back" onClick={() => navigate('/home')}>
          <i className="bi bi-arrow-left"></i> BACK
        </button>

        <button className="theme-toggle-lb" onClick={toggleTheme}>
          {theme === 'light' ? <i className="bi bi-moon-fill" /> : <i className="bi bi-sun-fill" />}
        </button>

        <div className="toggle-pill-container">
          <button
            className={`toggle-pill ${timeFilter === 'today' ? 'active' : ''}`}
            onClick={() => setTimeFilter('today')}
          >
            TODAY
          </button>
          <button
            className={`toggle-pill ${timeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTimeFilter('all')}
          >
            ALL TIME
          </button>
        </div>
      </div>

      {/* S. Search Bar */}
      <div className="search-bar-container">
        <div className="search-input-wrapper">

          <input
            type="text"
            className="search-input"
            placeholder="Search player..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 3. The List (Sci-Fi Bars) */}
      <div className="game-lb-list-container">
        {loading && <div className="loading-text">LOADING DATA...</div>}

        {!loading && displayList.map((entry, index) => {
          const rank = index + 1;
          const isMe = member?.email === entry.player_email;
          const displayName = getDisplayName(entry);

          // Trophy Icon Logic
          let trophyIcon = null;
          if (rank === 1) trophyIcon = <i className="bi bi-trophy-fill gold-t"></i>;
          else if (rank === 2) trophyIcon = <i className="bi bi-trophy-fill silver-t"></i>;
          else if (rank === 3) trophyIcon = <i className="bi bi-trophy-fill bronze-t"></i>;
          else trophyIcon = <i className="bi bi-star-fill normal-t"></i>;

          return (
            <div key={index} className={`game-lb-row ${isMe ? 'row-me' : ''}`}>

              {/* Block 1: Trophy */}
              <div className="lb-block block-trophy">
                <div className="skew-fix">{trophyIcon}</div>
              </div>

              {/* Block 2: Rank */}
              <div className="lb-block block-rank">
                <div className="skew-fix">{rank < 10 ? `0${rank}` : rank}</div>
              </div>

              {/* Block 3: Name (Wide) */}
              <div className="lb-block block-name">
                <div className="skew-fix name-content">
                  <i className="bi bi-person-circle"></i>
                  <span>{displayName.toUpperCase()}</span>
                </div>
              </div>

              {/* Block 4: Score */}
              <div className="lb-block block-score">
                <div className="skew-fix">{formatScore(entry.score)}</div>
              </div>

              {/* Block 5: Time */}
              <div className="lb-block block-time">
                <div className="skew-fix">{formatTime(entry.time_taken)}s</div>
              </div>

            </div>
          )
        })}
      </div>

      {/* 4. Start Game Button (Floating Bottom) */}
      <div className="game-lb-footer">
        <button className="btn-start-game-lb" onClick={() => navigate('/game')}>
          <i className="bi bi-play-fill"></i> START NEW CHALLENGE
        </button>
=======
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { getLeaderboard, getGameScore } from '../api/gameApi.js'
import './LeaderboardPage.css'

function LeaderboardPage() {
  const navigate = useNavigate()
  const { token, user, member } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [userScore, setUserScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [leaderboardData, scoreData] = await Promise.all([
        getLeaderboard({ token }),
        getGameScore({ token })
      ])
      
      setLeaderboard(leaderboardData.leaderboard)
      setUserScore(scoreData)
    } catch (err) {
      setError(err.message || 'Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (!userScore || userScore.rounds_played === 0) {
      alert('Play at least one round to share your score!')
      return
    }

    const shareText = `🎯 Sortonym Challenge!\n\n` +
      `Team ${user?.team_no} - ${member?.name}\n` +
      `📊 Total Score: ${userScore.total_score.toFixed(1)}\n` +
      `🎮 Rounds Played: ${userScore.rounds_played}\n` +
      `🏆 Best Round: ${userScore.best_round_score.toFixed(1)}\n` +
      `📈 Average: ${userScore.average_score.toFixed(1)}\n\n` +
      `Can you beat my score? 🚀`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Sortonym Challenge Results',
          text: shareText,
        })
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText)
        alert('Score copied to clipboard!')
      } catch (err) {
        // Fallback to manual copy
        const textArea = document.createElement('textarea')
        textArea.value = shareText
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert('Score copied to clipboard!')
      }
    }
  }

  const handleBackToGame = () => {
    navigate('/landing')
  }

  if (loading) {
    return (
      <div className="leaderboard-page">
        <div className="loading-container">
          <h2>Loading Leaderboard...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="leaderboard-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={loadData}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1>🏆 Leaderboard</h1>
        <button className="btn-secondary" onClick={handleBackToGame}>
          Back to Game
        </button>
      </div>

      {userScore && (
        <div className="user-stats">
          <h2>Your Stats</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Score</span>
              <span className="stat-value">{userScore.total_score.toFixed(1)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Rounds Played</span>
              <span className="stat-value">{userScore.rounds_played}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Best Round</span>
              <span className="stat-value">{userScore.best_round_score.toFixed(1)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Score</span>
              <span className="stat-value">{userScore.average_score.toFixed(1)}</span>
            </div>
          </div>
          <button className="btn-primary share-btn" onClick={handleShare}>
            📤 Share Score
          </button>
        </div>
      )}

      <div className="leaderboard-container">
        <h2>Top Players</h2>
        {leaderboard.length === 0 ? (
          <div className="empty-leaderboard">
            <p>No scores yet. Be the first to play!</p>
          </div>
        ) : (
          <div className="leaderboard-list">
            {leaderboard.map((player, index) => (
              <div 
                key={index} 
                className={`leaderboard-item ${
                  player.team_no === user?.team_no ? 'current-user' : ''
                }`}
              >
                <div className="rank">
                  {player.rank === 1 && '🥇'}
                  {player.rank === 2 && '🥈'}
                  {player.rank === 3 && '🥉'}
                  {player.rank > 3 && `#${player.rank}`}
                </div>
                <div className="player-info">
                  <div className="player-name">
                    Team {player.team_no} - {player.name}
                  </div>
                  <div className="player-details">
                    {player.rounds_played} rounds • Best: {player.best_round.toFixed(1)}
                  </div>
                </div>
                <div className="player-score">
                  {player.total_score.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        )}
>>>>>>> c4aab529800c7f6d987e53657184410f45f54862
      </div>
    </div>
  )
}

export default LeaderboardPage
