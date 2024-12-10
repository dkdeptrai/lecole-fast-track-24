import db from "../db.ts";

export const dbPromise = (query: string, params: any[]): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

export const dbRunPromise = (query: string, params: any[]): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
};
