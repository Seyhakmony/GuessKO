import React, { useState, useEffect } from 'react'
import fighters from './MMAFighters.js';
import '../styles/game.css';
import  '../styles/daily.css';

const gameData = [
    {
        videoPath: './clips/BucklyW.mp4',
        correctAnswer: 'Joaquin Buckley',
        correctVideo: './correct/Buckly_vs.mp4',
        hint1: 'Explosive fighter',
        hint2: 'Known for viral knockout highlight'
    },
    {
        videoPath: './clips/ConorW.mp4',
        correctAnswer: 'Conor Mcgregor',
        correctVideo: './correct/Conor_vs_Aldo.mp4',
        hint1: 'Southpaw striker',
        hint2: 'Made boxing debut in 2017'
    },
    {
        videoPath: './clips/IliaW.mp4',
        correctAnswer: 'Ilia Topuria',
        correctVideo: './correct/Ilia_vs_Alex.mp4',
        hint1: 'European fighter',
        hint2: 'Undefeated record holder'
    },
    {
        videoPath: './clips/Izzy_AlexW.mp4',
        correctAnswer: 'Israel Adesanya',
        correctVideo: './correct/Alex_vs_Izzy2.mp4',
        hint1: 'Tall striker',
        hint2: 'Has kickboxing background'
    },
    {
        videoPath: './clips/IzzyW.mp4',
        correctAnswer: 'Israel Adesanya',
        correctVideo: './correct/Izzy_vs_Rob.mp4',
        hint1: 'Creative fighter',
        hint2: 'Trained in New Zealand'
    },
    {
        videoPath: './clips/KaiFranceW.mp4',
        correctAnswer: 'Kai Kara-france',
        correctVideo: './correct/France_vs_Cody.mp4',
        hint1: 'Smaller weight class',
        hint2: 'Pacific region fighter'
    },
    {
        videoPath: './clips/LeonW.mp4',
        correctAnswer: 'Leon Edwards',
        correctVideo: './correct/Leon_vs_Usman.mp4',
        hint1: 'British fighter',
        hint2: 'Late-round finisher'
    },
    {
        videoPath: './clips/MasvidalW.mp4',
        correctAnswer: 'Jorge Masvidal',
        correctVideo: './correct/Masvidal_vs_Askren.mp4',
        hint1: 'Veteran fighter',
        hint2: 'Set speed record'
    },
    {
        videoPath: './clips/MaxHollowayW.mp4',
        correctAnswer: 'Max Holloway',
        correctVideo: './correct/Max_vs_Justin.mp4',
        hint1: 'High-volume striker',
        hint2: 'Island-born fighter'
    },
    {
        videoPath: './clips/OmalleyW.mp4',
        correctAnswer: "Sean O'malley",
        correctVideo: './correct/Omalley_vs_White.mp4',
        hint1: 'Colorful personality',
        hint2: 'Western US fighter'
    },
    {
        videoPath: './clips/SilvaW.mp4',
        correctAnswer: 'Anderson Silva',
        correctVideo: './correct/Silva_vs_Griffin.mp4',
        hint1: 'Brazilian legend',
        hint2: 'Long title reign'
    },
    {
        videoPath: './clips/VolkanW.mp4',
        correctAnswer: 'Volkan Oezdemir',
        correctVideo: './correct/Oezdemir_vs_Walker.mp4',
        hint1: 'European striker',
        hint2: 'Light heavyweight division'
    }
]

