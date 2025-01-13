const db = require("../db/db");
const tableName = "Users";
module.exports = {
  async findById(id) {
    const result = await db.query(
      `select * from ${tableName} where userid='${id}'`
    );
    return result.rows;
  },
  async findByUserName(username) {
    const result = await db.query(
      `select * from ${tableName} where username='${username}'`
    );
    return result.rows;
  },
  async findByEmail(email) {
    const result = await db.query(
      `select * from ${tableName} where email='${email}'`
    );
    return result.rows;
  },

  async activateUser(userId) {
    const result = await db.query(
      `UPDATE Users SET isActivated = TRUE WHERE userId = $1`,
      [userId]
    );
    return result.rowCount;
  },

  async insertUser(
    username,
    password,
    email,
    isActivated = false,
    authProvider = "local"
  ) {
    try {
      const result = await db.query(
        `INSERT INTO Users (username, password, email, avatar, isActivated, authProvider)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING userid`,
        [
          username,
          password,
          email,
          "/img/default-avatar.png",
          isActivated,
          authProvider,
        ]
      );

      if (!result.rows[0]?.userid) {
        throw new Error("Failed to insert user: No userId returned.");
      }

      return result.rows[0].userid;
    } catch (error) {
      console.error("Database Error in insertUser:", error.message);
      throw new Error(`Database Error in insertUser: ${error.message}`);
    }
  },

  async createGoogleUser({ username, email, avatar }) {
    const client = await db.connect(); // Lấy kết nối transaction
    try {
      await client.query("BEGIN"); // Bắt đầu transaction

      const existingUser = (await this.findByEmail(email))[0];
      if (existingUser) {
        throw new Error(
          `Email ${email} is already associated with another account.`
        );
      }

      const result = await client.query(
        `INSERT INTO ${tableName} (username, email, password, avatar, isActivated, authProvider)
       VALUES ($1, $2, NULL, $3, TRUE, 'google') RETURNING userId`,
        [username, email, avatar]
      );

      if (!result.rows[0]?.userid) {
        throw new Error("Failed to create Google user: No userId returned.");
      }

      await client.query("COMMIT"); // Commit nếu mọi thứ ổn
      return result.rows[0].userid;
    } catch (error) {
      await client.query("ROLLBACK"); // Rollback nếu có lỗi
      console.error("Database Error in createGoogleUser:", error.message);
      throw new Error(`Database Error in createGoogleUser: ${error.message}`);
    } finally {
      client.release(); // Đóng kết nối transaction
    }
  },

  // Save reset password token
  async saveResetPasswordToken(email, token, expiration) {
    try {
      const result = await db.query(
        `UPDATE ${tableName} SET resetToken = $1, resetTokenExpiration = $2 WHERE email = $3`,
        [token, expiration, email]
      );
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error in saveResetPasswordToken:", error.message);
      throw new Error(
        `Database Error in saveResetPasswordToken: ${error.message}`
      );
    }
  },

  // Verify reset password token
  async verifyResetToken(token) {
    try {
      const result = await db.query(
        `SELECT * FROM ${tableName} WHERE resetToken = $1 AND resetTokenExpiration > NOW()`,
        [token]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error in verifyResetToken:", error.message);
      throw new Error(`Database Error in verifyResetToken: ${error.message}`);
    }
  },

  // Reset password
  async resetPassword(userId, newPassword) {
    try {
      const result = await db.query(
        `UPDATE ${tableName} SET password = $1, resetToken = NULL, resetTokenExpiration = NULL WHERE userid = $2`,
        [newPassword, userId]
      );
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error in resetPassword:", error.message);
      throw new Error(`Database Error in resetPassword: ${error.message}`);
    }
  },

  async updateProfile(userId, firstname, lastname) {
    const result = await db.query(
      `UPDATE Users SET firstname = $1, lastname = $2 WHERE userId = $3`,
      [firstname, lastname, userId]
    );
    return result.rowCount;
  },

  async updateAvatar(userId, avatarPath) {
    const result = await db.query(
      `UPDATE Users SET avatar = $1 WHERE userId = $2`,
      [avatarPath, userId]
    );
    return result.rowCount;
  },

  async updatePassword(userId, newPassword) {
    const result = await db.query(
      `UPDATE Users SET password = $1 WHERE userId = $2`,
      [newPassword, userId]
    );
    return result.rowCount;
  },
};
