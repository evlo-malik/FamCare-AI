import React, { useState } from 'react';
import { supabase } from '../../client';
import SignUpForm from '../SignupNew/SignupNew';
import email_icon from '../assets/Email.png';
import password_icon from '../assets/Password.png';
import eye_icon from '../assets/Eye.png';
import eye_off_icon from '../assets/Hide.png';
import logoImage from '../assets/logo.png';

function LoginForm({ onToggle }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      if (error) throw error;
      if (data && data.session) {
        setMessage('Login successful!');
        
        // Get the access token (JWT)
        const token = data.session.access_token;
        
        // Redirect to the intermediary page with the token
        window.location.href = `https://yourwebsite.com/auth-bridge?token=${encodeURIComponent(token)}`;
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="conteiner">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-4">
          <img src={logoImage} alt="FamCare AI Logo" className="logo" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>
        {message && (
          <div className={`p-4 mb-4 text-sm rounded-lg ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="inputs">
          <div className="relative">
            <img src={email_icon} alt="Email Icon" className="icon" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email address"
              className="input-with-icon"
            />
          </div>
          <div className="relative">
            <img src={password_icon} alt="Password Icon" className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className="input-with-icon"
            />
            <img
              src={showPassword ? eye_off_icon : eye_icon}
              alt="Toggle Password Visibility"
              onClick={togglePasswordVisibility}
              className="eye-icon"
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          <p className="mt-4 text-center text-sm text-blue-500">
            <a href="#" onClick={onToggle}>Don't have an account? Sign up.</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;

