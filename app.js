const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const app = express();

// Подключение к базе данных MongoDB
async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/auction-system', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Подключение к MongoDB установлено');
    } catch (err) {
        console.error('Ошибка подключения к MongoDB:', err);
    }
}

connectDB();

// Настройка шаблонизатора EJS
app.set('view engine', 'ejs');

// Подключение body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Подключение method-override для поддержки PUT и DELETE методов
app.use(methodOverride('_method'));

// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.user || null;
    next();
});

// Подключение маршрутов
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes'); // Новый маршрут для предметов
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/items', itemRoutes); // Подключение маршрутов предметов

// Главная страница
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
