const UserService = require("../services/user-service");
const TokenService = require("../services/token-service");
const bcrypt = require("bcrypt");

class UserController {
  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await UserService.getUserByEmail(email);

      if (!user) {
        return res
          .status(401)
          .json({ success: false, error: "User not found" });
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return res
          .status(401)
          .json({ success: false, error: "Invalid credentials" });
      }

      const accessToken = TokenService.signToken(
        { userId: user.user_id },
        process.env.JWT_SECRET,
        process.env.REFRESH_TOKEN_TTL
      );
      const refreshToken = TokenService.signRefreshToken(user.user_id);

      res.json({
        data: {
          id: user.user_id,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  async signUp(req, res, next) {
    try {
      const { email, password } = req.body;

      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(password, saltRounds);

      const userId = await UserService.createUser(email, hashedPassword);

      const accessToken = TokenService.signToken(
        { userId },
        process.env.JWT_SECRET,
        process.env.ACCESS_TOKEN_TTL
      );
      const refreshToken = TokenService.signRefreshToken(userId);

      await UserService.updateUserTokens(userId, accessToken, refreshToken);

      res.status(201).json({
        success: true,
        data: {
          id: userId,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const { refreshToken } = req.body;

      const decoded = TokenService.verifyRefreshToken(refreshToken);

      if (!decoded) {
        return res
          .status(401)
          .json({ success: false, error: "Invalid refresh token" });
      }

      const user = await UserService.getUserById(decoded.userId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      res.json({
        success: true,
        data: {
          id: user.user_id,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
}

module.exports = new UserController();
