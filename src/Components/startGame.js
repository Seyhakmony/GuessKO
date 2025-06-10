import React, { useState } from 'react'
import fighters from './MMAFighters.js';
import './game.css';

const gameData = [
    {
        videoPath: './clips/IzzyW.mp4',
        correctAnswer: 'Izzy',
        correctVideo: './correct/Izzy_vs_Rob.mp4',
        hint1: 'This fighter is known for his left hand power',
        hint2: 'He\'s a former Middle Weight Champion'
    },
    {
        videoPath: './clips/IzzyW.mp4',
        correctAnswer: 'Izzy',
        correctVideo: './correct/Izzy_vs_Rob.mp4',
        hint1: 'This fighter is known for his left hand power',
        hint2: 'He\'s from Ireland and loves to talk trash'
    },
    {
        videoPath: './clips/IzzyW.mp4',
        correctAnswer: 'Izzy',
        correctVideo: './correct/Izzy_vs_Rob.mp4',
        hint1: 'This fighter is known for his left hand power',
        hint2: 'He\'s from Ireland and loves to talk trash'
    },
    {
        videoPath: './clips/IzzyW.mp4',
        correctAnswer: 'Izzy',
        correctVideo: './correct/Izzy_vs_Rob.mp4',
        hint1: 'This fighter is known for his left hand power',
        hint2: 'He\'s from Ireland and loves to talk trash'
    },
    {
        videoPath: './clips/IzzyW.mp4',
        correctAnswer: 'Izzy',
        correctVideo: './correct/Izzy_vs_Rob.mp4',
        hint1: 'This fighter is known for his left hand power',
        hint2: 'He\'s from Ireland and loves to talk trash'
    },
    {
        videoPath: './clips/IzzyW.mp4',
        correctAnswer: 'Izzy',
        correctVideo: './correct/Izzy_vs_Rob.mp4',
        hint1: 'This fighter is known for his left hand power',
        hint2: 'He\'s from Ireland and loves to talk trash'
    },
    {
        videoPath: './clips/IzzyW.mp4',
        correctAnswer: 'Izzy',
        correctVideo: './correct/Izzy_vs_Rob.mp4',
        hint1: 'This fighter is known for his left hand power',
        hint2: 'He\'s from Ireland and loves to talk trash'
    },
    {
        videoPath: './clips/IzzyW.mp4',
        correctAnswer: 'Izzy',
        correctVideo: './correct/Izzy_vs_Rob.mp4',
        hint1: 'This fighter is known for his left hand power',
        hint2: 'He\'s from Ireland and loves to talk trash'
    },
    {
        videoPath: './clips/IzzyW.mp4',
        correctAnswer: 'Izzy',
        correctVideo: './correct/Izzy_vs_Rob.mp4',
        hint1: 'This fighter is known for his left hand power',
        hint2: 'He\'s from Ireland and loves to talk trash'
    },
    {
        videoPath: './clips/IzzyW.mp4',
        correctAnswer: 'Izzy',
        correctVideo: './correct/Izzy_vs_Rob.mp4',
        hint1: 'This fighter is known for his left hand power',
        hint2: 'He\'s from Ireland and loves to talk trash'
    },
    {
        videoPath: './clips/IzzyW.mp4',
        correctAnswer: 'Izzy',
        correctVideo: './correct/Izzy_vs_Rob.mp4',
        hint1: 'This fighter is known for his left hand power',
        hint2: 'He\'s from Ireland and loves to talk trash'
    },
    {
        videoPath: './clips/IzzyW.mp4',
        correctAnswer: 'Izzy',
        correctVideo: './correct/Izzy_vs_Rob.mp4',
        hint1: 'This fighter is known for his left hand power',
        hint2: 'He\'s from Ireland and loves to talk trash'
    }
]

