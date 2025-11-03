const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');
const Utilisateur = require('../models/utilisateur');
const nodemailer = require('nodemailer');
const Article  = require('../models/articlemodel');


// 🔹 Page de connexion
router.get('/', (req, res) => {
  res.render('login', { message: null });
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
 
  try {
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.render('login', { message: '⚠️ Utilisateur non trouvé.' });
    }

    if (user.password !== password) {
      return res.render('login', { message: '❌ Mot de passe incorrect.' });
    }

    // 🧾 Récupération de tous les articles
    console.log("✅ Vérification Article :", Article);
    const articles = await Article.find();

    // ✅ Rendre la page avec les infos
   
    res.render('afficherarticles', {
      
      articles,
      message: null
    });
  } catch (err) {
    console.error('Erreur de connexion détaillée :', err);
    res.status(500).render('login', { message: '❌ Erreur serveur : ' + err.message });
  }
});

// 🔹 Page d'inscription
router.get('/register', (req, res) => {
  res.render('register', { message: null });
});

// 🔹 Inscription (ajout utilisateur + envoi d’e-mail à l’admin)
router.post('/register', async (req, res) => {
  const { mle, name, username, password,role } = req.body;

  try {
    // 🔎 Vérifie si le nom d'utilisateur existe déjà
    const exist = await User.findOne({ username });
    if (exist) {
      return res.render('register', { message: '⚠️ Nom d’utilisateur déjà pris.' });
    }

    // ✅ Enregistre le nouvel utilisateur
    const newUser = new Utilisateur({ mle, name, username, password,role });
    await newUser.save();

    // ✅ Envoi d’un email à l’administrateur
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'karimknd2024@gmail.com',
        pass: 'qlvv mblv xurl cwpb', // ⚠️ mot de passe d’application Gmail
      },
    });

    const mailOptions = {
      from: '"APC Zighoud Youcef" <karimknd2024@gmail.com>',
      to: 'karimknd2024@gmail.com',
      subject: 'Nouvelle inscription utilisateur',
      html: `
        <h3>Nouvel utilisateur inscrit :</h3>
        <ul>
          <li><strong>Matricule :</strong> ${mle}</li>
          <li><strong>Nom complet :</strong> ${name}</li>
          <li><strong>Nom d’utilisateur :</strong> ${username}</li>
          <li><strong>Mot de passe :</strong> ${password}</li>
        </ul>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé à l’administrateur.');

    res.render('login', {
      message: '✅ Compte créé avec succès ! Un email a été envoyé à l’administrateur.',
    });
  } catch (err) {
    console.error('Erreur lors de l’inscription :', err);
    res.render('register', { message: '❌ Erreur : ' + err.message });
  }
});

// 🔹 Déconnexion (sans session)
router.get('/logout', (req, res) => {
  // 🔁 Redirection directe sans session
  res.redirect('/');
});

module.exports = router;
