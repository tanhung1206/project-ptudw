const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
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
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Định nghĩa thư mục chứa các file tĩnh
app.use(express.static(path.join(__dirname, '/public')));

// Import và sử dụng các controllers
const aboutRouter = require('./controllers/aboutController');
const cartRouter = require('./controllers/cartController');
const checkoutRouter = require('./controllers/checkoutController');
const contactRouter = require('./controllers/contactController');
const indexRouter = require('./controllers/indexController');
const loginRouter = require('./controllers/loginController');
const registerRouter = require('./controllers/registerController');
const productsRouter = require('./controllers/productsController');

app.use(async (req, res, next) => {
    const categoriyModel = require("./models/categoriesModel");
    const categories = (await categoriyModel.findAll()).rows;
    // console.log(categories);
    res.locals.categories = categories;
    next();
})

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