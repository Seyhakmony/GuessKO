import React, { useState } from 'react'
import fighters from './MMAFighters.js';
import '../styles/game.css';
import { useNavigate } from 'react-router-dom';
import { addPointsToUser } from './FirebaseS/data.js'


const gameData = [
    {
        videoPath: './clips/LyotoW_vs_Couture.mp4',
        correctAnswer: 'Lyoto Machida',
        correctVideo: './correct/Lyoto_vs_Couture.mp4',
        hint1: 'Karate-based fighter',
        hint2: 'Known as "The Dragon"'
    },
    {
        videoPath: './clips/VeraW_vs_Cruz.mp4',
        correctAnswer: 'Marlon Vera',
        correctVideo: './correct/Vera_vs_Cruz.mp4',
        hint1: 'Ecuadorian striker',
        hint2: 'Leg kick specialist'
    },
    {
        videoPath: './clips/ProchazkaW_vs_Oezdemir.mp4',
        correctAnswer: 'Jiri Prochazka',
        correctVideo: './correct/Prochazka_vs_Oezdemir.mp4',
        hint1: 'Czech samurai',
        hint2: 'Unpredictable fighting style'
    },
    {
        videoPath: './clips/WeiliW_vs_Joanna.mp4',
        correctAnswer: 'Zhang Weili',
        correctVideo: './correct/Weili_vs_Joanna.mp4',
        hint1: 'Chinese powerhouse',
        hint2: 'First from her country to win title'
    },
    {
        videoPath: './clips/ErcegW_vs_Schnell.mp4',
        correctAnswer: 'Steve Erceg',
        correctVideo: './correct/Erceg_vs_Schnell.mp4',
        hint1: 'Australian prospect',
        hint2: 'Flyweight contender'
    },
    {
        videoPath: './clips/EmmetW_vs_Mitchell.mp4',
        correctAnswer: 'Josh Emmett',
        correctVideo: './correct/Emmet_vs_Mitchell.mp4',
        hint1: 'Power puncher',
        hint2: 'Team Alpha Male veteran'
    },
    {
        videoPath: './clips/yadongW_vs_perez.mp4',
        correctAnswer: 'Song Yadong',
        correctVideo: './correct/yadong_vs_perez.mp4',
        hint1: 'Chinese bantamweight',
        hint2: 'Precise striker'
    },
    {
        videoPath: './clips/WoodlyW_vs_joshC.mp4',
        correctAnswer: 'Tyron Woodley',
        correctVideo: './correct/Woodly_vs_joshC.mp4',
        hint1: 'Wrestling background',
        hint2: 'Former welterweight champion'
    },
    {
        videoPath: './clips/ChandlerW_vs_Ferguson.mp4',
        correctAnswer: 'Michael Chandler',
        correctVideo: './correct/Chandler_vs_Ferguson.mp4',
        hint1: 'Former Bellator champion',
        hint2: 'Explosive lightweight'
    },
    {
        videoPath: './clips/Shi_MingW_vs_FengXiaocan.mp4',
        correctAnswer: 'Ming Shi',
        correctVideo: './correct/Shi_Ming_vs_FengXiaocan.mp4',
        hint1: 'Chinese flyweight',
        hint2: 'She is also a doctor in China'
    },
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

const getQs = (questions, count) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questions.length));
};


