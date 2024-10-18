import './App.css';
import SignUpForm from './Components/SignupNew/SignupNew';
import LoginForm from './Components/LogIn/LogIn';
import ResetPassword from './Components/Password change/ResetPassword';
import UpdatePassword from './Components/NewPassword/UpdatePassword';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Verification from './Components/Verification/verification';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password" element={<UpdatePassword />} />
        <Route path="/verification" element={<Verification />} />

        
      </Routes>
    </Router>
  );
}

export default App;

