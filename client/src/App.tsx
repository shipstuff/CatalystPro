import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

const App: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<string>('Checking...');
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [experiencePoints, setExperiencePoints] = useState(0);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');

  // Test connection to our backend
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setServerStatus(`${data.message}`);
      } catch (error) {
        setServerStatus('Server connection failed');
      }
    };

    const fetchQuizzes = async () => {
      try {
        const response = await fetch('/api/quizzes');
        const data = await response.json();
        if (data.success) {
          setQuizzes(data.data || data.quizzes || []);
        }
      } catch (error) {
        console.log('Failed to fetch quizzes');
      }
    };

    checkServer();
    fetchQuizzes();
  }, []);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserProfile();
      console.log('Found existing token, user is logged in');
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        console.log('User profile fetched:', data.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleQuizClick = async (quiz: any) => {
    setSelectedQuiz(quiz);
    try {
      const response = await fetch(`/api/quizzes/${quiz.id}/questions`);
      const data = await response.json();
      if (data.success) {
        setQuestions(data.data || []);
      }
    } catch (error) {
      console.log('Failed to fetch questions');
    }
  };

  const handleNextQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    
    console.log(`Answer: ${selectedAnswer}, Correct: ${currentQuestion.correct_answer}, Result: ${isCorrect ? 'RIGHT' : 'WRONG'}`);
    
    if (isCorrect) {
      console.log('Awarding experience points...');
      try {
        const response = await fetch('/api/experience/award', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            amount: 1
          })
        });
        const data = await response.json();
        if (data.success) {
          setCurrentUser(data.user);
          console.log('Experience points awarded:', data.user.experience);
        }
      } catch (error) {
        console.error('Error awarding experience points:', error);
      }
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowingFeedback(false);
      setAiExplanation('');
    } else {
      console.log('Quiz completed');
      setIsQuizActive(false);
    }
  };

  const handleAIButtonClick = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    const questionText = currentQuestion.question_text;
    const correctAnswer = currentQuestion[`option_${currentQuestion.correct_answer.toLowerCase()}`];
    const userAnswer = currentQuestion[`option_${selectedAnswer.toLowerCase()}`];
   
    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          questionText,
          correctAnswer,
          userAnswer,
          isCorrect
        })
      });
      const data = await response.json();
      if (data.success) {
        // console.log('AI explanation received:', data.explanation);
        setAiExplanation(data.explanation);
      }
    } catch (error) {
      // console.error('Error fetching AI explanation:', error);
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Catalyst Pro</h1>
      <p>Educational Quiz Platform For Dummies like you!</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => {
            setShowLogin(!showLogin);
            setShowSignup(false);
          }}
          style={{ padding: '10px 20px', marginRight: '10px' }}
        >
          {showLogin ? 'Hide Login' : 'Show Login'}
        </button>
        
        <button 
          onClick={() => {
            setShowSignup(!showSignup);
            setShowLogin(false);
          }}
          style={{ padding: '10px 20px' }}
        >
          {showSignup ? 'Hide Signup' : 'Show Signup'}
        </button>
      </div>
      
      {showLogin && (
        <LoginForm 
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            fetchUserProfile();
            console.log('Login status updated in App');
          }} 
        />
      )}
      
      {showSignup && (
        <SignupForm 
          onSignupSuccess={() => {
            console.log('Signup successful - user can now login');
          }} 
        />
      )}
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <strong>Server Status:</strong> {serverStatus}
      </div>

      <div style={{ marginTop: '10px', padding: '10px', backgroundColor: isLoggedIn ? '#d4edda' : '#f8d7da' }}>
        <strong>Login Status:</strong> {isLoggedIn ? 'Logged In' : 'Not Logged In'}
        
        {isLoggedIn && (
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              setIsLoggedIn(false);
              console.log('User logged out');
            }}
            style={{ 
              marginLeft: '15px', 
              padding: '5px 10px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              cursor: 'pointer' 
            }}
          >
            Logout
          </button>
        )}

        <div style={{ marginTop: '10px', textAlign: 'right' }}>
          <strong>Experience Points:</strong> {currentUser?.experience || experiencePoints}
        </div>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Available Quizzes:</h2>
        {quizzes.length > 0 ? (
          <ul>
            {quizzes.map(quiz => (
              <li key={quiz.id} style={{ marginBottom: '10px' }}>
                <button 
                  onClick={() => handleQuizClick(quiz)}
                  style={{ padding: '5px 10px', cursor: 'pointer' }}
                >
                  <strong>{quiz.title}</strong> ({quiz.subject}) - {quiz.difficulty_level}
                </button>

                {isLoggedIn && (
                  <button
                    onClick={() => {
                      setIsQuizActive(true);
                      setActiveQuiz(quiz);
                      setCurrentQuestionIndex(0);
                      setSelectedAnswer('');
                      handleQuizClick(quiz);
                    }}
                    style={{
                      padding: '5px 10px', 
                      backgroundColor: '#28a745', 
                      color: 'white', 
                      border: 'none', 
                      cursor: 'pointer' 
                    }}
                    >
                    Take Quiz
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading quizzes...</p>
        )}
      </div>

      {isQuizActive && questions.length > 0 && (
        <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #007bff', backgroundColor: '#f8f9fa' }}>
          <h2>Taking Quiz: {activeQuiz?.title}</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <strong>Question {currentQuestionIndex + 1} of {questions.length}</strong>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h3>{questions[currentQuestionIndex]?.question_text}</h3>
          </div>
          
          <div>
          <div style={{ marginBottom: '30px' }}>
              {['A', 'B', 'C', 'D'].map(option => (
                <div key={option} style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="quiz-answer"
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      style={{ marginRight: '10px' }}
                    />
                    {option}) {questions[currentQuestionIndex]?.[`option_${option.toLowerCase()}`]}
                  </label>
                </div>
              ))}
            </div>
            <p>Current selection: {selectedAnswer || 'None selected'}</p>

            {showingFeedback && (
              <div style={{ 
                marginTop: '20px', 
                marginBottom: '20px', 
                padding: '15px', 
                borderRadius: '5px',
                backgroundColor: selectedAnswer === questions[currentQuestionIndex]?.correct_answer ? '#d4edda' : '#f8d7da',
                border: selectedAnswer === questions[currentQuestionIndex]?.correct_answer ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
              }}>
                <h3 style={{ 
                  margin: '0 0 10px 0',
                  color: selectedAnswer === questions[currentQuestionIndex]?.correct_answer ? '#155724' : '#721c24'
                }}>
                  {selectedAnswer === questions[currentQuestionIndex]?.correct_answer ? 'Correct' : 'Incorrect'}
                </h3>
                <p style={{ margin: '0' }}>
                  The correct answer is: {questions[currentQuestionIndex]?.[`option_${questions[currentQuestionIndex]?.correct_answer.toLowerCase()}`]}
                </p>

                <button
                  onClick={handleAIButtonClick}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#4285f4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {selectedAnswer === questions[currentQuestionIndex]?.correct_answer 
                  ? 'Ask AI for More Information' 
                  : 'Ask AI to Explain the Correct Answer'}
                </button>

                {aiExplanation && (
                  <div style={{
                    marginTop: '15px',
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    borderLeft: '4px solid #4285f4'
                  }}>
                    <h4 style={{ 
                      margin: '0 0 8px 0', 
                      color: '#4285f4',
                      fontSize: '14px'
                    }}>
                      Gemini Explanation:
                    </h4>
                    <p style={{ 
                      margin: '0', 
                      lineHeight: '1.5',
                      fontSize: '14px'
                    }}>
                      {aiExplanation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {!showingFeedback ? (
              <button 
                onClick={() => setShowingFeedback(true)}
                disabled={!selectedAnswer}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: selectedAnswer ? '#28a745' : '#6c757d', 
                  color: 'white', 
                  border: 'none', 
                  cursor: selectedAnswer ? 'pointer' : 'not-allowed' 
                }}
              >
                Submit Answer
              </button>
            ) : (
              <button 
                onClick={handleNextQuestion}
                style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App; 