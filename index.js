const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoute    = require('./routes/userroute');
const articleRoute = require('./routes/articleroute');
const sectionRoute = require('./routes/sectionroute');
const stockRoute   = require('./routes/stockroute');
const dashRouter = require('./routes/dashroute.js');
const emailRoute   = require('./routes/emailroute');

const MongoStore = require('connect-mongo');
const app = express();


//mongodb://127.0.0.1:27017/APC

// 🔗 Connexion MongoDB
mongoose.connect('mongodb+srv://karimknd2024:karimknd2024@cluster0.ksm8lz.mongodb.net/APC?appName=Cluster0')
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.log('Erreur MongoDB:', err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));




// استخدام المسارات
app.use('/', userRoute);
app.use('/', articleRoute);
app.use('/sections/', sectionRoute);
app.use('/stock', stockRoute);
app.use('/dashboard', dashRouter);
app.use('/', emailRoute);

// 🚀 Lancer le serveur
app.listen(3000, () => console.log('🚀 Serveur sur http://localhost:3000'));
