import express from "express";
const router = express.Router();
import ActionController from "./actionController";
import UserService from "../service/userService";

router.get("/login", ActionController.callAsync(UserService.login));
router.post("/login", ActionController.callAsync(UserService.afterLoginResponseToken));

export default router;
