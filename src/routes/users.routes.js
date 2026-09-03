import { Router } from "express";
import usersController from "../controllers/users.controller.js";

const router = Router();

// GET /api/users/all
router.get("/all", usersController.getAllUsers);
// GET /api/users paginado
router.get("", usersController.paginated);
// GET /api/users/:uid
router.get("/:uid", usersController.getUserById);
// POST /api/users
router.post("", usersController.createUser);
// PUT /api/users/:uid
router.put("/:uid", usersController.updateUser);
// DELETE /api/users/:uid
router.delete("/:uid", usersController.deleteUser);

export default router;
