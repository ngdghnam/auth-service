import { verifyToken } from "../utils/jwtHelper.js";

export const authMiddleware = async (req, res, next) => {
  const white_lists = ["/register", "/login"];

  if (white_lists.find((item) => "/auth" + item === req.originalUrl)) {
    return next();
  } else {
    if (req?.headers?.authorization?.split(" ")[1]) {
      const token = req.headers.authorization.split(" ")[1];
      try {
        const decoded = await verifyToken(token, process.env.JWT_SECRET_KEY);
        req.user = {
          userId: decoded.id,
          email: decoded.email,
        };
        next();
      } catch {
        return res.status(401).json({
          status: "error",
          message: "Token hết hạn/ hoặc không hợp lệ",
        });
      }
    } else {
      return res.status(401).json({
        message: "Bạn chưa truyền access token ở header/Hoặc token hết hạn",
      });
    }
  }
};
