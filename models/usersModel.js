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
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING userId`,
        [
          username,
          password,
          email,
          "/img/default-avatar.png",
          isActivated,
          authProvider,
        ]
      );

      if (!result.rows[0]?.userId) {
        throw new Error("Failed to insert user: No userId returned.");
      }

      return result.rows[0].userId;
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

      if (!result.rows[0]?.userId) {
        throw new Error("Failed to create Google user: No userId returned.");
      }

      await client.query("COMMIT"); // Commit nếu mọi thứ ổn
      return result.rows[0].userId;
    } catch (error) {
      await client.query("ROLLBACK"); // Rollback nếu có lỗi
      console.error("Database Error in createGoogleUser:", error.message);
      throw new Error(`Database Error in createGoogleUser: ${error.message}`);
    } finally {
      client.release(); // Đóng kết nối transaction
    }
  },
};
