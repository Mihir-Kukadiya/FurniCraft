import express from "express";
import {
  adminLogin,
  updateAdminProfile,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", adminLogin);
router.put("/update", updateAdminProfile);

export default router;
