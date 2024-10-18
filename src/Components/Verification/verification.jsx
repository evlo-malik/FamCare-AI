import React, { useState, useEffect } from 'react';
import { supabase } from '../../client';
import logoImage from '../assets/logo.png';

function Verification() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setMessage('Email verified successfully. Fetching your account details...');
        await handleVerification(session.user);
      } else if (event === 'SIGNED_OUT') {
        setMessage('Verification failed. Please try again or contact support.');
      }
    });

    // Check if the user is already signed in
    checkUser();

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await handleVerification(user);
    } else {
      setLoading(false);
    }
  };

  const handleVerification = async (user) => {
    try {
      // Fetch the magic link from the auth.users table
      const { data, error } = await supabase
        .from('auth.users')
        .select('magic_link')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data && data.magic_link) {
        setMessage('Verification successful. Redirecting...');
        // Redirect to the magic link
        window.location.href = data.magic_link;
      } else {
        throw new Error('Magic link not found for the user.');
      }
    } catch (error) {
      console.error('Error fetching magic link:', error);
      setMessage('Verification successful, but there was an issue retrieving your account details. Please try logging in or contact support.');
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
        <h2 className="text-2xl font-bold mb-6 text-center">Email Verification</h2>
        <p className="text-center mb-6">{message}</p>
        {loading && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Verification;