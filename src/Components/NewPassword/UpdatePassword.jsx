import React, { useState } from 'react';
import { supabase } from '../../client';
import password_icon from '../assets/Password.png';
import eye_icon from '../assets/Eye.png';
import eye_off_icon from '../assets/Hide.png';
import logoImage from '../assets/logo.png';

function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
  });

  const updatePasswordCriteria = (password) => {
    setPasswordCriteria({
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      hasMinLength: password.length >= 12,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'newPassword') {
      setNewPassword(value);
      updatePasswordCriteria(value);
    } else {
      setConfirmPassword(value);
    }

    if (name === 'confirmPassword' || name === 'newPassword') {
      if (newPassword && value !== newPassword) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (passwordMatchError || newPassword !== confirmPassword) {
      setLoading(false);
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setMessage('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage(error.message || 'Error updating password');
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
        <h2 className="text-2xl font-bold mb-6 text-center">Update Your Password</h2>
        {message && (
          <div className={`p-4 mb-4 text-sm rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="inputs">
          <div className="relative">
            <img src={password_icon} alt="New Password Icon" className="icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={handleChange}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              required
              placeholder="New Password"
              className="input-with-icon"
            />
            <img
              src={showPassword ? eye_off_icon : eye_icon}
              alt="Toggle Password Visibility"
              onClick={togglePasswordVisibility}
              className="eye-icon"
            />
            {passwordFocused && (
              <div className="password-requirements-popup">
                <h4>Password must contain:</h4>
                <ul>
                  <li className={passwordCriteria.hasUpperCase ? 'met' : ''}>
                    At least one uppercase letter
                  </li>
                  <li className={passwordCriteria.hasLowerCase ? 'met' : ''}>
                    At least one lowercase letter
                  </li>
                  <li className={passwordCriteria.hasNumber ? 'met' : ''}>
                    At least one number
                  </li>
                  <li className={passwordCriteria.hasSpecialChar ? 'met' : ''}>
                    At least one special character
                  </li>
                  <li className={passwordCriteria.hasMinLength ? 'met' : ''}>
                    Minimum of 12 characters
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="relative">
            <img src={password_icon} alt="Confirm Password Icon" className="icon" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm New Password"
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
          <div className="mt-4">
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdatePassword;
