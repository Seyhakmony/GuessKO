import { db } from './firebase.js'
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  increment 
} from 'firebase/firestore'


export const createUserProfile = async (userId, userData) => {
  try {
    console.log('Creating user profile for:', userId, 'with data:', userData)
    
    const userRef = doc(db, 'users', userId)
    const profileData = {
      username: userData.username,
      email: userData.email,
      totalPoints: userData.totalPoints || 0,
      createdAt: new Date().toISOString()
    }
    
    console.log('About to write profile data:', profileData)
    
    await setDoc(userRef, profileData)
    console.log('User profile created successfully')
  } catch (error) {
    console.error('Error creating user profile:', error)
    console.error('Error details:', error.message)
    console.error('Error code:', error.code)
    throw error
  }
}

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      return userSnap.data()
    } else {
      console.log('No user profile found')
      return null
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      ...updates,
      lastUpdated: new Date().toISOString()
    })
    console.log('User profile updated successfully')
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

// New function to add points to user's total
export const addPointsToUser = async (userId, points) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      totalPoints: increment(points),
      lastUpdated: new Date().toISOString()
    })
    
    // console.log(`Added ${points} points to user ${userId}`)
  } catch (error) {
    console.error('Error adding points to user:', error)
    throw error
  }
}

// Save user game data/score
export const saveUserGameData = async (userId, gameData) => {
  try {
    const gameRef = collection(db, 'users', userId, 'games')
    await addDoc(gameRef, {
      ...gameData,
      timestamp: new Date().toISOString()
    })
    console.log('Game data saved successfully')
  } catch (error) {
    console.error('Error saving game data:', error)
    throw error
  }
}

// Get user's game history
export const getUserGameHistory = async (userId, limitCount = 10) => {
  try {
    const gameRef = collection(db, 'users', userId, 'games')
    const q = query(gameRef, orderBy('timestamp', 'desc'), limit(limitCount))
    const querySnapshot = await getDocs(q)
    
    const games = []
    querySnapshot.forEach((doc) => {
      games.push({ id: doc.id, ...doc.data() })
    })
    
    return games
  } catch (error) {
    console.error('Error getting game history:', error)
    throw error
  }
}

export const updateLastActive = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      lastActive: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating last active:', error)
  }
}


export const getLeaderboard = async (limitCount = 10) => {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, orderBy('totalPoints', 'desc'), limit(limitCount))
    const querySnapshot = await getDocs(q)
    
    const leaderboard = []
    querySnapshot.forEach((doc) => {
      const userData = doc.data()
      leaderboard.push({
        id: doc.id,
        username: userData.username,
        totalPoints: userData.totalPoints || 0
      })
    })
    
    // Sort again in JavaScript to ensure proper ordering (Firebase might not handle null/undefined values correctly)
    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints)
    
    return leaderboard
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    return []
  }
}