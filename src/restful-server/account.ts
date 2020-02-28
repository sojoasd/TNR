import express from "express";
const router = express.Router();
import ActionController from "./actionController";
import UserService from "../service/userService";

// router.post("/register", ActionController.callAsync(UserService.register));
router.get("/login", ActionController.callAsync(UserService.login));
router.get("/afterLoginResponseToken", ActionController.callAsync(UserService.afterLoginResponseToken));

export default router;