const DailyChallenge = ({ onBackToWelcome }) => {
    const [selectedDate, setSelectedDate] = useState(null)
    const [showCalendar, setShowCalendar] = useState(true)
    const [currentData, setCurrentData] = useState(null)
    const [attempts, setAttempts] = useState(0)
    const [userAnswer, setUserAnswer] = useState('')
    const [feedback, setFeedback] = useState('')
    const [isCorrect, setIsCorrect] = useState(false)
    const [showCorrectVideo, setShowCorrectVideo] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [usedAnswers, setUsedAnswers] = useState([])
    const [vissbleS, setVissbleS] = useState(15)
    const [dailyProgress, setDailyProgress] = useState({})

    // Generate available dates (today and previous days based on gameData length)
    const generateAvailableDates = () => {
        const dates = []
        const today = new Date()
        
        for (let i = 0; i < gameData.length; i++) {
            const date = new Date(today)
            date.setDate(today.getDate() - i)
            dates.push({
                date: date,
                dateString: date.toDateString(),
                dayIndex: i,
                isToday: i === 0
            })
        }
        return dates
    }

    const availableDates = generateAvailableDates()

    // Get question data for a specific date
    const getQuestionForDate = (dayIndex) => {
        // Reverse order so today (index 0) gets the last question
        const questionIndex = gameData.length - 1 - dayIndex
        return gameData[questionIndex]
    }

    // Load saved progress from memory
    useEffect(() => {
        // In a real app, this would load from localStorage
        // For now, we'll just use in-memory storage
        const savedProgress = {}
        setDailyProgress(savedProgress)
    }, [])

    // Save progress to memory
    const saveProgress = (dateString, correct, attempts) => {
        const newProgress = {
            ...dailyProgress,
            [dateString]: { correct, attempts, completed: true }
        }
        setDailyProgress(newProgress)
        // In a real app, you would save to localStorage here
    }

    const handleDateSelect = (dateInfo) => {
        setSelectedDate(dateInfo)
        setCurrentData(getQuestionForDate(dateInfo.dayIndex))
        setShowCalendar(false)
        resetQuestion()
    }

    const resetQuestion = () => {
        setAttempts(0)
        setUserAnswer('')
        setFeedback('')
        setIsCorrect(false)
        setShowCorrectVideo(false)
        setShowSuggestions(false)
        setUsedAnswers([])
        setVissbleS(15)
    }

    const normalizeAnswer = (answer) => {
        return answer.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '')
    }

    const handleInputChange = (value) => {
        setUserAnswer(value)

        if (value.length > 0 && !isCorrect && attempts < 3) {
            const filtered = fighters.filter(fighter => {
                const searchTerm = value.toLowerCase()
                const fighterName = fighter.toLowerCase()
                const nameParts = fighterName.split(' ')

                return fighterName.includes(searchTerm) ||
                    nameParts.some(part => part.startsWith(searchTerm))
            }).slice(0, vissbleS)
            setSuggestions(filtered)
            setShowSuggestions(true)
        } else {
            setShowSuggestions(false)
        }
    }

    const handleInputFocus = () => {
        if (userAnswer.length > 0 && !isCorrect && attempts < 3) {
            const filtered = fighters.filter(fighter => {
                const searchTerm = userAnswer.toLowerCase()
                const fighterName = fighter.toLowerCase()
                const nameParts = fighterName.split(' ')

                return fighterName.includes(searchTerm) ||
                    nameParts.some(part => part.startsWith(searchTerm))
            }).slice(0, vissbleS)
            setSuggestions(filtered)
            setShowSuggestions(true)
        }
    }

    const handleSuggestionClick = (suggestion) => {
        setUserAnswer(suggestion)
        setShowSuggestions(false)
    }

    const handleSuggestionScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            setVissbleS(prev => {
                const newCount = prev + 15
                if (userAnswer.length > 0) {
                    const filtered = fighters.filter(fighter => {
                        const searchTerm = userAnswer.toLowerCase()
                        const fighterName = fighter.toLowerCase()
                        const nameParts = fighterName.split(' ')

                        return fighterName.includes(searchTerm) ||
                            nameParts.some(part => part.startsWith(searchTerm))
                    }).slice(0, newCount)
                    setSuggestions(filtered)
                }
                return newCount
            })
        }
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

        const normalizedUserAnswer = normalizeAnswer(userAnswer)
        const normalizedCorrectAnswer = normalizeAnswer(currentData.correctAnswer)

        const isAnswerCorrect = normalizedUserAnswer === normalizedCorrectAnswer

        if (isAnswerCorrect) {
            setIsCorrect(true)
            setShowCorrectVideo(true)
            setFeedback('🎉 Correct! Great job!')
            saveProgress(selectedDate.dateString, true, attempts + 1)
        } else {
            setUsedAnswers([...usedAnswers, userAnswer])
            const newAttempts = attempts + 1
            setAttempts(newAttempts)
            setUserAnswer('')

            if (newAttempts >= 3) {
                setFeedback(`❌ Sorry, that's incorrect. The answer was: ${currentData.correctAnswer}`)
                setShowCorrectVideo(true)
                setIsCorrect(false)
                saveProgress(selectedDate.dateString, false, newAttempts)
            } else {
                const hint = newAttempts === 1 ? currentData.hint1 : currentData.hint2
                setFeedback(`❌ Incorrect! Hint: ${hint}`)
            }
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isCorrect && attempts < 3) {
            checkAnswer()
        }
    }

    const backToCalendar = () => {
        setShowCalendar(true)
        setSelectedDate(null)
        setCurrentData(null)
        resetQuestion()
    }

    const formatDate = (date) => {
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1)
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today'
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday'
        } else {
            return date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            })
        }
    }

    if (showCalendar) {
        return React.createElement('div', { className: 'daily-challenge' },
            React.createElement('div', { className: 'daily-header' },
                React.createElement('h1', { className: 'daily-title' }, '📅 Daily Challenge'),
                React.createElement('p', { className: 'daily-subtitle' }, 
                    'One knockout question per day. Complete your daily challenge!'
                ),
                React.createElement('button', {
                    className: 'back-button-small',
                    onClick: onBackToWelcome
                }, '← Back to Menu')
            ),
            React.createElement('div', { className: 'calendar-container' },
                React.createElement('h2', null, 'Select a Day'),
                React.createElement('div', { className: 'calendar-grid' },
                    availableDates.map((dateInfo, index) => {
                        const progress = dailyProgress[dateInfo.dateString]
                        const isCompleted = progress && progress.completed
                        const isCorrect = progress && progress.correct
                        
                        return React.createElement('div', {
                            key: index,
                            className: `calendar-day ${dateInfo.isToday ? 'today' : ''} ${isCompleted ? (isCorrect ? 'completed-correct' : 'completed-incorrect') : 'available'}`,
                            onClick: () => handleDateSelect(dateInfo)
                        },
                            React.createElement('div', { className: 'day-label' }, formatDate(dateInfo.date)),
                            React.createElement('div', { className: 'day-number' }, dateInfo.date.getDate()),
                            isCompleted && React.createElement('div', { className: 'completion-badge' },
                                isCorrect ? '✅' : '❌'
                            )
                        )
                    })
                )
            )
        )
    }

    // Question view (similar to original game but simplified)
    return React.createElement('div', { className: 'daily-question' },
        React.createElement('div', { className: 'daily-question-header' },
            React.createElement('div', { className: 'question-info' },
                React.createElement('h2', null, `Daily Challenge - ${formatDate(selectedDate.date)}`),
                React.createElement('p', { className: 'attempts-info' }, `Attempts: ${attempts}/3`)
            ),
            React.createElement('button', {
                className: 'back-button-small',
                onClick: backToCalendar
            }, '← Back to Calendar')
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
                            onFocus: handleInputFocus,
                            onKeyPress: handleKeyPress,
                            onBlur: () => setTimeout(() => setShowSuggestions(false), 150),
                            placeholder: 'Enter fighter name...',
                            disabled: isCorrect || attempts >= 3,
                            className: 'answer-field'
                        }),
                        showSuggestions && suggestions.length > 0 && React.createElement('div', {
                            className: 'suggestions-dropdown',
                            onScroll: handleSuggestionScroll,
                            style: { maxHeight: '200px', overflowY: 'auto' }
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
                    onClick: backToCalendar
                }, 'BACK TO CALENDAR')
            )
        )
    )
}

export default DailyChallenge