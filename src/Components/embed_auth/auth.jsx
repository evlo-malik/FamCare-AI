import { useState, useEffect } from 'react';

const AuthStatusPage = () => {
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    userId: null,
    error: null,
    isLoading: true
  });

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Get JWT token from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
          throw new Error('No token provided in URL');
        }

        // Get the domain from the referrer or default to a placeholder
        const domain = document.referrer 
          ? new URL(document.referrer).hostname 
          : 'yourdomain.softr.app';

        // Make the validation request
        const response = await fetch(`https://${domain}/v1/api/users/validate-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jwt: token }),
        });

        if (!response.ok) {
          throw new Error('Token validation failed');
        }

        const data = await response.json();
        setAuthStatus({
          isAuthenticated: true,
          userId: data.user_id || data.userId,
          error: null,
          isLoading: false
        });
      } catch (error) {
        setAuthStatus({
          isAuthenticated: false,
          userId: null,
          error: error.message,
          isLoading: false
        });
      }
    };

    validateToken();
  }, []);

  if (authStatus.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <p className="text-gray-600 text-center">Validating authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="text-center">
          {authStatus.isAuthenticated ? (
            <>
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Authenticated Successfully</h2>
              <p className="text-gray-600">User ID: {authStatus.userId}</p>
            </>
          ) : (
            <>
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
              <p className="text-gray-600">{authStatus.error || 'Unable to authenticate user'}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthStatusPage;