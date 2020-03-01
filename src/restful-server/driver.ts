import express from "express";
const router = express.Router();
import { authDirective } from "./middleware/authDirective";
import ActionController from "./actionController";
import DriverService from "../service/driverService";

router.get("/folders", authDirective, ActionController.callAsync(DriverService.folders));
router.get("/files", authDirective, ActionController.callAsync(DriverService.files));
router.post("/importFiles", authDirective, ActionController.callAsync(DriverService.importFiles));

export default router;
