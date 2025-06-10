import React, { useState } from 'react'
import Welcome from './Components/welcome.js'
import StartingGame from './Components/startGame.js'

const game = () => {
  const [gameStarted, setGameStarted] = useState(false)

  const startGame = () => setGameStarted(true)
  const backToWelcome = () => setGameStarted(false)

  return React.createElement('div', { className: 'App' },
    !gameStarted 
      ? React.createElement(Welcome, { onStartGame: startGame })
      : React.createElement(StartingGame, { onBackToWelcome: backToWelcome })
  )
}

export default game