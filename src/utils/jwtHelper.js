import jwt from "jsonwebtoken";

export function generateJWTToken(userId, email, jwtSecretKey, token_lifetime) {
  const token = jwt.sign({ userId: userId, email: email }, jwtSecretKey, {
    expiresIn: token_lifetime,
  });
  return token;
}

export const verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
};
