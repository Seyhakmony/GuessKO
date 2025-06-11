
import React from 'react'
import '../styles/difficulty.css'

const DifficultyMenu = ({ onSelectDifficulty, onBack }) => {
  return React.createElement('div', { className: 'difficulty-overlay' },
    React.createElement('div', { className: 'difficulty-menu' },
      React.createElement('div', { className: 'difficulty-header' },
        React.createElement('h2', null, 'Choose Difficulty'),
        React.createElement('button', {
          className: 'close-button',
          onClick: onBack
        }, '✕')
      ),
      React.createElement('div', { className: 'difficulty-options' },
        React.createElement('div', {
          className: 'difficulty-card easy',
          onClick: () => onSelectDifficulty('easy')
        },
          React.createElement('h3', null, '🟢 EASY'),
          React.createElement('div', { className: 'difficulty-description' },
            React.createElement('p', null, '• Unlimited attempts'),
            React.createElement('p', null, '• 2 hints available'),
            React.createElement('p', null, '• Perfect for beginners')
          )
        ),
        React.createElement('div', {
          className: 'difficulty-card medium',
          onClick: () => onSelectDifficulty('medium')
        },
          React.createElement('h3', null, '🟡 MEDIUM'),
          React.createElement('div', { className: 'difficulty-description' },
            React.createElement('p', null, '• 3 attempts per question'),
            React.createElement('p', null, '• 2 hints available'),
            React.createElement('p', null, '• Balanced challenge')
          )
        ),
        React.createElement('div', {
          className: 'difficulty-card hard',
          onClick: () => onSelectDifficulty('hard')
        },
          React.createElement('h3', null, '🔴 HARD'),
          React.createElement('div', { className: 'difficulty-description' },
            React.createElement('p', null, '• Only 1 attempt'),
            React.createElement('p', null, '• No hints'),
            React.createElement('p', null, '• For UFC experts only')
          )
        )
      )
    )
  )
}

export default DifficultyMenu