const express = require('express');
const app = express();
app.use(express.json());

// message de bienvenue
app.get('/', (req, res) => {
    res.send('Bienvenue sur la page d\'accueil !');
  });

// route ordinaire qui n'est pas l'accueil
app.get('/test/', (req, res) => {
    res.send('Bienvenue sur la page test !');
  });

//route avec variable
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send('Détails de l\'utilisateur avec l\'ID ' + userId);
});

// Methode HTTP
app.post('/users', (req, res) => {
    const userData = req.body;
    // Utilise les données pour créer un nouvel utilisateur dans la base de données
    // Renvoie une réponse appropriée
    console.log(userData);
    res.send('Nouvel utilisateur créé avec succès !');
  });
  

// Middleware pour enregistrer une trace de chaque requête
app.use((req, res, next) => {
  res.setHeader('X-Custom-Header', 'Hello from Express!');
  next();
});


app.listen(3000, () => {
    console.log('Le serveur est démarré sur le port 3000.');
  });
  