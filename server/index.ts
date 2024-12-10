import express from "express";
import cors from "cors";
import { initializeDatabase } from "./db.ts";
import productRoutes from "./routes/productRoutes.ts";
import { seedDatabase } from "./seeds.ts";

const app = express();
const port = 3000;

initializeDatabase()
  .then(() => {
    console.log("Database initialized successfully.");

    app.use(express.json());

    app.use(cors());

    app.use("/api/products", productRoutes);

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize the database:", err);
  });

export default app;
