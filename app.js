const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');
const Auction = require('./models/Auction');
const app = express();

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

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: 'mongodb://localhost:27017/auction-system',
            ttl: 14 * 24 * 60 * 60
        })
    })
);

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.user || null;
    res.locals.isAuthenticated = req.session.user ? true : false;
    next();
});

app.use(express.static('public'));

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/auctions', auctionRoutes);
app.use('/admin', adminRoutes);

app.get('/', async (req, res) => {
    try {
        const auctions = await Auction.find({}).populate('user', 'username').populate('buyer', 'username');
        console.log('Auctions from main page:', auctions);
        res.render('index', { auctions, user: req.session.user });
    } catch (err) {
        console.error('Błąd pobierania aukcji:', err);
        res.status(500).send(err);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serwer uruchomiony na porcie ${PORT}`);
});
