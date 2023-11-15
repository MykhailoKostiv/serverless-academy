const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class TokenService {
  signToken(payload, secret, expiresIn) {
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
  }

  async saveRefreshToken(userId, refreshToken) {
    const query = "UPDATE users SET refresh_token = $1 WHERE user_id = $2";
    const values = [refreshToken, userId];

    await pool.query(query, values);
  }

  async getRefreshToken(userId) {
    const query = "SELECT refresh_token FROM users WHERE user_id = $1";
    const values = [userId];

    const result = await pool.query(query, values);
    return result.rows[0] ? result.rows[0].refresh_token : null;
  }

  verifyToken(token, secret) {
    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  generateRefreshTokenPayload(userId) {
    return { userId };
  }

  signRefreshToken(userId) {
    const refreshTokenPayload = this.generateRefreshTokenPayload(userId);
    const refreshToken = this.signToken(
      refreshTokenPayload,
      process.env.JWT_SECRET,
      process.env.REFRESH_TOKEN_TTL
    );
    return refreshToken;
  }
  verifyRefreshToken(refreshToken) {
    try {
      return jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

module.exports = new TokenService();
