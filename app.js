const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');
const Auction = require('./models/Auction');
const app = express();

// Połączenie z bazą danych MongoDB
async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/auction-system', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Połączenie z MongoDB zostało nawiązane');
    } catch (err) {
        console.error('Błąd połączenia z MongoDB:', err);
    }
}

connectDB();

// Konfiguracja silnika szablonów EJS
app.set('view engine', 'ejs');

// Podłączenie body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Podłączenie method-override do obsługi metod PUT i DELETE
app.use(methodOverride('_method'));

// Konfiguracja sesji z wykorzystaniem MongoDB jako magazynu
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: 'mongodb://localhost:27017/auction-system',
            ttl: 14 * 24 * 60 * 60 // Sesja przechowywana przez 14 dni
        })
    })
);

// Podłączenie connect-flash
app.use(flash());

// Zmienne globalne
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.user || null;
    res.locals.isAuthenticated = req.session.user ? true : false;
    next();
});

// Podłączenie plików statycznych
app.use(express.static('public'));

// Podłączenie tras
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/items', itemRoutes);
app.use('/auctions', auctionRoutes);

// Strona główna
app.get('/', async (req, res) => {
    try {
        const auctions = await Auction.find({}).populate('user', 'username').populate('buyer', 'username');
        console.log('Auctions from main page:', auctions); // Logowanie danych aukcji
        res.render('index', { auctions, user: req.session.user });
    } catch (err) {
        console.error('Błąd pobierania aukcji:', err);
        res.status(500).send(err);
    }
});

// Uruchomienie serwera
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serwer uruchomiony na porcie ${PORT}`);
});
