import axios from "axios";
import { Product } from "./types.ts";

const API_URL = "http://localhost:3000/api/products";

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addProduct = async (
  product: Omit<Product, "id">
): Promise<Product> => {
  const response = await axios.post(API_URL, product);
  return response.data;
};

export const updateProduct = async (
  id: string,
  product: Omit<Product, "id">
): Promise<Product> => {
  const response = await axios.put(`${API_URL}/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
