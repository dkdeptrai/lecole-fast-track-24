import express from "express";
import sqlite3 from "sqlite3";
import { body, validatorResult } from "express-validator";

const app = express();
const port = 3000;

const db = new sqlite3.Database("./database/products.db", (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock INTEGER NOT NULL
    )
  `);
});

const seedData = [
  {
    name: "Product A",
    description: "Description of Product A",
    price: 19.99,
    stock: 100,
  },
  {
    name: "Product B",
    description: "Description of Product B",
    price: 29.99,
    stock: 150,
  },
  {
    name: "Product C",
    description: "Description of Product C",
    price: 9.99,
    stock: 200,
  },
  {
    name: "Product D",
    description: "Description of Product D",
    price: 49.99,
    stock: 80,
  },
  {
    name: "Product E",
    description: "Description of Product E",
    price: 24.99,
    stock: 50,
  },
];

db.serialize(() => {
  db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
    if (row?.count === 0) {
      const stmt = db.prepare(
        "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)"
      );
      for (const product of seedData) {
        stmt.run(
          product.name,
          product.description,
          product.price,
          product.stock
        );
      }
      stmt.finalize();
      console.log("Database seeded with dummy data");
    }
  });
});

app.use(express.json());

// GET all products
app.get("/api/product", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// POST a new product
app.post(
  "/api/product",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number"),
    body("stock")
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, stock } = req.body;
    const stmt = db.prepare(
      "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)"
    );
    stmt.run([name, description, price, stock], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ data: { id: this.lastID } });
      stmt.finalize();
    });
  }
);

// PUT to update a product
app.put(
  "/api/product/:id",
  [
    param("id").isInt().withMessage("ID must be an integer"),
    body("name").notEmpty().withMessage("Name is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number"),
    body("stock")
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    const stmt = db.prepare(
      "UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?"
    );
    stmt.run([name, description, price, stock, id], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        status: "success",
        message: `Product with ID ${id} updated successfully.`,
      });
      stmt.finalize();
    });
  }
);

// DELETE a product
app.delete(
  "/api/product/:id",
  [param("id").isInt().withMessage("ID must be an integer")],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const stmt = db.prepare("DELETE FROM products WHERE id = ?");
    stmt.run(id, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        status: "success",
        message: `Product with ID ${id} deleted successfully.`,
      });
      stmt.finalize();
    });
  }
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
yarn;
