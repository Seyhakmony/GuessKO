import '../styles/login.css';
import React, { useState } from 'react'
import { auth } from './FirebaseS/firebase.js'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { createUserProfile } from './FirebaseS/data.js'

const Login = ({ onClose }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showCreateAccount, setShowCreateAccount] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (showCreateAccount) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        console.log('Account created:', userCredential.user)


        try {
          await createUserProfile(userCredential.user.uid, {
            email: email,
            username: username,
            totalPoints: 0
          })
          console.log('User profile created successfully')
        } catch (profileError) {
          console.error('Profile creation failed:', profileError)
          throw new Error(`Profile creation failed: ${profileError.message}`)
        }

        alert('Account created successfully!')
      } else {

        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        console.log('Signed in:', userCredential.user)
        alert('Signed in successfully!')
      }


      setEmail('')
      setPassword('')
      setUsername('')
      onClose()
    } catch (error) {
      console.error('Authentication error:', error)
      setError(getErrorMessage(error.code || error.message))
    } finally {
      setLoading(false)
    }
  }

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email'
      case 'auth/wrong-password':
        return 'Incorrect password'
      case 'auth/email-already-in-use':
        return 'Email already registered'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters'
      case 'auth/invalid-email':
        return 'Invalid email address'
      default:
        if (typeof errorCode === 'string' && errorCode.includes('Profile creation failed')) {
          return errorCode
        }
        return 'Authentication failed. Please try again.'
    }
  }

  const handleCreateAccount = () => {
    setShowCreateAccount(true)
    setError('')
  }

  const handleBackToLogin = () => {
    setShowCreateAccount(false)
    setError('')
  }

  return React.createElement('div', { className: 'login-overlay' },
    React.createElement('div', { className: 'login-modal' },
      React.createElement('div', { className: 'login-header' },
        React.createElement('h2', { className: 'login-title' },
          showCreateAccount ? 'Create Account' : 'Login'
        ),
        React.createElement('button', {
          className: 'close-button',
          onClick: onClose
        }, '×')
      ),

      error && React.createElement('div', {
        className: 'error-message',
        style: {
          color: 'red',
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: '#fee',
          borderRadius: '5px',
          fontSize: '14px'
        }
      }, error),

      React.createElement('form', {
        className: 'login-form',
        onSubmit: handleSubmit
      },

        showCreateAccount && React.createElement('div', { className: 'form-group' },
          React.createElement('label', { className: 'form-label' }, 'Username'),
          React.createElement('input', {
            type: 'text',
            className: 'form-input',
            value: username,
            onChange: (e) => setUsername(e.target.value),
            placeholder: 'Choose a username',
            required: true,
            disabled: loading
          })
        ),

        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { className: 'form-label' }, 'Email'),
          React.createElement('input', {
            type: 'email',
            className: 'form-input',
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: 'Enter your email',
            required: true,
            disabled: loading
          })
        ),

        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { className: 'form-label' }, 'Password'),
          React.createElement('input', {
            type: 'password',
            className: 'form-input',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            placeholder: 'Enter your password',
            required: true,
            disabled: loading
          })
        ),

        React.createElement('button', {
          type: 'submit',
          className: 'submit-button',
          disabled: loading,
          style: loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}
        },
          loading
            ? (showCreateAccount ? 'Creating Account...' : 'Signing In...')
            : (showCreateAccount ? 'Create Account' : 'Login')
        )
      ),

      React.createElement('div', { className: 'login-footer' },
        showCreateAccount
          ? React.createElement('button', {
            className: 'toggle-button',
            onClick: handleBackToLogin,
            disabled: loading
          }, 'Back to Login')
          : React.createElement('button', {
            className: 'toggle-button',
            onClick: handleCreateAccount,
            disabled: loading
          }, 'Create an Account')
      )
    )
  )
}

export default Login