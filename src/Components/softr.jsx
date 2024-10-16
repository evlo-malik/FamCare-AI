import React from 'react';

function PasswordReset() {
  return (
    <div className="password-reset-container">
      <h1 className="text-2xl font-bold mb-4 text-center">Reset Your Password</h1>
      <div className="softr-embed-container">
        <iframe
          id="softr-password-reset"
          src="https://www.famcareai.com/embed/pages/07017024-71cc-4874-91af-478bd32f6212/blocks/user-accounts3"
          width="100%"
          height="600"
          scrolling="yes"
          frameBorder="0"
          style={{ border: 'none' }}
        ></iframe>
      </div>
      <div className="mt-4 text-center">
        <a href="/" className="text-sm text-blue-500 hover:underline">Back to Login</a>
      </div>
    </div>
  );
}

export default PasswordReset;