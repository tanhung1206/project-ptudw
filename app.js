const express = require('express');
const session = require('express-session'); // Import express-session
const { engine } = require('express-handlebars');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env

const app = express();

// Cấu hình Handlebars
app.engine('hbs', engine({
    extname: '.hbs',                                             // Định dạng file là .hbs
    defaultLayout: 'main',                                      // Layout chính
    layoutsDir: path.join(__dirname, '/views/layouts'),      // Thư mục chứa layout
    partialsDir: path.join(__dirname, '/views/partials'),    // Thư mục chứa các partials
    helpers: {
        eq: (a, b) => a === b,                                  // Định nghĩa helper 'eq'
        neq: (a, b) => a !== b,
        for: function (from, to, block) {
            let accum = '';
            for (let i = from; i <= to; i++) {
                accum += block.fn(i); // Render nội dung trong {{#for}}...{{/for}} với giá trị i
            }
            return accum;
        },
        gte: function (a, b) {
            return a >= b;
        },
        lte: function (a, b) {
            return a <= b;
        },
        gt: function (a, b) {
            return a > b;
        },
        subtract: function (a, b) {
            return a - b;
        },
        add: function (a, b) {
            return a + b;
        },
        inRange: function (value, a, b) {
            return value >= a && value <= b;
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));

// Cấu hình express-session
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret-key', // Lấy secret từ .env hoặc dùng giá trị mặc định
    resave: false, // Không lưu lại session nếu không có thay đổi
    saveUninitialized: false, // Không lưu session chưa được khởi tạo
    cookie: {
        secure: false, // Bật true nếu sử dụng HTTPS
        maxAge: 1000 * 60 * 60 * 24, // Thời gian sống của cookie: 1 ngày
    },
}));

// Cấu hình body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Định nghĩa thư mục chứa các file tĩnh
app.use(express.static(path.join(__dirname, '/public')));

// Middleware toàn cục: Cung cấp danh sách categories và thông tin user
app.use(async (req, res, next) => {
    const categoriyModel = require("./models/categoriesModel");
    const categories = (await categoriyModel.findAll()).rows;
    res.locals.categories = categories;

    // Đưa thông tin user vào res.locals để dùng trong views
    res.locals.user = req.session.user || null;

    next();
});

// Import và sử dụng các controllers
const aboutRouter = require('./controllers/aboutController');
const cartRouter = require('./controllers/cartController');
const checkoutRouter = require('./controllers/checkoutController');
const contactRouter = require('./controllers/contactController');
const indexRouter = require('./controllers/indexController');
const loginRouter = require('./controllers/loginController');
const registerRouter = require('./controllers/registerController');
const productsRouter = require('./controllers/productsController');

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/contact', contactRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/products', productsRouter);


// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
