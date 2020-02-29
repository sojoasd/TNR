import express from "express";
const router = express.Router();
import { authDirective } from "./middleware/authDirective";
import ActionController from "./actionController";
import PhotoService from "../service/photoService";

router.get("/albums", authDirective, ActionController.callAsync(PhotoService.albums));

export default router;
