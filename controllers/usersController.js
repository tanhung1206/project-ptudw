const express = require("express");
const router = express.Router();
const usersModel = require("../models/usersModel");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { sendActivationEmail } = require("../services/emailService");
const crypto = require("crypto");
const { sendResetPasswordEmail } = require("../services/emailService");
const multer = require("multer");

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

    if (!username || username.length < 3) {
      return res.render("register", {
        title: "Register",
        message: "Register",
        usernameError: "Username must be at least 3 characters long.",
        currentPage: "register",
        success: false,
      });
    }

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
    const userId = await usersModel.insertUser(
      username,
      hashedPassword,
      email,
      false, // isActivated
      "local" // authProvider
    );

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
    if (!token) {
      return res.status(400).send("Invalid activation token.");
    }

    const decodedToken = Buffer.from(token, "base64").toString("ascii");
    const [userId, email] = decodedToken.split(":");

    if (!userId || !email) {
      return res.status(400).send("Invalid activation token.");
    }

    // Kiểm tra userId và email tồn tại
    const user = await usersModel.findById(userId);
    if (!user || user[0].email !== email) {
      return res.status(400).send("Invalid or expired activation link.");
    }

    // Kích hoạt tài khoản
    const rowsAffected = await usersModel.activateUser(userId);
    if (rowsAffected === 0) {
      return res.status(400).send("Activation failed.");
    }

    res.redirect("/user/login?success=Account activated successfully!");
  } catch (error) {
    console.error("Activation Error:", error);
    res.status(500).send("An error occurred. Please try again later.");
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

// Route bắt đầu quá trình Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Route callback từ Google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/user/login?error=Unable to login with Google.",
  }),
  (req, res) => {
    try {
      if (!req.user) {
        throw new Error("Google login failed: No user returned from Passport.");
      }
      res.redirect("/");
    } catch (error) {
      console.error(error.message);
      res.redirect(`/user/login?error=${encodeURIComponent(error.message)}`);
    }
  }
);

// GET /forgot-password - Render the forgot password page
router.get("/forgot-password", (req, res) => {
  res.render("forgot-password", {
    title: "Forgot Password",
    message: "Forgot Password",
    currentPage: "forgot-password",
    errorMessage: req.query.error || null,
  });
});