const GameScreen = ({ onBackToWelcome }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [attempts, setAttempts] = useState(0)
    const [userAnswer, setUserAnswer] = useState('')
    const [feedback, setFeedback] = useState('')
    const [isCorrect, setIsCorrect] = useState(false)
    const [showHint, setShowHint] = useState(false)
    const [gameComplete, setGameComplete] = useState(false)
    const [score, setScore] = useState(0)
    const [showCorrectVideo, setShowCorrectVideo] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)

    const [usedAnswers, setUsedAnswers] = useState([])
    const currentData = gameData[currentQuestion]


    const normalizeAnswer = (answer) => {
        return answer.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '')
    }

    const handleInputChange = (value) => {
        setUserAnswer(value)

        if (value.length > 0 && !isCorrect && attempts < 3) {
            const filtered = fighters.filter(fighter =>
                fighter.toLowerCase().startsWith(value.toLowerCase())
            ).slice(0, 15) //drop down amunt
            setSuggestions(filtered)
            setShowSuggestions(true)
        } else {
            setShowSuggestions(false)
        }
    }

    const handleInputFocus = () => {
        if (userAnswer.length > 0 && !isCorrect && attempts < 3) {
            const filtered = fighters.filter(fighter =>
                fighter.toLowerCase().startsWith(userAnswer.toLowerCase())
            ).slice(0, 15)
            setSuggestions(filtered)
            setShowSuggestions(true)
        }
    }

    const handleSuggestionClick = (suggestion) => {
        setUserAnswer(suggestion)
        setShowSuggestions(false)
    }



    const checkAnswer = () => {
        if (!userAnswer.trim()) {
            setFeedback('Please enter an answer!')
            return
        }

        const isValidFighter = fighters.some(fighter =>
            fighter.toLowerCase() === userAnswer.toLowerCase()
        )

        if (!isValidFighter) {
            setFeedback('Please select a fighter from the suggestion list!')
            return
        }

        if (usedAnswers.some(used => used.toLowerCase() === userAnswer.toLowerCase())) {
            setFeedback('Duplicate submission! You already tried this fighter.')
            return
        }

        setUsedAnswers([...usedAnswers, userAnswer])

        const normalizedUserAnswer = normalizeAnswer(userAnswer)
        const normalizedCorrectAnswer = normalizeAnswer(currentData.correctAnswer)
        const normalizedAltAnswer = currentData.correctAnswerAlt ?
            normalizeAnswer(currentData.correctAnswerAlt) : null

        const isAnswerCorrect = normalizedUserAnswer === normalizedCorrectAnswer ||
            (normalizedAltAnswer && normalizedUserAnswer === normalizedAltAnswer)

        if (isAnswerCorrect) {
            setIsCorrect(true)
            setShowCorrectVideo(true)
            setFeedback('🎉 Correct! Great job!')
            setScore(score + (3 - attempts))
        } else {
            const newAttempts = attempts + 1
            setAttempts(newAttempts)
            setUserAnswer('')

            if (newAttempts >= 3) {
                setFeedback(`❌ Sorry, that's incorrect. The answer was: ${currentData.correctAnswer}`)
                setShowCorrectVideo(true)
                setIsCorrect(false)
            } else {
                const hint = newAttempts === 1 ? currentData.hint1 : currentData.hint2
                setFeedback(`❌ Incorrect! Hint: ${hint}`)
                setShowHint(true)
            }
        }
    }


    const nextQuestion = () => {
        if (currentQuestion < gameData.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            resetQuestion()
        } else {
            setGameComplete(true)
        }
    }

    const resetQuestion = () => {
        setAttempts(0)
        setUserAnswer('')
        setFeedback('')
        setIsCorrect(false)
        setShowHint(false)
        setShowCorrectVideo(false)
        setShowSuggestions(false)
        setUsedAnswers([])
    }

    const restartGame = () => {
        setCurrentQuestion(0)
        setScore(0)
        setGameComplete(false)
        resetQuestion()
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isCorrect && attempts < 3) {
            checkAnswer()
        }
    }

    if (gameComplete) {
        return React.createElement('div', { className: 'game-complete' },
            React.createElement('div', { className: 'complete-content' },
                React.createElement('h2', null, '🏆 Game Complete! 🏆'),
                React.createElement('p', { className: 'final-score' }, `Final Score: ${score} points`),
                React.createElement('p', { className: 'score-breakdown' },
                    `Out of ${gameData.length} questions with a maximum of ${gameData.length * 3} points`
                ),
                React.createElement('div', { className: 'complete-buttons' },
                    React.createElement('button', {
                        className: 'restart-button',
                        onClick: restartGame
                    }, 'PLAY AGAIN'),
                    React.createElement('button', {
                        className: 'back-button',
                        onClick: onBackToWelcome
                    }, 'BACK TO MENU')
                )
            )
        )
    }

    return React.createElement('div', { className: 'game-screen' },
        React.createElement('div', { className: 'game-header' },
            React.createElement('div', { className: 'question-info' },
                React.createElement('h2', null, `Question ${currentQuestion + 1} of ${gameData.length}`),
                React.createElement('p', { className: 'score' }, `Score: ${score} points`)
            ),
            React.createElement('button', {
                className: 'back-button-small',
                onClick: onBackToWelcome
            }, '← Back to Menu')
        ),
        React.createElement('div', { className: 'question-container' },
            React.createElement('h3', { className: 'question-text' }, 'Who scored this knockout?'),
            React.createElement('div', { className: 'video-container' },
                React.createElement('video', {
                    key: showCorrectVideo ? currentData.correctVideo : currentData.videoPath,
                    controls: true,
                    autoPlay: true,
                    muted: true,
                    loop: true,
                    className: 'knockout-video'
                },
                    React.createElement('source', {
                        src: showCorrectVideo ? currentData.correctVideo : currentData.videoPath,
                        type: 'video/mp4'
                    }),
                    'Your browser does not support the video tag.'
                )
            ),
            React.createElement('div', { className: 'input-section' },
                React.createElement('div', { className: 'attempts-indicator' },
                    React.createElement('span', null, `Attempts: ${attempts}/3`),
                    showHint && React.createElement('span', { className: 'hint-indicator' }, '💡 Hint provided')
                ),
                usedAnswers.length > 0 && React.createElement('div', {
                    className: 'used-answers'
                },
                    React.createElement('p', { className: 'used-answers-label' }, 'Already tried:'),
                    React.createElement('div', { className: 'used-answers-list' },
                        usedAnswers.map((answer, index) =>
                            React.createElement('span', {
                                key: index,
                                className: 'used-answer-item'
                            }, answer)
                        )
                    )
                ),
                React.createElement('div', { className: 'answer-input' },
                    React.createElement('div', { className: 'input-wrapper', style: { position: 'relative' } },
                        React.createElement('input', {
                            type: 'text',
                            value: userAnswer,
                            onChange: (e) => handleInputChange(e.target.value),
                            onFocus: handleInputFocus, // Add this line
                            onKeyPress: handleKeyPress,
                            onBlur: () => setTimeout(() => setShowSuggestions(false), 150),
                            placeholder: 'Enter fighter name...',
                            disabled: isCorrect || attempts >= 3,
                            className: 'answer-field'
                        }),
                        showSuggestions && suggestions.length > 0 && React.createElement('div', {
                            className: 'suggestions-dropdown'
                        }, suggestions.map((suggestion, index) =>
                            React.createElement('div', {
                                key: index,
                                className: 'suggestion-item',
                                onClick: () => handleSuggestionClick(suggestion)
                            }, suggestion)
                        ))
                    ),
                    React.createElement('button', {
                        onClick: checkAnswer,
                        disabled: isCorrect || attempts >= 3,
                        className: 'submit-button'
                    }, 'SUBMIT')
                ),
                feedback && React.createElement('div', {
                    className: `feedback ${isCorrect ? 'correct' : 'incorrect'}`
                }, feedback),
                (isCorrect || attempts >= 3) && React.createElement('button', {
                    className: 'next-button',
                    onClick: nextQuestion
                }, currentQuestion < gameData.length - 1 ? 'NEXT QUESTION' : 'FINISH GAME')
            )
        )
    )
}

export default GameScreen