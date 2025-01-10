const express = require("express");
const router = express.Router();
const usersModel = require("../models/usersModel");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { sendActivationEmail } = require("../services/emailService");
// const { sendActivationEmail } = require('../services/emailService');

// GET /login - Render the login page
router.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
    message: "Login",
    currentPage: "login",
    errorMessage: req.query.error || null,
  });
});

// POST /login - Handle login form submission
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      console.error("Login Error:", error);
      return res.status(500).render("login", {
        title: "Login",
        message: "Login",
        currentPage: "login",
        errorMessage: info,
      });
    } else {
      if (!user) {
        return res.render("login", {
          title: "Login",
          message: "Login",
          currentPage: "login",
          errorMessage: info,
        });
      } else {
        req.logIn(user, (err) => {
          return res.redirect("/");
        });
      }
    }
  })(req, res, next);
});

// GET /logout - Handle logout
router.get("/logout", (req, res) => {
  req.logOut((err) => {
    res.redirect("/user/login");
  });
});

router.get("/profile", require("../middlewares/restrict"), (req, res) => {
  res.render("profile", {
    layout: "index-layout",
  });
});

const isPasswordComplex = (password) => {
  const complexityRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return complexityRegex.test(password);
};

router.get("/register", (req, res) => {
  res.render("register", {
    title: "Register",
    message: "Register",
    currentPage: "register",
  });
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    const usernameExists = (await usersModel.findByUserName(username))[0];
    const emailExists = (await usersModel.findByEmail(email))[0];

    const errors = {
      usernameError: usernameExists ? "Username already exists" : "",
      emailError: emailExists ? "Email already exists" : "",
      passwordError: !isPasswordComplex(password)
        ? "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character."
        : "",
      confirmPasswordError:
        password !== confirmPassword ? "Passwords do not match." : "",
    };

    if (Object.values(errors).some((err) => err)) {
      return res.render("register", {
        title: "Register",
        message: "Register",
        currentPage: "register",
        ...errors,
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const userId = await usersModel.insertUser(username, hashedPassword, email);

    if (!userId) {
      console.error("Insert User Failed: No userId returned.");
      return res.status(500).render("register", {
        title: "Register",
        message: "An error occurred. Please try again later.",
        currentPage: "register",
        success: false,
      });
    }

    // Tạo link kích hoạt tài khoản
    const activationToken = Buffer.from(`${userId}:${email}`).toString(
      "base64"
    );
    const activationLink = `${req.protocol}://${req.get(
      "host"
    )}/user/activate/${activationToken}`;

    // Gửi email kích hoạt
    await sendActivationEmail(email, activationLink);

    res.render("register", {
      title: "Register",
      message: "Register",
      currentPage: "register",
      success: true,
    });
  } catch (error) {
    console.error("Registration Error: ", error);
    res.status(500).render("register", {
      title: "Register",
      message: "An error occurred. Please try again later.",
      currentPage: "register",
      success: false,
    });
  }
});

router.get("/activate/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const [userId, email] = Buffer.from(token, "base64")
      .toString("ascii")
      .split(":");

    // Kích hoạt tài khoản
    const rowsAffected = await usersModel.activateUser(userId);

    if (rowsAffected === 0) {
      console.log(`Activation failed for userId: ${userId}, email: ${email}`);
      return res.status(400).send("Invalid or expired activation link.");
    }

    // Lấy username sau khi kích hoạt
    const user = (await usersModel.findById(userId))[0];
    if (user) {
      console.log(
        `Account activated successfully for userId: ${userId}, email: ${email}, username: ${user.username}`
      );
    } else {
      console.log(
        `Account activated but failed to retrieve user details for userId: ${userId}`
      );
    }

    res.redirect("/user/login?success=Account activated successfully!");
  } catch (error) {
    console.error("Activation Error:", error);
    res
      .status(500)
      .send(
        "An error occurred while activating your account. Please try again later."
      );
  }
});

// Check Username/Email Availability
router.get("/check-availability", async (req, res) => {
  const { username, email } = req.query;

  try {
    if (username) {
      const user = await usersModel.findByUserName(username);
      return res.json({ available: user.length === 0 });
    }

    if (email) {
      const user = await usersModel.findByEmail(email);
      return res.json({ available: user.length === 0 });
    }

    return res.status(400).json({ error: "Invalid request" });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
