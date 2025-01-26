import express from "express";
const router = express.Router();
import * as controller from "../controllers/user.controller.js";

router.get("/users", controller.getAll);

router.get("/users/:id", controller.getUserById);

router.post("/users", controller.postCreate);

router.patch("/users/:id", controller.updateUserById);

router.delete("/users/:id", controller.deleteUserById);

export default router;
