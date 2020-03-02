import express from "express";
import cors from "cors";
const router = express.Router();
import ActionController from "./actionController";
import UserService from "../service/userService";

router.get("/login", cors(), ActionController.callAsync(UserService.login));
router.post("/login", cors(), ActionController.callAsync(UserService.afterLoginResponseToken));

export default router;
