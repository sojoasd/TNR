import express from "express";
const router = express.Router();
import { authDirective } from "./middleware/authDirective";
import ActionController from "./actionController";
import PhotoService from "../service/photoService";

router.get("/albums", authDirective, ActionController.callAsync(PhotoService.albums));
router.get("/importAlbum", authDirective, ActionController.callAsync(PhotoService.importAlbum));

export default router;
