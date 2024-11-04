import React, { useState } from 'react';
import { supabase } from '../../client';
import email_icon from '../assets/Email.png';
import logoImage from '../assets/logo.png';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const generateToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // First, check if the email exists in users2 table
      const { data: existingUser, error: checkError } = await supabase
        .from('users2')
        .select('email')
        .eq('email', email)
        .single();

      if (checkError || !existingUser) {
        console.log('User check error:', checkError);
        throw new Error('Email not found in our records');
      }

      // Generate a unique token
      const resetToken = generateToken();
      
      // Update the token in the database
      const { data, error: updateError } = await supabase
        .from('users2')
        .update({ password_reset_token: resetToken })
        .eq('email', email)
        .select();

      console.log('Update response:', { data, updateError }); // For debugging

      if (updateError) {
        console.error('Update error:', updateError);
        throw new Error('Failed to process reset request');
      }

      if (!data || data.length === 0) {
        throw new Error('Failed to update record');
      }

      // Send password reset email only if database update was successful
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `https://auth.famcareai.com/new-password?token=${resetToken}`,
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      setMessage('Password reset email sent! Please check your email.');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setMessage(error.message || 'Error requesting password reset.');
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
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Your Password</h2>
        {message && (
          <div className={`p-4 mb-4 text-sm rounded-lg ${message.includes('sent') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email address"
              className="input-with-icon"
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? 'Sending Email...' : 'Send Reset Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;