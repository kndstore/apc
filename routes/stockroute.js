const express = require('express');
const router = express.Router();
const Stock = require('../models/stockmodel');

// ✅ Afficher tout le stock
router.get('/', async (req, res) => {
  const stocks = await Stock.find().sort({ date_entree: -1 });
  res.render('afficherstock', { stocks });
});

// ✅ Page d’ajout
router.get('/ajouter', (req, res) => {
  res.render('ajouterstock');
});

// ✅ Ajouter un article
router.post('/ajouter', async (req, res) => {
  const { designation, qte, date_entree } = req.body;

  // 🔍 Vérifier si la désignation existe déjà
  const existe = await Stock.findOne({ designation });
  if (existe) {
 return res.render('ajouterstock', { message: ` L’article  existe déjà dans le stock.` });
}

  const nouveau = new Stock({ designation, qte, date_entree });
  await nouveau.save();
  res.redirect('/stock');
});


// 📝 Afficher le formulaire de modification
router.get('/modifier/:id', async (req, res) => {
  const stock = await Stock.findById(req.params.id);
  res.render('modifierstock', { stock });
});

// 💾 Mettre à jour l’article
router.post('/modifier/:id', async (req, res) => {
  try {
    const { designation, qte, date_entree } = req.body;

    await Stock.findByIdAndUpdate(req.params.id, {
      designation,
      qte,
      date_entree
    });

    // Après la modification, redirige vers la liste du stock
    res.redirect('/stock');
  } catch (err) {
    console.error('❌ Erreur modification stock :', err);
    res.status(500).send('Erreur lors de la modification du stock.');
  }
});

// ✅ Supprimer un article
router.get('/supprimer/:id', async (req, res) => {
  await Stock.findByIdAndDelete(req.params.id);
  res.redirect('/stock');
});

module.exports = router;
