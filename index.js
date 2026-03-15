const express = require('express');
const app = express();
app.use(express.json());

app.post('/marel', async (req, res) => {
  try {
    const playerName = req.body.playerName || 'Player';
    const question = req.body.question || '';
    const language = req.body.language || 'English';

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 150,
        messages: [
          { 
            role: 'system', 
            content: 'You are Marel, a friendly AI assistant in Roblox. You MUST ALWAYS respond ONLY in ' + language + '. Never switch to another language under any circumstances. Keep answers short (1-3 sentences), use emojis sometimes, be positive and helpful.'
          },
          { 
            role: 'user', 
            content: 'Player ' + playerName + ' says: ' + question 
          }
        ]
      })
    });

    const data = await response.json();
    console.log('Language:', language);
    console.log('Groq response:', JSON.stringify(data));

    if (data.choices && data.choices[0]) {
      res.json({ response: data.choices[0].message.content });
    } else {
      res.json({ response: 'Error: ' + JSON.stringify(data) });
    }

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ response: 'Server error: ' + err.message });
  }
});

app.get('/', (req, res) => res.send('Marel läuft!'));
app.listen(3000);
