import './App.css';
import SignUpForm from './Components/SignupNew/SignupNew';
import LoginForm from './Components/LogIn/LogIn';
import ResetPassword from './Components/Password change/ResetPassword';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
