import request from "supertest";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import app from "../index.ts";
import { initializeDatabase } from "../db.ts";
import db from "../db.ts";

describe("Products API", () => {
  const testProduct = {
    name: "Test Product",
    description: "Test Description",
    price: 19.99,
    stock: 10,
  };

  let createdProductId: number;

  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    await new Promise<void>((resolve, reject) => {
      db.run("DELETE FROM products", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  describe("POST /api/products", () => {
    it("should create a new product", async () => {
      const res = await request(app)
        .post("/api/products")
        .send(testProduct)
        .expect(201);

      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.name).toBe(testProduct.name);
      expect(res.body.data.description).toBe(testProduct.description);
      expect(res.body.data.price).toBe(testProduct.price);
      expect(res.body.data.stock).toBe(testProduct.stock);

      createdProductId = res.body.data.id;
    });

    it("should return 400 for invalid product data", async () => {
      const invalidProduct = {
        name: "", // Empty name
        description: "Test Description",
        price: -10, // Negative price
        stock: -5,
      };

      const res = await request(app)
        .post("/api/products")
        .send(invalidProduct)
        .expect(400);

      expect(res.body.errors).toBeDefined();
      expect(Array.isArray(res.body.errors)).toBe(true);
    });
  });

  describe("GET /api/products", () => {
    beforeEach(async () => {
      await new Promise<void>((resolve, reject) => {
        db.run(
          `
          INSERT INTO products (name, description, price, stock) 
          VALUES 
            ('Test Product 1', 'Description 1', 19.99, 10),
            ('Test Product 2', 'Description 2', 29.99, 20)
        `,
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    });

    it("should return a list of products", async () => {
      const res = await request(app).get("/api/products").expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("name");
      expect(res.body[0]).toHaveProperty("description");
      expect(res.body[0]).toHaveProperty("price");
      expect(res.body[0]).toHaveProperty("stock");
    });
  });

  describe("GET /api/products/:id", () => {
    let productId: number;

    beforeEach(async () => {
      // Insert before retrieving
      await new Promise<void>((resolve, reject) => {
        db.run(
          `INSERT INTO products (name, description, price, stock) 
           VALUES (?, ?, ?, ?)`,
          ["Specific Product", "Specific Description", 49.99, 15],
          function (err) {
            if (err) reject(err);
            else {
              productId = this.lastID;
              resolve();
            }
          }
        );
      });
    });

    it("should retrieve a specific product", async () => {
      const res = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(res.body.id).toBe(productId);
      expect(res.body.name).toBe("Specific Product");
      expect(res.body.description).toBe("Specific Description");
      expect(res.body.price).toBe(49.99);
      expect(res.body.stock).toBe(15);
    });

    it("should return 404 for non-existent product", async () => {
      await request(app).get("/api/products/9999").expect(404);
    });
  });

  describe("PUT /api/products/:id", () => {
    let productId: number;

    beforeEach(async () => {
      // Insert before update
      await new Promise<void>((resolve, reject) => {
        db.run(
          `INSERT INTO products (name, description, price, stock) 
           VALUES (?, ?, ?, ?)`,
          ["Original Product", "Original Description", 19.99, 10],
          function (err) {
            if (err) reject(err);
            else {
              productId = this.lastID;
              resolve();
            }
          }
        );
      });
    });

    it("should update an existing product", async () => {
      const updatedProduct = {
        name: "Updated Product",
        description: "Updated Description",
        price: 29.99,
        stock: 20,
      };

      const res = await request(app)
        .put(`/api/products/${productId}`)
        .send(updatedProduct)
        .expect(200);

      const verifyRes = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(verifyRes.body.name).toBe(updatedProduct.name);
      expect(verifyRes.body.description).toBe(updatedProduct.description);
      expect(verifyRes.body.price).toBe(updatedProduct.price);
      expect(verifyRes.body.stock).toBe(updatedProduct.stock);
    });

    it("should return 400 for invalid update data", async () => {
      const invalidUpdate = {
        name: "", // Empty name
        description: "Updated Description",
        price: -10, // Negative price
        stock: -5,
      };

      await request(app)
        .put(`/api/products/${productId}`)
        .send(invalidUpdate)
        .expect(400);
    });
  });

  describe("DELETE /api/products/:id", () => {
    let productId: number;

    beforeEach(async () => {
      // Insert before delete
      await new Promise<void>((resolve, reject) => {
        db.run(
          `INSERT INTO products (name, description, price, stock) 
           VALUES (?, ?, ?, ?)`,
          ["Product to Delete", "Deletion Description", 39.99, 5],
          function (err) {
            if (err) reject(err);
            else {
              productId = this.lastID;
              resolve();
            }
          }
        );
      });
    });

    it("should delete an existing product", async () => {
      await request(app).delete(`/api/products/${productId}`).expect(200);

      await request(app).get(`/api/products/${productId}`).expect(404);
    });

    it("should handle deleting non-existent product", async () => {
      await request(app).delete("/api/products/9999").expect(404);
    });
  });
});
