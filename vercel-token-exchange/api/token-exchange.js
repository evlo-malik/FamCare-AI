const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { supabaseToken, userEmail } = req.body;

  if (!supabaseToken || !userEmail) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // TODO: Implement Supabase token verification
  // For now, we'll assume the token is valid
  const isValidToken = true;

  if (isValidToken) {
    try {
      // Make a request to Softr's API to create a session
      const response = await axios.post('https://famcareai.com/v1/api/sessions', 
        { email: userEmail },
        { 
          headers: { 
            'Authorization': `Bearer ${process.env.SOFTR_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Return the Softr session token
      res.status(200).json({ softrToken: response.data.token });
    } catch (error) {
      console.error('Error creating Softr session:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Failed to create Softr session' });
    }
  } else {
    res.status(401).json({ error: 'Invalid Supabase token' });
  }
};