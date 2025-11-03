const express = require('express');
const router = express.Router();
const Article = require('../models/articlemodel');
const Section = require('../models/sectionmodel');
const Stock = require('../models/stockmodel');

const nodemailer = require('nodemailer');
// afficher les articles
router.get('/afficherarticles', async (req, res) => {
  const articles = await Article.find().sort({ date: -1 });
  
  res.render('afficherarticles', { articles });
});

// ajouter un article
router.get('/ajouter', async(req, res) => {
  const sections = await Section.find()
  .sort({ section_name: 1 }); // trie alphabétique
  
  res.render('article',{sections});
});


/* ===========================
   ➕ AJOUTER UN ARTICLE (mise à jour du stock)
=========================== */
router.post('/ajouter', async (req, res) => {
  try {
    const { designation, qte, numero, date, section } = req.body;

    // 🔎 1️⃣ Vérifier si l’article existe dans le stock
    const stock = await Stock.findOne({ designation });
    if (!stock) {
      return res.status(404).send(`❌ L’article "${designation}" n’existe pas dans le stock.`);
    }

    // ⚠️ 2️⃣ Vérifier que le stock est suffisant
    if (stock.qte < qte) {
      return res
        .status(400)
        .send(`⚠️ Stock insuffisant : disponible ${stock.qte}, demandé ${qte}.`);
    }

    // 🧾 3️⃣ Créer l’article (enregistrement de la sortie)
    const nouvelArticle = new Article({designation,qte,numero,date,section});
    await nouvelArticle.save();
    // 🔄 4️⃣ Mettre à jour le stock
    stock.qte -= qte; // soustraction de la quantité sortie
    await stock.save();
    console.log(`✅ Stock mis à jour : ${designation} → nouvelle quantité = ${stock.qte}`);
    res.redirect('/'); // redirection vers la liste des articles
  } catch (error) {
    console.error('❌ Erreur ajout article :', error);
    res.status(500).send('Erreur lors de l’ajout de l’article.');
  }
});

// page modifier un article
router.get('/modifier/:id', async (req, res) => {
  const article = await Article.findById(req.params.id);
  const sections = await Section.find()
  .sort({ section_name: 1 }); // trie alphabétique
  res.render('editArticle', { article ,sections});
});

// modifier
router.post('/modifier/:id', async (req, res) => {
  const { designation, qte, numero, date, section } = req.body;
  await Article.findByIdAndUpdate(req.params.id, {
    designation,
    qte,
    numero,
    date,
    section
  });
  res.redirect('/');
});

// supprimer 
/* ===========================
   🔎 PAGE DE CONFIRMATION SUPPRESSION
=========================== */
router.get('/supprimer/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send("❌ Article non trouvé.");
    }
    // Affiche la vue de confirmation
    res.render('supprimer', { article });
  } catch (error) {
    console.error('❌ Erreur chargement page suppression :', error);
    res.status(500).send('Erreur chargement page suppression.');
  }
});



// 📦 Récupérer toutes les désignations sans doublons
router.get('/designations', async (req, res) => {
  try {
    const article = await Article.distinct('designation'); // ✅ évite les doublons
    res.json(article);
  } catch (err) {
    console.error('Erreur récupération désignations:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


/* ===========================
   🧾 PAGE DE CONFIRMATION DE SUPPRESSION
=========================== */
router.get('/supprimerarticle/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send("❌ Article non trouvé.");
    }
    res.render('supprimerarticle', { article });
  } catch (error) {
    console.error("Erreur affichage suppression :", error);
    res.status(500).send("Erreur lors du chargement de la page suppression.");
  }
});
/* ===========================
   🗑️ SUPPRIMER UN ARTICLE (et MAJ du stock)
=========================== */
router.post('/supprimerarticle/:id', async (req, res) => {
  try {
    // 1️⃣ Trouver l’article
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send("❌ Article non trouvé.");
    }

    // 2️⃣ Trouver le stock correspondant
    const stock = await Stock.findOne({ designation: article.designation });
    if (stock) {
      // 3️⃣ Réajuster la quantité du stock
      stock.qte += article.qte;
      await stock.save();
      console.log(`♻️ Stock mis à jour : ${article.designation} → nouvelle quantité = ${stock.qte}`);
    } else {
      console.warn(`⚠️ Aucun stock trouvé pour la désignation "${article.designation}"`);
    }

    // 4️⃣ Supprimer l’article
    await Article.findByIdAndDelete(req.params.id);

    console.log(`🗑️ Article supprimé : ${article.designation}`);
    res.redirect('/'); // Retour à la liste
  } catch (error) {
    console.error("❌ Erreur suppression article :", error);
    res.status(500).send("Erreur lors de la suppression de l’article.");
  }
});


module.exports = router;
