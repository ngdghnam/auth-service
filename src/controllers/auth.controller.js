import knex from "../config/database.js";
import { generateJWTToken } from "../utils/jwtHelper.js";
import { verifyToken } from "../utils/jwtHelper.js";

export const getAllUsers = (req, res) => {
  try {
    const users = knex("auth_users").select("*");
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};

export const register = (req, res) => {
  // const id = shortid.generate();
  const { id, username, email, password } = req.body;

  if (!id || !username || !email || !password) {
    return res
      .status(400)
      .json({ error: "ID, userName, email, and password are required" });
  }

  knex("auth_users")
    .insert({ id, username, email, password })
    .then(() => {
      res
        .status(201)
        .json({ message: "User created successfully", userId: id });
    })
    .catch((err) => {
      console.error("Registration error:", err);
      res.status(500).json({ error: "Registration failed" });
    });
};

export const login = async (req, res) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let refreshTokenSecretKey = process.env.REFRESH_TOKEN_KEY;
  let token_lifetime = process.env.TOKEN_LIFETIME;
  let refresh_token_lifetime = process.env.REFRESH_TOKEN_LIVETIME;

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Find user by email
    const user = await knex("auth_users").where({ email }).first();

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = user.password === password;

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    // const token = jwt.sign(
    //   { userId: user.id, email: user.email },
    //   jwtSecretKey,
    //   { expiresIn: "1h" }
    // );
    let access_token = generateJWTToken(
      user.id,
      user.email,
      jwtSecretKey,
      token_lifetime
    );

    let refresh_token = generateJWTToken(
      user.id,
      user.email,
      refreshTokenSecretKey,
      refresh_token_lifetime
    );

    // Login successful
    res.status(200).json({
      message: "Login successful",
      userId: user.id,
      access_token,
      refresh_token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const refreshToken = async (req, res) => {
  const { refresh_token } = req.body;
  const refreshTokenSecretKey = process.env.REFRESH_TOKEN_KEY;
  let token_lifetime = process.env.TOKEN_LIFETIME;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    var decode = await verifyToken(refresh_token, refreshTokenSecretKey);
    console.log("result >>>", decode);

    let newToken = generateJWTToken(
      decode.userId,
      decode.email,
      jwtSecretKey,
      token_lifetime
    );

    res.status(200).json({ new_access_token: newToken });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "failed" });
  }
};
