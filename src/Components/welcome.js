import React from 'react'

const WelcomeScreen = ({ onStartGame }) => {
  return React.createElement('div', { className: 'welcome-screen' },
    React.createElement('div', { className: 'welcome-content' },
      React.createElement('h1', { className: 'game-title' }, '🥊 UFC KNOCKOUT GUESSER 🥊'),
      React.createElement('p', { className: 'game-description' },
        'Test your UFC knowledge! Watch knockout highlights and guess which fighter delivered the finishing blow.'
      ),
      React.createElement('div', { className: 'game-rules' },
        React.createElement('h3', null, 'How to Play:'),
        React.createElement('ul', null,
          React.createElement('li', null, 'Watch the knockout video'),
          React.createElement('li', null, 'Guess which fighter scored the KO'),
          React.createElement('li', null, 'You get 3 attempts per question'),
          React.createElement('li', null, 'Hints will be provided after wrong answers')
        )
      ),
      React.createElement('button', { 
        className: 'start-button', 
        onClick: onStartGame 
      }, 'START GAME')
    )
  )
}

export default WelcomeScreen