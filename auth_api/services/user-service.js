const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class UserService {
  async getUserByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async createUser(email, password, accessToken, refreshToken) {
    const query =
      "INSERT INTO users(email, password, access_token, refresh_token) VALUES ($1, $2, $3, $4) RETURNING user_id";
    const hashedPassword = bcrypt.hashSync(password, 10);
    const values = [email, hashedPassword, accessToken, refreshToken];
    const { rows } = await pool.query(query, values);
    return rows[0].user_id;
  }
  async updateUserTokens(userId, accessToken, refreshToken) {
    const query =
      "UPDATE users SET access_token = $1, refresh_token = $2 WHERE user_id = $3";
    const values = [accessToken, refreshToken, userId];
    await pool.query(query, values);
  }
}

module.exports = new UserService();
