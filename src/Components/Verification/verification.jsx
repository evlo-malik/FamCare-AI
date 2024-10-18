import React, { useState, useEffect } from 'react';
import { supabase } from '../../client';
import { useSearchParams } from 'react-router-dom';
import logoImage from '../assets/logo.png';

function Verification() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Verifying your email...');
  const [magicLink, setMagicLink] = useState(null);
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const verifyUser = async () => {
      const userId = searchParams.get('userId');
      if (!userId) {
        setMessage('Invalid verification link.');
        setLoading(false);
        return;
      }

      try {
        // Fetch user from Supabase
        const { data, error } = await supabase
          .from('users') // Replace with your actual table name
          .select('magic_link')
          .eq('id', userId)
          .single();
        
        if (error || !data) {
          throw new Error('User not found or verification failed.');
        }

        setMagicLink(data.magic_link);
        setMessage('Thank you for verifying your email!');
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [searchParams]);

  const handleContinue = () => {
    if (magicLink) {
      window.location.href = magicLink;
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
        {!loading && magicLink && (
          <div className="mt-4 text-center">
            <button
              onClick={handleContinue}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Verification;
