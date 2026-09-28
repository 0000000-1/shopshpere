import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ message: "access denied. No token provided." });
    }

    // Support 'Bearer <token>' format
    const actualToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    // Verify the token using JWT secret
    const decodedUser = jwt.verify(actualToken, process.env.JWT_SECRET);

    // Attach user payload and continue
    req.user = decodedUser;
    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res
      .status(401)
      .json({ message: error.message || "Invalid or expired token" });
  }
};

export default auth;