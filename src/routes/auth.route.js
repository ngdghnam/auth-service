import express from "express";
import shortid from "shortid";
const router = express.Router();
import * as controller from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/validate.middleware.js";

// Define routes
// Endpoint to create a new user
router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/refresh-token", authMiddleware, controller.refreshToken);

router.get("/users", authMiddleware, controller.getAllUsers);

export default router;
