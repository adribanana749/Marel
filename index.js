const express = require('express');
const app = express();
app.use(express.json());

app.post('/marel', async (req, res) => {
  try {
    const playerName = req.body.playerName || 'Spieler';
    const question = req.body.question || '';

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
          { role: 'system', content: 'Du bist Marel, eine freundliche KI in Roblox. Antworte kurz auf Deutsch.' },
          { role: 'user', content: 'Spieler ' + playerName + ' fragt: ' + question }
        ]
      })
    });

    const data = await response.json();
    console.log('Groq Antwort:', JSON.stringify(data));
    
    if (data.choices && data.choices[0]) {
      res.json({ response: data.choices[0].message.content });
    } else {
      res.json({ response: 'Fehler: ' + JSON.stringify(data) });
    }

  } catch (err) {
    console.error('Fehler:', err);
    res.status(500).json({ response: 'Server Fehler: ' + err.message });
  }
});

app.get('/', (req, res) => res.send('Marel läuft!'));
app.listen(3000);
