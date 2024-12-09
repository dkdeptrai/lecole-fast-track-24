// server/routes/productRoutes.ts
import { Router } from "express";
import {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController.ts";
import { validateProduct } from "../validations/productValidation.ts";

const router = Router();

router.post("/", validateProduct, createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", validateProduct, updateProduct);
router.delete("/:id", deleteProduct);

export default router;
