import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename: string =
  typeof import.meta !== "undefined"
    ? fileURLToPath(import.meta.url)
    : (global as any).__filename || "";

const __dirname: string = path.dirname(__filename);

let dbPath = path.resolve(__dirname, "../database/development.db");
const env = process.env.NODE_ENV || "development";

dbPath = path.resolve(__dirname, `../database/${env}.db`);

const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error("Unable to open database", err.message);
    } else {
      console.log(`Connected to the SQLite database at ${dbPath}`);
    }
  }
);

export const initializeDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          price REAL NOT NULL,
          stock INTEGER NOT NULL
        )
      `,
        (err) => {
          if (err) {
            reject(`Error creating table: ${err.message}`);
          } else {
            resolve();
          }
        }
      );
    });
  });
};

export default db;
