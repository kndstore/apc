const express = require('express');
const router = express.Router();
const Section = require('../models/sectionmodel');

// 📋 Afficher toutes les sections
router.get('/affichersections', async (req, res) => {
  const sections = await Section.find().sort({ name: 1 });
  res.render('sections/affichersections', { sections });
});

// ➕ Ajouter une section
router.get('/ajouter', (req, res) => {
  res.render('sections/ajoutersection');
});

router.post('/ajouter', async (req, res) => {
  const { section_name } = req.body;
  await Section.create({ section_name });
  res.redirect('/sections/affichersections');
});

// ✏️ Modifier une section (afficher le formulaire)
router.get('/modifier/:id', async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).send('Section non trouvée');
    res.render('sections/editSection', { section });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// 💾 Enregistrer la modification
router.post('/modifier/:id', async (req, res) => {
  try {
    const { section_name } = req.body;

    // 1️⃣ Récupérer l'ancienne section
    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).send('Section non trouvée');

    const ancienNom = section.section_name; // ancien nom avant modification

    // 2️⃣ Mettre à jour le nom de la section
    await Section.findByIdAndUpdate(req.params.id, { section_name });

    // 3️⃣ Mettre à jour tous les articles liés à cette section
    const Article = require('../models/articlemodel'); // importer le modèle Article si nécessaire
    await Article.updateMany(
      { section: ancienNom },        // condition : ancienne section
      { $set: { section: section_name } } // nouvelle valeur
    );

    // 4️⃣ Rediriger vers la liste des sections
    res.redirect('/sections/affichersections');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la mise à jour');
  }
});


// ❌ Supprimer une section
router.post('/supprimer/:id', async (req, res) => {
  await Section.findByIdAndDelete(req.params.id);
  res.redirect('/sections/affichersections');
});

module.exports = router;
