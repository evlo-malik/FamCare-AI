const axios = require('axios');

module.exports = async (req, res) => {
  // CORS headers (as before)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://www.famcareai.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).json({ error: 'Missing required parameter: userEmail' });
  }

  const softrApiKey = process.env.SOFTR_API_KEY;
  const softrDomain = 'famcareai.com'; // Update this if it's different

  try {
    const response = await axios.post(
      `https://studio-api.softr.io/v1/api/users/magic-link/generate/${encodeURIComponent(userEmail)}`,
      {},
      {
        headers: {
          'Softr-Api-Key': softrApiKey,
          'Softr-Domain': softrDomain
        }
      }
    );

    console.log('Magic link generated successfully');
    res.status(200).json({ magicLink: response.data.magic_link });
  } catch (error) {
    console.error('Error generating magic link:', error.response ? error.response.data : error.message);
    res.status(500).json({ 
      error: 'Failed to generate magic link', 
      details: error.response ? error.response.data : error.message 
    });
  }
};
