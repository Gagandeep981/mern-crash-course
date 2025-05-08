import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", upload.single("image"), createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
