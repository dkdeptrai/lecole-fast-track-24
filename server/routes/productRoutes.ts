// server/routes/productRoutes.ts
import { Router } from "express";
import {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController.ts";
import {
  validateProductQuery,
  validateProductForm,
} from "../validations/productValidation.ts";

const router = Router();

router.post("/", validateProductForm, createProduct);
router.get("/", validateProductQuery, getProducts);
router.get("/:id", getProduct);
router.put("/:id", validateProductForm, updateProduct);
router.delete("/:id", deleteProduct);

export default router;
