import express from "express";
const router = express.Router();
import ActionController from "./actionController";
import UserService from "../service/userService";

router.post("/account/register", ActionController.callAsync(UserService.register));
router.post("/account/login", ActionController.callAsync(UserService.login));

export default router;