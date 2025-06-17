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
      console.log('Found existing token, user is logged in');
    }
  }, []);

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

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Catalyst Pro</h1>
      <p>Educational Quiz Platform</p>
      
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
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading quizzes...</p>
        )}
      </div>

      {selectedQuiz && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc' }}>
          <h3>Questions for: {selectedQuiz.title}</h3>
          {questions.length > 0 ? (
            <ol>
              {questions.map(question => (
                <li key={question.id} style={{ marginBottom: '15px' }}>
                  <strong>{question.question_text}</strong>
                  <ul style={{ marginTop: '5px' }}>
                    <li>A) {question.option_a}</li>
                    <li>B) {question.option_b}</li>
                    <li>C) {question.option_c}</li>
                    <li>D) {question.option_d}</li>
                  </ul>
                </li>
              ))}
            </ol>
          ) : (
            <p>Loading questions...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default App; 