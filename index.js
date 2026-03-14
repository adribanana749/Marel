const express = require('express');
const app = express();
app.use(express.json());

app.post('/marel', async (req, res) => {
  const { playerName, question, systemPrompt } = req.body;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        max_tokens: 200,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Spieler ${playerName} fragt: ${question}` }
        ]
      })
    });

    const data = await response.json();
    res.json({ response: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ response: 'Fehler!' });
  }
});

app.get('/', (req, res) => res.send('Marel läuft! ✅'));
app.listen(3000, () => console.log('Marel Server gestartet!'));
