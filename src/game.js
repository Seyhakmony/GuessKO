import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Welcome from './Components/welcome.js'
import StartingGame from './Components/startGame.js'
import DifficultyMenu from './Components/DifficultyMenu.js'
import KnockoutArchive from './Components/Daily.js'
import Login from './Components/login.js'
import { useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './Components/FirebaseS/context.js'

const GameContent = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [difficulty, setDifficulty] = useState('medium')
  const [userProfile, setUserProfile] = useState(null)

  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const showDifficultyMenu = () => {
    navigate('/difficulty')
  }

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
    navigate('/game')
  }

  const backToWelcome = () => {
    navigate('/')
  }

  return React.createElement(React.Fragment, null,
    React.createElement(Routes, null,
      React.createElement(Route, {
        path: "/",
        element: React.createElement(Welcome, {
          onShowLogin: showLoginModal,
          onShowDifficultyMenu: showDifficultyMenu,
          currentUser: currentUser,
          onLogout: handleLogout,
          setUserProfile: setUserProfile
        })
      }),

      React.createElement(Route, {
        path: "/difficulty",
        element: React.createElement(DifficultyMenu, {
          onSelectDifficulty: selectDifficulty,
          onBack: () => navigate('/')
        })
      }),

      React.createElement(Route, {
        path: "/archive",
        element: React.createElement(KnockoutArchive, {
          onBackToWelcome: backToWelcome
        })
      }),

      React.createElement(Route, {
        path: "/archive/:archiveId",
        element: React.createElement(KnockoutArchive, {
          onBackToWelcome: backToWelcome
        })
      }),

      React.createElement(Route, {
        path: "/game",
        element: React.createElement(StartingGame, {
          onBackToWelcome: backToWelcome,
          difficulty: difficulty,
          currentUser: currentUser,
          userProfile: userProfile
        })
      }),

      React.createElement(Route, {
        path: "*",
        element: React.createElement(Navigate, { to: "/", replace: true })
      })
    ),

    showLogin && React.createElement(Login, {
      onClose: hideLoginModal
    })
  )
}

const Game = () => {
  return React.createElement(AuthProvider, null,
    React.createElement(Router, null,
      React.createElement(GameContent)
    )
  )
}

export default Game