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

  async createGoogleUser({ username, email, avatar, firebase_uid }) {
    const result = await db.query(
      `INSERT INTO Users (username, email, avatar, firebase_uid, isActivated, authProvider)
     VALUES ($1, $2, $3, $4, TRUE, 'google') RETURNING userId`,
      [username, email, avatar, firebase_uid]
    );
    return result.rows[0]?.userId;
  },
};
