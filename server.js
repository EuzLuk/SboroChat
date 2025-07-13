
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const users = [];
const posts = [];

// login o registrazione
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: 'Username richiesto' });

  let user = users.find(u => u.username === username);
  if (!user) {
    user = { id: users.length+1, username };
    users.push(user);
  }
  res.json({ user });
});

// crea post di testo
app.post('/post', (req, res) => {
  const { userId, text } = req.body;
  if (!text) return res.status(400).json({ message: 'Testo richiesto' });
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(400).json({ message: 'Utente non trovato' });

  const post = {
    id: posts.length+1,
    userId,
    username: user.username,
    text,
    image: '',
    timestamp: new Date().toISOString()
  };
  posts.push(post);
  res.status(201).json({ message: 'Post creato', post });
});

// crea post con immagine casuale
app.post('/post-random-image', (req, res) => {
  const { userId } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(400).json({ message: 'Utente non trovato' });

  const randomIndex = Math.floor(Math.random() * 10) + 1;
  const imagePath = `/images/img${randomIndex}.jpg`;

  const post = {
    id: posts.length+1,
    userId,
    username: user.username,
    text: '',
    image: imagePath,
    timestamp: new Date().toISOString()
  };
  posts.push(post);
  res.status(201).json({ message: 'Immagine postata', post });
});

// restituisce tutti i post
app.get('/posts', (req, res) => {
  const enrichedPosts = posts.map(p => ({
    ...p,
    username: users.find(u => u.id === p.userId)?.username || 'Sconosciuto'
  }));
  res.json(enrichedPosts);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server avviato su http://localhost:${PORT}`));