// POST /forgot-password - Handle forgot password form submission
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.render("forgot-password", {
        title: "Forgot Password",
        message: "Forgot Password",
        currentPage: "forgot-password",
        errorMessage: "Email is required.",
      });
    }

    const user = (await usersModel.findByEmail(email))[0];
    if (!user) {
      return res.render("forgot-password", {
        title: "Forgot Password",
        message: "Forgot Password",
        currentPage: "forgot-password",
        errorMessage: "No account found with this email address.",
      });
    }

    // Generate reset token and expiration
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiration = new Date(Date.now() + 3600000); // Token valid for 1 hour

    // Save token and expiration in the database
    await usersModel.saveResetPasswordToken(
      email,
      resetToken,
      resetTokenExpiration
    );

    // Send reset password email
    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/user/reset-password/${resetToken}`;
    await sendResetPasswordEmail(email, resetLink);

    res.render("forgot-password", {
      title: "Forgot Password",
      message: "Forgot Password",
      currentPage: "forgot-password",
      successMessage: "Password reset link has been sent to your email.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    res.status(500).render("forgot-password", {
      title: "Forgot Password",
      message: "Forgot Password",
      currentPage: "forgot-password",
      errorMessage: "An error occurred. Please try again later.",
    });
  }
});

// GET /reset-password/:token - Render reset password page
router.get("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const user = await usersModel.verifyResetToken(token);
    if (!user) {
      return res.status(400).render("reset-password", {
        title: "Reset Password",
        message: "Reset Password",
        currentPage: "reset-password",
        errorMessage: "Invalid or expired reset token.",
      });
    }

    res.render("reset-password", {
      title: "Reset Password",
      message: "Reset Password",
      currentPage: "reset-password",
      token,
    });
  } catch (error) {
    console.error("Reset Password Page Error:", error.message);
    res.status(500).render("reset-password", {
      title: "Reset Password",
      message: "Reset Password",
      currentPage: "reset-password",
      errorMessage: "An error occurred. Please try again later.",
    });
  }
});

// POST /reset-password/:token - Handle reset password form submission
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.render("reset-password", {
        title: "Reset Password",
        message: "Reset Password",
        currentPage: "reset-password",
        errorMessage: "All fields are required.",
        token,
      });
    }

    if (password !== confirmPassword) {
      return res.render("reset-password", {
        title: "Reset Password",
        message: "Reset Password",
        currentPage: "reset-password",
        errorMessage: "Passwords do not match.",
        token,
      });
    }

    const user = await usersModel.verifyResetToken(token);
    if (!user) {
      return res.status(400).render("reset-password", {
        title: "Reset Password",
        message: "Reset Password",
        currentPage: "reset-password",
        errorMessage: "Invalid or expired reset token.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Update password and clear reset token
    await usersModel.resetPassword(user.userid, hashedPassword);

    res.render("reset-password", {
      title: "Reset Password",
      message: "Reset Password",
      currentPage: "reset-password",
      successMessage:
        "Your password has been reset successfully. <a href='/user/login'>Click here</a> to login.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    res.status(500).render("reset-password", {
      title: "Reset Password",
      message: "Reset Password",
      currentPage: "reset-password",
      errorMessage: "An error occurred. Please try again later.",
    });
  }
});

// POST /user/update-profile - Verify and update user information
router.post(
  "/update-profile",
  require("../middlewares/restrict"),
  async (req, res) => {
    try {
      const { firstname, lastname } = req.body;

      // Validate input
      if (!firstname || !lastname) {
        return res
          .status(400)
          .json({ error: "Firstname and lastname are required." });
      }

      const nameRegex = /^[A-Z][a-z]*(?:\s+[A-Z][a-z]*)*$/;

      if (!nameRegex.test(firstname)) {
        return res.status(400).json({
          error:
            "Firstname must start with an uppercase letter and contain only letters.",
        });
      }

      if (!nameRegex.test(lastname)) {
        return res.status(400).json({
          error:
            "Lastname must start with an uppercase letter and contain only letters.",
        });
      }

      // Update user profile in the database
      await usersModel.updateProfile(req.user.userid, firstname, lastname);

      res.status(200).json({ message: "Profile updated successfully." });
    } catch (error) {
      console.error("Error updating profile:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating your profile." });
    }
  }
);

// Configure multer for file uploads
const upload = multer({ dest: "public/uploads/avatars/" });

// POST /user/update-avatar - Update user's avatar
router.post(
  "/update-avatar",
  require("../middlewares/restrict"),
  upload.single("avatar"),
  async (req, res) => {
    try {
      const avatarPath = `/uploads/avatars/${req.file.filename}`;

      // Update the avatar in the database
      await usersModel.updateAvatar(req.user.userid, avatarPath);

      res
        .status(200)
        .json({ message: "Avatar updated successfully.", avatar: avatarPath });
    } catch (error) {
      console.error("Error updating avatar:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating your avatar." });
    }
  }
);

// POST /user/update-password - Update user's password
router.post(
  "/update-password",
  require("../middlewares/restrict"),
  async (req, res) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;

      if (!oldPassword || !newPassword || !confirmPassword) {
        return res
          .status(400)
          .json({ error: "All password fields are required." });
      }

      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ error: "New password and confirm password do not match." });
      }

      const user = (await usersModel.findById(req.user.userid))[0];
      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Old password is incorrect." });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 8);
      await usersModel.updatePassword(req.user.userid, hashedNewPassword);

      res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
      console.error("Error updating password:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating your password." });
    }
  }
);

module.exports = router;
