const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// 🌐 Route pour afficher la page d’envoi d’e-mail
router.get('/email', (req, res) => {
  res.render('email'); // fichier email.ejs dans ton dossier views
});

// 📤 Route pour envoyer un e-mail
router.post('/envoyer-email', async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'karimknd2024@gmail.com',
        pass: 'qlvv mblv xurl cwpb'
      }
    });

    const mailOptions = {
      from: '"APC Zighoud Youcef" <tonemail@gmail.com>',
      to,
      subject,
      html: `<p>${message}</p>`
    };

    await transporter.sendMail(mailOptions);
    res.render('email', { success: true, message: '✅ Email envoyé avec succès !' });
  } catch (err) {
    console.error('Erreur email :', err);
    res.render('email', { success: false, message: '❌ Erreur lors de l’envoi de l’email.' });
  }
});


module.exports = router;
