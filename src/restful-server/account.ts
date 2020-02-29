import express from "express";
const router = express.Router();
import ActionController from "./actionController";
import UserService from "../service/userService";
import { authDirective } from "./middleware/authDirective";

router.get("/login", ActionController.callAsync(UserService.login));
router.get("/afterLoginResponseToken", ActionController.callAsync(UserService.afterLoginResponseToken));
router.post("/refreshToken", ActionController.callAsync(UserService.refreshToken));

export default router;
