import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from './configFirebase';
import bcrypt from 'bcryptjs';

// Collection name for users
const USERS_COLLECTION = 'users';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Create new user account (context version)
  const createUserAccount = async (username, password) => {
    const result = await createUser(username, password);
    if (result.success) {
      setUser(result.user);
      localStorage.setItem('currentUser', JSON.stringify(result.user));
    }
    return result;
  };

  // Sign in user (context version)
  const signInUserAccount = async (username, password) => {
    const result = await signInUser(username, password);
    if (result.success) {
      setUser(result.user);
      localStorage.setItem('currentUser', JSON.stringify(result.user));
    }
    return result;
  };

  // Sign out user
  const signOut = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  // Context value
  const value = {
    user,
    loading,
    createUser: createUserAccount,
    signInUser: signInUserAccount,
    signOut,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


export const createUser = async (username, password) => {
  try {
    // Check if username already exists
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return { success: false, error: 'Username already exists' };
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user document
    const userId = generateUserId();
    const userDoc = {
      id: userId,
      username: username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    // Save to Firestore
    await setDoc(doc(db, USERS_COLLECTION, userId), userDoc);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = userDoc;
    return { success: true, user: userWithoutPassword };
    
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Failed to create account' };
  }
};

export const signInUser = async (username, password) => {
  try {
    // Find user by username
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Get user document
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Update last login
    const updatedUserData = {
      ...userData,
      lastLogin: new Date().toISOString()
    };
    
    await setDoc(doc(db, USERS_COLLECTION, userData.id), updatedUserData);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = updatedUserData;
    return { success: true, user: userWithoutPassword };
    
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error: 'Failed to sign in' };
  }
};

// Generate unique user ID
const generateUserId = () => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Validate username
export const validateUsername = (username) => {
  if (!username || username.length < 3) {
    return 'Username must be at least 3 characters long';
  }
  if (username.length > 20) {
    return 'Username must be less than 20 characters';
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  return null;
};

// Validate password
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  if (password.length > 50) {
    return 'Password must be less than 50 characters';
  }
  return null;
};