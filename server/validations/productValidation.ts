import { body, query } from "express-validator";

export const validateProductForm = [
  body("name").notEmpty().withMessage("Name is required"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
];

export const validateProductQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Invalid pagination parameters."),
  query("pageSize")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Invalid pagination parameters."),
];
