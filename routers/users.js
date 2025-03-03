import express from "express";
import userController from "../controllers/userControllers.js";
import registerController from "../controllers/registerController.js";
import loginController from "../controllers/loginController.js";

const router = express.Router();

router.get("/register", registerController.getRegister);
router.get("/login", loginController.getLogin);
router.post("/register", registerController.register);
router.post("/login", loginController.login);

router.get("/users", userController.getUsersListForEJS);

router.get("/:email", userController.getUserProfile);

export default router;
