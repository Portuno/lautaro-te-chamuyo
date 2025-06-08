const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { message } = req.body;
  if (!message) {
    res.status(400).json({ error: 'Missing message' });
    return;
  }

  try {
    const response = await axios.post(
      process.env.MABOT_API_URL,
      { message },
      {
        auth: {
          username: process.env.MABOT_USERNAME,
          password: process.env.MABOT_PASSWORD
        }
      }
    );
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Error comunicando con Mabot', details: err.message });
  }
}; 