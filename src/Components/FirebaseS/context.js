import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from './firebase.js'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { getUserProfile, updateLastActive } from './data.js'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? user.uid : 'no user') // Debug log
      setCurrentUser(user)
      
      if (user) {
        // Get user profile data from Firestore
        try {
          console.log('Fetching profile for user:', user.uid) // Debug log
          const profile = await getUserProfile(user.uid)
          console.log('Profile loaded:', profile) // Debug log
          setUserProfile(profile)
          
          // Update last active time
          await updateLastActive(user.uid)
        } catch (error) {
          console.error('Error loading user profile:', error)
          setUserProfile(null)
        }
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const logout = async () => {
    try {
      await signOut(auth)
      setCurrentUser(null)
      setUserProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const refreshUserProfile = async () => {
    if (currentUser) {
      try {
        console.log('Refreshing profile for:', currentUser.uid) // Debug log
        const profile = await getUserProfile(currentUser.uid)
        console.log('Profile refreshed:', profile) // Debug log
        setUserProfile(profile)
      } catch (error) {
        console.error('Error refreshing user profile:', error)
      }
    }
  }

  const value = {
    currentUser,
    userProfile,
    refreshUserProfile,
    logout,
    loading // Add loading to the context value
  }

  return React.createElement(AuthContext.Provider, { value },
    children // Remove the !loading condition - let components handle loading states
  )
}