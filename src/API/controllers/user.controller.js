import knex from "../../config/database.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function getAll(req, res) {
  try {
    const users = await knex("user_info").select("*");
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
}

export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const [user] = await knex("user_info")
      .select("id", "fisrt_name", "last_name", "phone", "gender")
      .where({ id })
      .limit(1);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
}

export async function postCreate(req, res) {
  try {
    const { fisrt_name, last_name, phone, gender } = req.body;

    // Validate that required fields are not empty
    if (!fisrt_name || !last_name || !phone || !gender) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const [userId] = await knex("user_info").insert({
      fisrt_name,
      last_name,
      phone,
      gender,
    });

    const token = jwt.sign({ userId, fisrt_name, last_name }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      userId,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating record",
      error: err.message,
    });
  }
}

export async function updateUserById(req, res) {
  try {
    const { id } = req.params;
    const { fisrt_name, last_name, phone, gender } = req.body;

    const [updatedUser] = await knex("user_info")
      .where({ id })
      .update({
        fisrt_name,
        last_name,
        phone,
        gender,
        // updated_at: knex.fn.now(),
      })
      .returning("*");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
}

export async function deleteUserById(req, res) {
  try {
    const { id } = req.params;

    const deletedCount = await knex("user_info").where({ id }).del();

    if (deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
}
