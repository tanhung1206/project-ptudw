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
  async insertUser(username, password, email) {
    const result = await db.query(
      `insert into users (username, password, email, avatar)
             values ($1, $2, $3, $4) RETURNING userid`,
      [username, password, email, "/img/default-avatar.png"]
    );
    //return result.rowCount;
    return result.rows[0]?.userid;
  },

  async activateUser(userId) {
    const result = await db.query(
      `UPDATE Users SET isActivated = TRUE WHERE userId = $1`,
      [userId]
    );
    return result.rowCount;
  },

  async createGoogleUser({
    username,
    email,
    avatar,
    isActivated,
    authProvider,
  }) {
    const result = await db.query(
      `INSERT INTO Users (username, email, avatar, isActivated, authProvider)
     VALUES ($1, $2, $3, $4, $5) RETURNING userId`,
      [username, email, avatar, isActivated, authProvider]
    );
    return result.rows[0]?.userId;
  },
};
