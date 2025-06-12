import React, { useState } from 'react'
import Welcome from './Components/welcome.js'
import StartingGame from './Components/startGame.js'
import DifficultyMenu from './Components/DifficultyMenu.js'
import DailyChallenge from './Components/Daily.js'
import Login from './Components/login.js'
import { AuthProvider, useAuth } from './Components/FirebaseS/context.js'

const GameContent = () => {
  const [gameStarted, setGameStarted] = useState(false)
  const [showDifficulty, setShowDifficulty] = useState(false)
  const [showDaily, setShowDaily] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [difficulty, setDifficulty] = useState('medium')
  const [userProfile, setUserProfile] = useState(null) 
  
  const { currentUser, logout } = useAuth()

  const showDifficultyMenu = () => setShowDifficulty(true)
  const hideDifficultyMenu = () => setShowDifficulty(false)
  const showDailyChallenge = () => setShowDaily(true)
  const showLoginModal = () => setShowLogin(true)
  const hideLoginModal = () => setShowLogin(false)

  const handleLogout = async () => {
    try {
      await logout()
      setUserProfile(null)
      alert('Logged out successfully!')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const selectDifficulty = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty)
    setShowDifficulty(false)
    setGameStarted(true)
  }

  const backToWelcome = () => {
    setGameStarted(false)
    setShowDifficulty(false)
    setShowDaily(false)
  }

  return React.createElement('div', { className: 'App' },
    !gameStarted && !showDaily
      ? React.createElement(Welcome, {
           onStartGame: showDifficultyMenu,
          onStartDaily: showDailyChallenge,
          onShowLogin: showLoginModal,
          currentUser: currentUser,
          onLogout: handleLogout,
          setUserProfile: setUserProfile
        })
      : showDaily
        ? React.createElement(DailyChallenge, {
            onBackToWelcome: backToWelcome
          })
        : React.createElement(StartingGame, {
            onBackToWelcome: backToWelcome,
            difficulty: difficulty,
            currentUser: currentUser,
            userProfile: userProfile
          }),
    showDifficulty && React.createElement(DifficultyMenu, {
      onSelectDifficulty: selectDifficulty,
      onBack: hideDifficultyMenu
    }),
    showLogin && React.createElement(Login, {
      onClose: hideLoginModal
    })
  )
}

const Game = () => {
  return React.createElement(AuthProvider, null,
    React.createElement(GameContent)
  )
}

export default Game