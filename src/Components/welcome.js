import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLeaderboard } from './FirebaseS/data.js'

const WelcomeScreen = ({ onShowLogin, currentUser, onLogout, userProfile, setUserProfile, onShowDifficultyMenu }) => {
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await getLeaderboard(10)
        setLeaderboardData(data)

        if (currentUser && data.length > 0) {
          const currentUserInLeaderboard = data.find(
            player => player.id === currentUser.uid
          )
          if (currentUserInLeaderboard && setUserProfile) {
            setUserProfile(currentUserInLeaderboard)
          }
        }
      } catch (error) {
        console.error('Error loading leaderboard:', error)
      } finally {
        setLoadingLeaderboard(false)
      }
    }

    loadLeaderboard()
  }, [currentUser, setUserProfile])

const handleStartGame = () => {
  onShowDifficultyMenu()
}

  const handleArchive = () => {
    navigate('/archive')
  }


  
  const getCurrentUserPoints = () => {
    if (!currentUser || !leaderboardData.length) return 0

    console.log('Current user UID:', currentUser.uid)
    console.log('Leaderboard data:', leaderboardData)

    const currentUserInLeaderboard = leaderboardData.find(
      player => player.id === currentUser.uid
    )

    console.log('Found user in leaderboard:', currentUserInLeaderboard)

    return currentUserInLeaderboard?.totalPoints || 0
  }

  const getCurrentUserRank = () => {
    if (!currentUser || !leaderboardData.length) return null

    const currentUserIndex = leaderboardData.findIndex(
      player => player.id === currentUser.uid
    )

    return currentUserIndex !== -1 ? currentUserIndex + 1 : 'Casual'
  }

  return React.createElement('div', { className: 'welcome-screen' },
    React.createElement('div', { className: 'welcome-header' },
      currentUser
        ? React.createElement('div', { className: 'user-info' },
          React.createElement('div', { className: 'user-stats' },
            React.createElement('div', { className: 'user-points' },
              React.createElement('span', { className: 'points-label' }, '🏆 '),
              React.createElement('span', { className: 'points-value' },
                `${getCurrentUserPoints()} pts`
              )
            ),
            getCurrentUserRank() && React.createElement('div', { className: 'user-rank' },
              React.createElement('span', { className: 'rank-label' }, 'Rank: #'),
              React.createElement('span', { className: 'rank-value' }, getCurrentUserRank())
            )
          ),
          React.createElement('span', { className: 'user-email' },
            (() => {
              const userInLeaderboard = leaderboardData.find(player => player.id === currentUser.uid)
              return userInLeaderboard?.username || currentUser.email
            })()
          ),
          React.createElement('button', {
            className: 'logout-button',
            onClick: onLogout
          }, 'Logout')
        )
        : React.createElement('button', {
          className: 'login-button',
          onClick: onShowLogin
        }, 'Login')
    ),

    React.createElement('div', { className: 'welcome-content' },
      React.createElement('div', { className: 'hero-section' },
        React.createElement('h1', { className: 'game-title' },
          React.createElement('img', {
            src: '/images/left.webp',
            alt: 'Boxing Glove',
            className: 'title-icon-img'
          }),
          ' GUESS THE KNOCKOUT ',
          React.createElement('img', {
            src: '/images/right.webp',
            alt: 'Boxing Glove',
            className: 'title-icon-img'
          })
        ),

        React.createElement('p', { className: 'game-description' },
          'Test your UFC knowledge! Watch knockout highlights and guess which fighter delivered the finishing blow.'
        )
      ),
      React.createElement('div', { className: 'game-modes' },
        React.createElement('div', { className: 'mode-card daily-card' },
          React.createElement('div', { className: 'card-header' },
            React.createElement('div', { className: 'mode-icon' }, '📆'),
            React.createElement('h3', { className: 'mode-title' }, 'Daily Knockout Archive'),
          ),
          React.createElement('p', { className: 'mode-description' },
            "Each day brings a new challenger. Answer a range of questions, test your knowledge, and try as many times as you like — it's completely free."
          ),
          React.createElement('button', {
            className: 'mode-button daily-button',
            onClick: handleArchive
          },
            React.createElement('span', { className: 'button-text' }, 'View Menu'),
            React.createElement('span', { className: 'button-arrow' }, ' →')
          )
        ),
        React.createElement('div', { className: 'mode-card quiz-card' },
          React.createElement('div', { className: 'card-header' },
            React.createElement('div', { className: 'mode-icon' }, '📝'),
            React.createElement('h3', { className: 'mode-title' }, 'Quiz Mode'),
          ),
          React.createElement('p', { className: 'mode-description' },
            'Answer multiple questions in a row with different difficulty levels and compete for high scores.'
          ),
          React.createElement('button', {
            className: 'mode-button quiz-button',
            onClick: handleStartGame
          },
            React.createElement('span', { className: 'button-text' }, 'START QUIZ MODE'),
            React.createElement('span', { className: 'button-arrow' }, ' →')
          )
        )
      ),
      React.createElement('div', { className: 'leaderboard' },
        React.createElement('h3', { className: 'leaderboard-title' }, 'Leaderboard'),
        loadingLeaderboard
          ? React.createElement('p', { className: 'loading-text' }, 'Loading...')
          : leaderboardData.length > 0
            ? React.createElement('table', { className: 'leaderboard-table' },
              React.createElement('thead', {},
                React.createElement('tr', {},
                  React.createElement('th', {}, 'Rank'),
                  React.createElement('th', {}, 'Name'),
                  React.createElement('th', {}, 'Points')
                )
              ),
              React.createElement('tbody', {},
                ...leaderboardData.map((player, index) =>
                  React.createElement('tr', {
                    key: player.id,
                    className: `leaderboard-row ${index === 0 ? 'first-place' : index === 1 ? 'second-place' : index === 2 ? 'third-place' : ''}${currentUser && player.id === currentUser.uid ? ' current-user' : ''}`
                  },
                    React.createElement('td', { className: 'rank-cell' },
                      index === 0 ? '🥇 1' : index === 1 ? '🥈 2' : index === 2 ? '🥉 3' : `${index + 1}`
                    ),
                    React.createElement('td', { className: 'name-cell' }, player.username),
                    React.createElement('td', { className: 'points-cell' }, player.totalPoints)
                  )
                )
              )
            )
            : React.createElement('p', { className: 'no-data-text' }, 'No players yet. Be the first!')
      ),

      React.createElement('div', { className: 'simple-footer' },
        React.createElement('p', { className: 'footer-text' },
          "This is an independent project. I'll update it as often as I can — hope you all enjoy!",
          React.createElement('br'),
          React.createElement('br'),
          '©2025 Guess The Knockout',
        )
      )
    )
  )
}

export default WelcomeScreen