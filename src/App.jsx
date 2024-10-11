import './App.css';
import SignUpForm from './Components/SignupNew/SignupNew';
import LoginForm from './Components/LogIn/LogIn';
import { useState } from 'react';

function App() {
  const [isSignUp, setIsSignUp] = useState(true);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div>
      {isSignUp ? (
        <SignUpForm onToggle={toggleForm} />
      ) : (
        <LoginForm onToggle={toggleForm} />
      )}
    </div>
  );
}

export default App;
