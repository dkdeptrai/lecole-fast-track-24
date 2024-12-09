import db from "./db.ts";

// Sample data to seed
const seedData = [
  { name: "Test Product", description: "Test", price: 10, stock: 100 },
  { name: "Test Product 2", description: "Test 2", price: 20, stock: 200 },
  { name: "Test Product 3", description: "Test 3", price: 30, stock: 300 },
];

export const seedTestDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      db.run("DELETE FROM products");

      db.run("DELETE FROM sqlite_sequence WHERE name = 'products'");

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

      stmt.finalize((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};