const GameScreen = ({ onBackToWelcome, difficulty = 'medium', currentUser, userProfile }) => {
    const navigate = useNavigate();
    const [selectedQuestions] = useState(() => getQs(gameData, 10));
    const [currentQuestion, setCurrentQuestion] = useState(0);
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
    const currentData = selectedQuestions[currentQuestion];

    const [gaveUp, setGaveUp] = useState(false)
    const [vissbleS, setVissbleS] = useState(15)
    const [totalPointsAfterGame, setTotalPointsAfterGame] = useState(null)

    const handleGameEnd = async (finalScore) => {
        if (!currentUser || !userProfile) {
            return
        }

        if (finalScore > 0) {
            try {
                await addPointsToUser(currentUser.uid, finalScore)
                const newTotal = (userProfile.points || 0) + finalScore
                setTotalPointsAfterGame(newTotal)
            } catch (error) {
                console.error('Error adding points:', error)
            }
        } else {
            console.log('Score is 0 or negative, not adding points')
            setTotalPointsAfterGame(userProfile.points || 0)
        }
    }


    const getDifficultyConfig = () => {
        switch (difficulty) {
            case 'easy':
                return { maxAttempts: Infinity, hintsAvailable: 2 }
            case 'medium':
                return { maxAttempts: 3, hintsAvailable: 2 }
            case 'hard':
                return { maxAttempts: 1, hintsAvailable: 0 }
            default:
                return { maxAttempts: 3, hintsAvailable: 2 }
        }
    }


    const config = getDifficultyConfig()


    const normalizeAnswer = (answer) => {
        return answer.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '')
    }

    const handleGiveUp = () => {
        setGaveUp(true)
        setShowCorrectVideo(true)
        setFeedback(`You gave up! The answer was: ${currentData.correctAnswer}`)
        setIsCorrect(false)

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
            }).slice(0, vissbleS)   //drop down amount
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

    const getMaxPossiblePoints = () => {
        let maxPointsPerQuestion = 0

        if (difficulty === 'easy') {
            maxPointsPerQuestion = 4
        } else if (difficulty === 'medium') {
            maxPointsPerQuestion = 3
        } else {
            maxPointsPerQuestion = 5
        }

        return selectedQuestions.length * maxPointsPerQuestion;
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
        const normalizedAltAnswer = currentData.correctAnswerAlt ?
            normalizeAnswer(currentData.correctAnswerAlt) : null

        const isAnswerCorrect = normalizedUserAnswer === normalizedCorrectAnswer ||
            (normalizedAltAnswer && normalizedUserAnswer === normalizedAltAnswer)

        if (isAnswerCorrect) {
            setIsCorrect(true)
            setShowCorrectVideo(true)
            setFeedback('🎉 Correct! Great job!')

            let points = 0
            if (difficulty === 'easy') {
                points = Math.max(1, 4 - attempts)
            } else if (difficulty === 'medium') {
                points = 3 - attempts
            } else {
                points = 5
            }
            setScore(score + points)
        } else {
            setUsedAnswers([...usedAnswers, userAnswer])
            const newAttempts = attempts + 1
            setAttempts(newAttempts)
            setUserAnswer('')

            if (newAttempts >= config.maxAttempts) {
                setFeedback(`❌ Sorry, that's incorrect. The answer was: ${currentData.correctAnswer}`)
                setShowCorrectVideo(true)
                setIsCorrect(false)
            } else {
                if (config.hintsAvailable > 0 && newAttempts <= config.hintsAvailable) {
                    let hintText = '❌ Incorrect! '

                    if (newAttempts >= 1) {
                        hintText += `Hint 1: ${currentData.hint1}`
                    }
                    if (newAttempts >= 2) {
                        hintText += `\nHint 2: ${currentData.hint2}`
                    }

                    setFeedback(hintText)
                    setShowHint(true)
                } else {
                    setFeedback(`❌ Incorrect! Keep trying!`)
                }
            }
        }
    }


    const nextQuestion = async () => {
        if (currentQuestion < selectedQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            resetQuestion()
        } else {
            await handleGameEnd(score)
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
        setVissbleS(15)
        setGaveUp(false)
    }

    const restartGame = () => {
        setCurrentQuestion(0)
        setScore(0)
        setGameComplete(false)
        setTotalPointsAfterGame(null)
        resetQuestion()
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isCorrect && !gaveUp && attempts < config.maxAttempts) {
            checkAnswer()
        }
    }

    if (gameComplete) {
        return React.createElement('div', { className: 'game-complete' },
            React.createElement('div', { className: 'complete-content' },
                React.createElement('h2', null, '🏆 Game Complete! 🏆'),
                React.createElement('p', { className: 'final-score' }, `Final Score: ${score} points`),
                currentUser && userProfile && totalPointsAfterGame !== null &&
                React.createElement('p', { className: 'total-points' }, `Total Points: ${totalPointsAfterGame}`),
                React.createElement('p', { className: 'score-breakdown' },
                    `Out of ${selectedQuestions.length} questions with a maximum of ${getMaxPossiblePoints()} points`,
                ),
                React.createElement('div', { className: 'complete-buttons' },
                    React.createElement('button', {
                        className: 'restart-button',
                        onClick: restartGame
                    }, 'PLAY AGAIN'),
                    React.createElement('button', {
                        className: 'back-button',
                        onClick: () => navigate('/')
                    }, 'BACK TO MENU')
                )
            )
        )
    }

    return React.createElement('div', { className: 'game-screen' },
        React.createElement('div', { className: 'game-header' },
            React.createElement('div', { className: 'question-info' },
                React.createElement('h2', null, `Question ${currentQuestion + 1} of ${selectedQuestions.length}`),
                React.createElement('p', { className: 'score' }, `Score: ${score} points`)
            ),
            React.createElement('button', {
                className: 'back-button-small',
                onClick: () => navigate('/')
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
                    difficulty === 'easy'
                        ? React.createElement('span', null, `Attempts: Unlimited`)
                        : React.createElement('span', null, `Attempts: ${attempts}/${config.maxAttempts}`),
                    React.createElement('span', { className: 'difficulty-badge' }, difficulty.toUpperCase()),
                    // showHint && React.createElement('span', { className: 'hint-indicator' }, '💡 Hint provided')
                    showHint && React.createElement('span', { className: 'hint-indicator' })
                )
                ,
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
                            disabled: isCorrect || gaveUp || attempts >= config.maxAttempts,
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
                    React.createElement('div', { className: 'button-group' },
                        React.createElement('button', {
                            onClick: checkAnswer,
                            disabled: isCorrect || gaveUp || attempts >= config.maxAttempts,
                            className: 'submit-button'
                        }, 'SUBMIT'),
                        difficulty === 'easy' && !isCorrect && !gaveUp && React.createElement('button', {
                            onClick: handleGiveUp,
                            className: 'give-up-button'
                        }, 'GIVE UP')
                    )
                ),
                feedback && React.createElement('div', {
                    className: `feedback ${isCorrect ? 'correct' : 'incorrect'}`
                }, feedback),
                (isCorrect || gaveUp || attempts >= config.maxAttempts) && React.createElement('button', {
                    className: 'next-button',
                    onClick: nextQuestion
                }, currentQuestion < selectedQuestions.length - 1 ? 'NEXT QUESTION' : 'FINISH GAME')
            )
        )
    )
}

export default GameScreen