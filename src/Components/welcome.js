import React from 'react'

const WelcomeScreen = ({ onStartGame, onStartDaily, onShowLogin, currentUser, onLogout }) => {
  return React.createElement('div', { className: 'welcome-screen' },
    // Login/User section at the top right
    React.createElement('div', { className: 'welcome-header' },
      currentUser 
        ? React.createElement('div', { className: 'user-info' },
            React.createElement('span', { className: 'user-email' }, 
              currentUser.email
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
    
    // Main content below
    React.createElement('div', { className: 'welcome-content' },
      React.createElement('div', { className: 'hero-section' },
        React.createElement('h1', { className: 'game-title' }, 
          React.createElement('span', { className: 'title-icon' }, '🥊'),
          ' UFC KNOCKOUT GUESSER ',
          React.createElement('span', { className: 'title-icon' }, '🥊')
        ),

        React.createElement('p', { className: 'game-description' },
          'Test your UFC knowledge! Watch knockout highlights and guess which fighter delivered the finishing blow.'
        )
      ),
      React.createElement('div', { className: 'game-modes' },
        React.createElement('div', { className: 'mode-card daily-card' },
          React.createElement('div', { className: 'card-header' },
            React.createElement('div', { className: 'mode-icon' }, '📅'),
            React.createElement('h3', { className: 'mode-title' }, 'Daily Challenge'),
            React.createElement('div', { className: 'streak-badge' }, 'NEW!')
          ),
          React.createElement('p', { className: 'mode-description' }, 
            'One knockout question per day. Build your streak and climb the leaderboard!'
          ),

          React.createElement('button', {
            className: 'mode-button daily-button',
            onClick: onStartDaily
          }, 
            React.createElement('span', { className: 'button-text' }, 'START DAILY CHALLENGE'),
            React.createElement('span', { className: 'button-arrow' }, '→')
          )
        ),
        React.createElement('div', { className: 'mode-card quiz-card' },
          React.createElement('div', { className: 'card-header' },
            React.createElement('div', { className: 'mode-icon' }, '🎯'),
            React.createElement('h3', { className: 'mode-title' }, 'Quiz Mode'),
            React.createElement('div', { className: 'difficulty-indicator' }, 'MULTI-LEVEL')
          ),
          React.createElement('p', { className: 'mode-description' }, 
            'Answer multiple questions in a row with different difficulty levels and compete for high scores.'
          ),
        
          React.createElement('button', {
            className: 'mode-button quiz-button',
            onClick: onStartGame
          }, 
            React.createElement('span', { className: 'button-text' }, 'START QUIZ MODE'),
            React.createElement('span', { className: 'button-arrow' }, '→')
          )
        )
      ),
      React.createElement('div', { className: 'welcome-footer' },
        React.createElement('p', { className: 'footer-text' }, 
          'Leader Board'
        )
      )
    )
  )
}

export default WelcomeScreen