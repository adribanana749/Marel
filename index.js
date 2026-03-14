const express = require('express');
const app = express();
app.use(express.json());

app.post('/marel', async (req, res) => {
  try {
    const { playerName, question, systemPrompt } = req.body;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        max_tokens: 150,
        messages: [
          { role: 'system', content: 'Du bist Marel, eine freundliche KI-Assistentin in Roblox. Antworte immer auf Deutsch, kurz und nett.' },
          { role: 'user', content: 'Spieler ' + playerName + ' fragt: ' + question }
        ]
      })
    });

    const data = await response.json();
    const text = data.choices[0].message.content;
    res.json({ response: text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ response: 'Fehler: ' + err.message });
  }
});

app.get('/', (req, res) => res.send('Marel läuft!'));
app.listen(3000);
