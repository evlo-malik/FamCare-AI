import './App.css';
import SignUpForm from './Components/SignupNew/SignupNew';
import LoginForm from './Components/LogIn/LogIn';
import EmbedAuth from './Components/embed_auth/auth';
import ResetPassword from './Components/Password change/ResetPassword';
import UpdatePassword from './Components/NewPassword/UpdatePassword';
import CalendarApp from './Components/calendar/calendar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password" element={<UpdatePassword />} />
        <Route path="/calendar" element={<CalendarApp />} />
        <Route path="/embed-auth" element={<EmbedAuth />} />
      </Routes>
    </Router>
  );
}

export default App;

