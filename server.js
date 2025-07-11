const express = require('express');
const app = express();
const PORT = 3000;

// Dati in memoria (simulazione database)
const users = []; // {id, username, password}
const posts = []; // {id, userId, text}

// Middleware per leggere JSON nel corpo delle richieste
app.use(express.json());


// Registrazione utente
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username e password sono obbligatori' });
  }

  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Utente già esistente' });
  }

  const user = {
    id: users.length + 1,
    username,
    password, // In un progetto reale va criptata!
  };

  users.push(user);
  res.status(201).json({ message: 'Utente registrato', user });
});

// Login utente
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Credenziali non valide' });
  }

  res.json({ message: 'Login riuscito', user });
});

// Creazione di un post
app.post('/post', (req, res) => {
  const { userId, text } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(400).json({ message: 'Utente non trovato' });
  }

  const post = {
    id: posts.length + 1,
    userId,
    text,
  };

  posts.push(post);
  res.status(201).json({ message: 'Post creato', post });
});

// Lista dei post
app.get('/posts', (req, res) => {
  const enrichedPosts = posts.map(post => {
    const user = users.find(u => u.id === post.userId);
    return {
      ...post,
      username: user ? user.username : 'sconosciuto'
    };
  });
  res.json(enrichedPosts);
});


const path = require('path');

// Servi i file statici dalla cartella 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
