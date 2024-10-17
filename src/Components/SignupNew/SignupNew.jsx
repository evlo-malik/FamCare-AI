import React, { useState } from 'react';
import { supabase } from '../../client';
import './SignupNew.css';
import { Link } from 'react-router-dom';
import email_icon from '../assets/Email.png';
import password_icon from '../assets/Password.png';
import eye_icon from '../assets/Eye.png';
import eye_off_icon from '../assets/Hide.png';
import logoImage from '../assets/logo.png';

function SignUpForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    if (name === 'confirmPassword' || name === 'password') {
      const { password, confirmPassword } = {
        ...formData,
        [name]: value,
      };
      if (password && confirmPassword && password !== confirmPassword) {
        setPasswordMatchError('Passwords do not match. Please try again.');
      } else {
        setPasswordMatchError('');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const createSoftrUser = async (email, password) => {
    const response = await fetch('https://studio-api.softr.io/v1/api/users', {
      method: 'POST',
      headers: {
        'Softr-Api-Key': 'qHww9RAOrTtfnRRpTa2Jcxk9M', // Replace with your actual Softr API key
        'Softr-Domain': 'famcareai.com', // Replace with your actual domain
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        full_name: '-',
        email: email,
        password: password,
        generate_magic_link: false // We will generate the magic link manually
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create user in Softr');
    }

    return await response.json();
  };

  const generateMagicLink = async (email) => {
    const response = await fetch(`https://studio-api.softr.io/v1/api/users/magic-link/generate/${email}`, {
      method: 'POST',
      headers: {
        'Softr-Api-Key': 'qHww9RAOrTtfnRRpTa2Jcxk9M', // Replace with your actual Softr API key
        'Softr-Domain': 'famcareai.com', // Replace with your actual domain
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to generate magic link in Softr');
    }

    const magicLinkResponse = await response.json();
    return magicLinkResponse.magic_link_url; // Assume magic_link_url is part of the response
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!agreedToTerms) {
      setMessage('Please agree to the Privacy Policy and Terms of Service.');
      setLoading(false);
      return;
    }

    if (passwordMatchError) {
      setLoading(false);
      return;
    }

    try {
      // Softr sign-up and magic link generation
      const softrResponse = await createSoftrUser(formData.email, formData.password);
      const magicLink = await generateMagicLink(formData.email);

      // Supabase sign-up with the Softr magic link as emailRedirectTo
      const supabaseResponse = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: magicLink // Redirect to Softr magic link
        }
      });

      if (supabaseResponse.data && supabaseResponse.data.user) {
        setMessage('Sign up successful! Please check your email for verification.');
        setFormData({ email: '', password: '', confirmPassword: '' });

        window.location.href = 'https://famcareai.com/verification';
      } else {
        setMessage('This email is already registered. Please try signing in.');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      setMessage(error.message || 'An unexpected error occurred');
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
        <h2 className="text-2xl font-bold mb-6 text-center">Create Your Account</h2>
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
              type={showPassword ? 'text' : 'password'}
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
          <div className="relative">
            <img src={password_icon} alt="Confirm Password Icon" className="icon" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm Password"
              className="input-with-icon"
            />
            <img
              src={showConfirmPassword ? eye_off_icon : eye_icon}
              alt="Toggle Confirm Password Visibility"
              onClick={toggleConfirmPasswordVisibility}
              className="eye-icon"
            />
          </div>
          {passwordMatchError && (
            <div className="error-message">
              {passwordMatchError}
            </div>
          )}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreedToTerms}
              onChange={() => setAgreedToTerms(!agreedToTerms)}
              className="mr-2"
            />
            <label htmlFor="agreeTerms" className="text-sm text-gray-600">
              I agree to the 
              <a href="https://www.famcareai.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">
                Privacy Policy
              </a>
              and
              <a href="https://www.famcareai.com/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">
                Terms of Service
              </a>.
            </label>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading || !agreedToTerms}
            >
              {loading ? 'Signing Up...' : 'Continue'}
            </button>
          </div>
          <p className="mt-4 text-center text-sm text-blue-500">
            {/* Link to the login page */}
            <Link to="/login">Already have an account? Sign in.</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
