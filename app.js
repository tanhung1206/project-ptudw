const express = require("express");
const session = require("express-session");
const { engine } = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const usersModel = require("./models/usersModel");
const moment = require("moment");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./db/db");
require("dotenv").config();

const app = express();

// Cấu hình Handlebars
app.engine(
  "hbs",
  engine({
    extname: ".hbs", // Định dạng file là .hbs
    defaultLayout: "main", // Layout chính
    layoutsDir: path.join(__dirname, "/views/layouts"), // Thư mục chứa layout
    partialsDir: path.join(__dirname, "/views/partials"), // Thư mục chứa các partials
    helpers: {
      eq: (a, b) => a === b, // Định nghĩa helper 'eq'
      neq: (a, b) => a !== b,
      for: function (from, to, block) {
        let accum = "";
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
      },
      range: (start, end) => {
        const result = [];
        for (let i = start; i <= end; i++) {
          result.push(i);
        }
        return result;
      },
      formatDate: (date, format) => {
        return moment(date).format(format);
      },
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));

// Cấu hình express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret-key", // Lấy secret từ .env hoặc dùng giá trị mặc định
    resave: false, // Không lưu lại session nếu không có thay đổi
    saveUninitialized: false, // Không lưu session chưa được khởi tạo
    cookie: {
      secure: false, // Bật true nếu sử dụng HTTPS
      maxAge: 1000 * 60 * 60 * 24, // Thời gian sống của cookie: 1 ngày
    },
  })
);

// Cấu hình body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Định nghĩa thư mục chứa các file tĩnh
app.use(express.static(path.join(__dirname, "/public")));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      if (!username || !password) {
        return done(null, false, "Username and password are required.");
      }

      // Tìm user theo username
      const user = (await usersModel.findByUserName(username))[0];
      if (!user) {
        // Nếu không tìm thấy user, trả về "Invalid username or password."
        return done(null, false, "Invalid username or password.");
      }

      // So sánh mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Nếu mật khẩu không khớp, trả về "Invalid username or password."
        return done(null, false, "Invalid username or password.");
      }

      // Kiểm tra tài khoản đã kích hoạt hay chưa
      if (!user.isactivated) {
        // Nếu chưa kích hoạt, trả về thông báo "Your account is not activated."
        return done(
          null,
          false,
          "Your account is not activated. Please check your email."
        );
      }

      if (user.isban) {
        return done(null, false, "Your account is banned. Please contact admin.");
      }

      // Nếu tất cả hợp lệ, trả về user
      return done(null, user);
    } catch (err) {
      return done(err, null, "An error occurred. Please try again later.");
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.userid);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = (await usersModel.findById(id))[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Cấu hình Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const client = await db.connect(); // Kết nối transaction
      try {
        if (!profile) {
          throw new Error("Google Profile is missing.");
        }
        console.log("Google Profile:", profile);

        const email = profile.emails?.[0]?.value;
        if (!email) {
          throw new Error("Google profile does not have an email.");
        }

        // Kiểm tra xem email đã tồn tại hay chưa
        const existingUser = (await usersModel.findByEmail(email))[0];
        if (existingUser) {
          console.log("Existing user found:", existingUser);

          // Nếu tài khoản đã tồn tại nhưng không phải Google OAuth
          if (existingUser.authprovider !== "google") {
            throw new Error(
              "Your email is registered as a standard account. Please log in with your password."
            );
          }

          // Nếu tài khoản là Google OAuth
          return done(null, existingUser);
        }

        // Nếu không tồn tại, bắt đầu transaction
        await client.query("BEGIN");

        const newUser = {
          username: profile.displayName || `user_${Date.now()}`,
          email,
          avatar: profile.photos?.[0]?.value || "/img/default-avatar.png",
        };

        console.log("Creating new Google user:", newUser);

        const userId = await usersModel.createGoogleUser(newUser, client);

        if (!userId) {
          throw new Error("Failed to create a new user via Google OAuth.");
        }

        const createdUser = (await usersModel.findById(userId))[0];
        if (!createdUser) {
          throw new Error(
            `User created successfully but could not be retrieved from database. UserID: ${userId}`
          );
        }

        // Commit transaction nếu mọi thứ thành công
        await client.query("COMMIT");

        console.log("New user created:", createdUser);
        return done(null, createdUser);
      } catch (error) {
        // Rollback nếu có lỗi
        await client.query("ROLLBACK").catch((rollbackError) => {
          console.error("Failed to rollback transaction:", rollbackError);
        });

        // Log lỗi và ném lại
        console.error(`Google OAuth Error: ${error.message}`);
        return done(error, null);
      } finally {
        client.release(); // Giải phóng kết nối transaction
      }
    }
  )
);

// Middleware toàn cục: Cung cấp danh sách categories và thông tin user
app.use(async (req, res, next) => {
  const categoriyModel = require("./models/categoriesModel");
  const categories = (await categoriyModel.findAll()).rows;
  res.locals.categories = categories;

  // Đưa thông tin user vào res.locals để dùng trong views
  // res.locals.user = req.session.user || null;
  res.locals.user = req.user;

  if (req.isAuthenticated()) {
    const cartModel = require("./models/cartModel");
    const carts = await cartModel.findByUserId(req.user.userid);
    carts.forEach((item) => {
      item.totalPrice = item.quantity * item.price;
    });
    const [totalPrices, totalQuantities] = carts.reduce(
      (total, cur) => {
        return [total[0] + cur.totalPrice, total[1] + cur.quantity];
      },
      [0, 0]
    );
    res.locals.carts = carts;
    res.locals.totalPrices = totalPrices;
    res.locals.totalQuantities = totalQuantities;
  }
  next();
});

// Import và sử dụng các controllers
const aboutRouter = require("./controllers/aboutController");
const cartRouter = require("./controllers/cartController");
const checkoutRouter = require("./controllers/checkoutController");
const contactRouter = require("./controllers/contactController");
const indexRouter = require("./controllers/indexController");
const usersRouter = require("./controllers/usersController");
const productsRouter = require("./controllers/productsController");
const ordersRouter = require("./controllers/ordersController");
const authRouter = require("./controllers/usersController");
const paymentRouter = require("./controllers/paymentController");

app.use("/", indexRouter);
app.use("/about", aboutRouter);
app.use("/cart", require("./middlewares/restrict"), cartRouter);
app.use("/checkout", require("./middlewares/restrict"), checkoutRouter);
app.use("/contact", contactRouter);
app.use("/auth", authRouter);
app.use("/user", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", require("./middlewares/restrict"), ordersRouter);
app.use("/payment", require("./middlewares/restrict"), paymentRouter);

app.use("/api/products", require("./controllers/apiProducts"));

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
