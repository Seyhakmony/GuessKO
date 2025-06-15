import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import fighters from './MMAFighters.js';
import '../styles/game.css';
import '../styles/daily.css';

const gameData = [
    {
        videoPath: '/clips/BucklyW.mp4',
        correctAnswer: 'Joaquin Buckley',
        correctVideo: '/correct/Buckly_vs.mp4',
        hint1: 'Explosive fighter',
        hint2: 'Known for viral knockout highlight',
        releaseDate: '2025-06-10'
    },
    {
        videoPath: '/clips/ConorW.mp4',
        correctAnswer: 'Conor Mcgregor',
        correctVideo: '/correct/Conor_vs_Aldo.mp4',
        hint1: 'Southpaw striker',
        hint2: 'Made boxing debut in 2017',
        releaseDate: '2025-06-09'
    },
    {
        videoPath: '/clips/IliaW.mp4',
        correctAnswer: 'Ilia Topuria',
        correctVideo: '/correct/Ilia_vs_Alex.mp4',
        hint1: 'European fighter',
        hint2: 'Undefeated record holder',
        releaseDate: '2025-06-08'
    },
    {
        videoPath: '/clips/Izzy_AlexW.mp4',
        correctAnswer: 'Israel Adesanya',
        correctVideo: '/correct/Alex_vs_Izzy2.mp4',
        hint1: 'Tall striker',
        hint2: 'Has kickboxing background',
        releaseDate: '2025-06-07'
    },
    {
        videoPath: '/clips/IzzyW.mp4',
        correctAnswer: 'Israel Adesanya',
        correctVideo: '/correct/Izzy_vs_Rob.mp4',
        hint1: 'Creative fighter',
        hint2: 'Trained in New Zealand',
        releaseDate: '2025-06-06'
    },
    {
        videoPath: '/clips/KaiFranceW.mp4',
        correctAnswer: 'Kai Kara-france',
        correctVideo: '/correct/France_vs_Cody.mp4',
        hint1: 'Smaller weight class',
        hint2: 'Pacific region fighter',
        releaseDate: '2025-06-05'
    },
    {
        videoPath: '/clips/LeonW.mp4',
        correctAnswer: 'Leon Edwards',
        correctVideo: '/correct/Leon_vs_Usman.mp4',
        hint1: 'British fighter',
        hint2: 'Late-round finisher',
        releaseDate: '2025-06-04'
    },
    {
        videoPath: '/clips/MasvidalW.mp4',
        correctAnswer: 'Jorge Masvidal',
        correctVideo: '/correct/Masvidal_vs_Askren.mp4',
        hint1: 'Veteran fighter',
        hint2: 'Set speed record',
        releaseDate: '2025-06-03'
    },
    {
        videoPath: '/clips/MaxHollowayW.mp4',
        correctAnswer: 'Max Holloway',
        correctVideo: '/correct/Max_vs_Justin.mp4',
        hint1: 'High-volume striker',
        hint2: 'Island-born fighter',
        releaseDate: '2025-06-02'
    },
    {
        videoPath: '/clips/OmalleyW.mp4',
        correctAnswer: "Sean O'malley",
        correctVideo: '/correct/Omalley_vs_White.mp4',
        hint1: 'Colorful personality',
        hint2: 'Western US fighter',
        releaseDate: '2025-06-01'
    },
    {
        videoPath: '/clips/SilvaW.mp4',
        correctAnswer: 'Anderson Silva',
        correctVideo: '/correct/Silva_vs_Griffin.mp4',
        hint1: 'Brazilian legend',
        hint2: 'Long title reign',
        releaseDate: '2025-05-31'
    },
    {
        videoPath: '/clips/VolkanW.mp4',
        correctAnswer: 'Volkan Oezdemir',
        correctVideo: '/correct/Oezdemir_vs_Walker.mp4',
        hint1: 'European striker',
        hint2: 'Light heavyweight division',
        releaseDate: '2025-05-30'
    }
]

const KnockoutArchive = ({ onBackToWelcome }) => {
    const { archiveId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    
    const [selectedLevel, setSelectedLevel] = useState(null)
    const [showArchive, setShowArchive] = useState(true)
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
    const [archiveProgress, setArchiveProgress] = useState({})
    const [hintsUsed, setHintsUsed] = useState(0)
    const [showHint, setShowHint] = useState(false)

   
    const sortedArchiveData = gameData
        .map((data, index) => ({
            ...data,
            archiveNumber: gameData.length - index,
            originalIndex: index
        }))
        .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))

 
   useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem('knockoutArchiveProgress') || '{}')
    setArchiveProgress(savedProgress)
}, [])


useEffect(() => {
    if (archiveId) {
        const archiveNumber = parseInt(archiveId)
        const archiveItem = sortedArchiveData.find(item => item.archiveNumber === archiveNumber)
        
        if (archiveItem) {
            setSelectedLevel(archiveNumber)
            setCurrentData(gameData[archiveItem.originalIndex])
            setShowArchive(false)
            resetQuestion()
        } else {
            navigate('/archive', { replace: true })
        }
    } else {
        setShowArchive(true)
        setSelectedLevel(null)
        setCurrentData(null)
    }
}, [archiveId, navigate])

