// routes/dashboard.js
const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');

// GET /dashboard
router.get('/', async (req, res) => {
  const utilisateurs = await User.find();
  res.render('dashboard', { utilisateurs, message: null });
});

// POST /dashboard/ajouterUSER
router.post('/ajouterUSER', async (req, res) => {
  const { mle, name, username, password, role } = req.body;
  const exists = await User.findOne({ username });
  if (exists) {
    const utilisateurs = await User.find();
    return res.render('dashboard', { utilisateurs, message: `⚠️ "${username}" existe déjà` });
  }
  await User.create({ mle, name, username, password, role });
  res.redirect('/dashboard');
});

// POST /dashboard/modifier/:id
router.post('/modifier/:id', async (req, res) => {
  const { mle, name, username, password, role } = req.body;
  const exists = await User.findOne({ username, _id: { $ne: req.params.id } });
  if (exists) {
    const utilisateurs = await User.find();
    return res.render('dashboard', { utilisateurs, message: `⚠️ "${username}" déjà utilisé` });
  }
  await User.findByIdAndUpdate(req.params.id, { mle, name, username, password, role });
  res.redirect('/dashboard');
});

// POST /dashboard/supprimer/:id  <-- POST recommandé
router.get('/supprimer/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
  } catch (err) {
    console.error("Erreur suppression :", err);
    res.status(500).send("Erreur lors de la suppression : " + err.message);
  }
});


module.exports = router;
