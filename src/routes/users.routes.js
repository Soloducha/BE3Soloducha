import { Router } from "express";
import User from "../models/user.model.js";
import { USER_ROLES } from "../constants/index.js";
import usersController from "../controllers/users.controller.js";

const router = Router();

// GET /api/users
router.get("", usersController.getAllUsers);
// GET /api/users/:uid
router.get("/:uid", usersController.getUserById);
// POST /api/users
router.post("", usersController.createUser);
// PUT /api/users/:uid
router.put("/:uid", usersController.updateUser);
// DELETE /api/users/:uid
router.delete("/:uid", usersController.deleteUser);

export default router;
