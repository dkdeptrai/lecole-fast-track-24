import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import { dbPromise, dbRunPromise } from "../helpers/dbHelper.ts";

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rows = await dbPromise("SELECT * FROM products", []);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, description, price, stock } = req.body;
  try {
    const result = await dbRunPromise(
      "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)",
      [name, description, price, stock]
    );

    const newProduct = await dbPromise("SELECT * FROM products WHERE id = ?", [
      result.lastID,
    ]);

    res.status(201).json({
      data: newProduct[0],
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
export const getProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const row = await dbPromise("SELECT * FROM products WHERE id = ?", [id]);
    if (!row || row.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(row[0]);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { id } = req.params;
  const { name, description, price, stock } = req.body;
  try {
    const result = await dbRunPromise(
      "UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?",
      [name, description, price, stock, id]
    );
    res.json({ data: { id: result.lastID } });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await dbRunPromise("DELETE FROM products WHERE id = ?", [
      id,
    ]);

    if (result.changes === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.json({ data: { id: result.lastID } });
    }
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
