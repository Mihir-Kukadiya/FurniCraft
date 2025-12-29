import express from "express";
import {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
} from "../controllers/addressController.js";

const router = express.Router();

router.get("/:email", getAddresses);
router.post("/", addAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

export default router;