const saveProgress = (archiveNumber, correct, attempts) => {
    const completionData = {
        correct,
        attempts,
        completed: true,
        completedAt: new Date().toISOString(),
        hintsUsed: hintsUsed
    }
    
    const newProgress = {
        ...archiveProgress,
        [archiveNumber]: completionData
    }
    
    setArchiveProgress(newProgress)
    localStorage.setItem('knockoutArchiveProgress', JSON.stringify(newProgress))
}

   const formatDate = (dateString) => {
    
    const [year, month, day] = dateString.split('-');
    return `${parseInt(month)}/${parseInt(day)}/${year}`;
}

    const handleArchiveSelect = (archiveItem) => {
    navigate(`/archive/${archiveItem.archiveNumber}`)
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
        setHintsUsed(0)
        setShowHint(false)
    }

    const normalizeAnswer = (answer) => {
        return answer.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '')
    }

    const handleInputChange = (value) => {
        setUserAnswer(value)

        if (value.length > 0 && !isCorrect) {
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
        if (userAnswer.length > 0 && !isCorrect) {
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

    const handleHint = () => {
        if (hintsUsed < 2) {
            setHintsUsed(hintsUsed + 1)
            setShowHint(true)
        }
    }


const handleRandomFight = () => {
    const randomIndex = Math.floor(Math.random() * sortedArchiveData.length)
    const randomArchiveItem = sortedArchiveData[randomIndex]
    navigate(`/archive/${randomArchiveItem.archiveNumber}`)
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
            setFeedback('🎉 Correct! Archive entry completed!')
            saveProgress(selectedLevel, true, attempts + 1)
        } else {
            setUsedAnswers([...usedAnswers, userAnswer])
            const newAttempts = attempts + 1
            setAttempts(newAttempts)
            setUserAnswer('')
            setFeedback('❌ Incorrect! Try again.')
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isCorrect) {
            checkAnswer()
        }
    }

    const backToArchive = () => {
        navigate('/archive')
    }

    const backToMenu = () => {
        navigate('/')
    }

if (showArchive) {
    return React.createElement('div', { className: 'levels-challenge' },
        React.createElement('div', { className: 'levels-header' },
            React.createElement('h1', { className: 'levels-title' }, '📚 Daily Knockout Archive'),
            React.createElement('p', { className: 'levels-subtitle' },
                'Browse through our collection of legendary knockouts. Each entry features a classic finish for you to identify!'
            ),
            React.createElement('button', {
                className: 'back-button-small',
                onClick: backToMenu
            }, '← Back to Menu')
        ),

        React.createElement('div', { className: 'random-fight-container' },
            React.createElement('button', {
                className: 'random-fight-button',
                onClick: handleRandomFight
            }, '🎲 Random Fight')
        ),
        React.createElement('div', { className: 'levels-container' },
            React.createElement('div', { className: 'levels-grid' },
                sortedArchiveData.map((archiveItem) => {
                    const progress = archiveProgress[archiveItem.archiveNumber]
                    const isCompleted = progress && progress.completed
                    const isCorrect = progress && progress.correct

                    return React.createElement('div', {
                        key: archiveItem.archiveNumber,
                        className: `level-card archive-card ${isCompleted ? (isCorrect ? 'completed-correct' : 'completed-incorrect') : ''}`,
                        onClick: () => handleArchiveSelect(archiveItem),
                        style: {
                            cursor: 'pointer'
                        }
                    },
                        React.createElement('div', { className: 'archive-header' },
                            React.createElement('div', { className: 'archive-number' }, `#${archiveItem.archiveNumber}`),
                            React.createElement('div', { className: 'archive-date' },
                                formatDate(archiveItem.releaseDate)
                            ),
                            React.createElement('div', { className: 'archive-status' },
                                isCompleted ? (isCorrect ? '✅' : '❌') : '▶'
                            )
                        ),
                        isCompleted && React.createElement('div', { className: 'archive-info' },
                            React.createElement('p', { className: 'archive-completion' },
                                `✓ Solved in ${progress.attempts} attempt${progress.attempts !== 1 ? 's' : ''}`
                            ),
                            progress.hintsUsed > 0 && React.createElement('p', { className: 'hints-used-info' },
                                `💡 ${progress.hintsUsed} hint${progress.hintsUsed !== 1 ? 's' : ''} used`
                            ),
                            React.createElement('p', { className: 'completion-date' },
                                `Completed: ${new Date(progress.completedAt).toLocaleDateString()}`
                            )
                        )
                    )
                })
            )
        )
    )
}


    return React.createElement('div', { className: 'level-question' },
        React.createElement('div', { className: 'level-question-header' },
            React.createElement('div', { className: 'question-info' },
                React.createElement('h2', null, `Archive Entry #${selectedLevel}`),
                React.createElement('div', { className: 'level-meta' },
                    React.createElement('span', { className: 'attempts-info' }, `Attempts: ${attempts}`)
                )
            ),
            React.createElement('button', {
                className: 'back-button-small',
                onClick: backToArchive
            }, '← Back to Archive')
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
            React.createElement('div', { className: 'hint-section' },
                React.createElement('button', {
                    onClick: handleHint,
                    disabled: hintsUsed >= 2 || isCorrect,
                    className: 'hint-button'
                }, `💡 Hint (${hintsUsed}/2)`),

               
                hintsUsed > 0 && React.createElement('div', { className: 'hints-container' },
              
                    React.createElement('div', { className: 'hint-display hint-1' },
                        React.createElement('p', null, `${currentData.hint1}`)
                    ),
                  
                    hintsUsed > 1 && React.createElement('div', { className: 'hint-display hint-2' },
                        React.createElement('p', null, `${currentData.hint2}`)
                    )
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
                            disabled: isCorrect,
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
                        disabled: isCorrect,
                        className: 'submit-button'
                    }, 'SUBMIT')
                ),
                feedback && React.createElement('div', {
                    className: `feedback ${isCorrect ? 'correct' : 'incorrect'}`
                }, feedback),
                isCorrect && React.createElement('div', { className: 'level-complete-buttons' },
                    React.createElement('button', {
                        className: 'next-button',
                        onClick: backToArchive
                    }, 'BACK TO ARCHIVE')
                )
            )
        )
    )
}

export default KnockoutArchive