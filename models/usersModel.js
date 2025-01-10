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

  async createGoogleUser({ username, email, avatar }) {
    const result = await db.query(
      `INSERT INTO ${tableName} (username, email, password, avatar, isActivated, authProvider)
     VALUES ($1, $2, NULL, $3, TRUE, 'google') RETURNING userId`,
      [username, email, avatar]
    );
    return result.rows[0]?.userId;
  },

  async insertUser(
    username,
    password,
    email,
    isActivated = false,
    authProvider = "local"
  ) {
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
    return result.rows[0]?.userId;
  },
};
