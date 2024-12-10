import React, { useState, useEffect } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../lib/productService.ts";
import { Product } from "../../lib/types.ts";
import ProductTable from "./ProductTable.tsx";
import { TextField } from "~/components/ui/TextField";

const ProductDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, [paginationModel.page]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts(
        paginationModel.page,
        paginationModel.pageSize
      );

      setPaginationModel({
        ...paginationModel,
        totalCount: data.totalCount,
        totalPages: data.totalPages,
      });
      setProducts(data.products);
    } catch (error: any) {
      setError(error?.response?.data?.error || "Error fetching products.");
      setSuccess(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setError(null);

      if (editingProductId) {
        await updateProduct(editingProductId, newProduct);
        setSuccess("Product updated successfully!");
      } else {
        await addProduct(newProduct);
        setSuccess("Product added successfully!");
      }

      setNewProduct({ name: "", description: "", price: 0, stock: 0 });
      setEditingProductId(null);
      fetchProducts();
    } catch (error: any) {
      if (error?.response?.data?.errors) {
        const validationMessages = error.response.data.errors
          .map((err: { msg: string }) => err.msg)
          .join(", ");
        setError(validationMessages);
      } else {
        setError(error?.response?.data?.error || "Error saving product.");
      }
      setSuccess(null);
    }
  };

  const handleEdit = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setNewProduct({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      });
      setEditingProductId(id);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this product?")) {
        await deleteProduct(id);
        setSuccess("Product deleted successfully!");
        fetchProducts();
      }
    } catch (error: any) {
      setError(error?.response?.data?.error || "Error deleting product.");
      setSuccess(null);
    }
  };

  const handleCancel = () => {
    setNewProduct({ name: "", description: "", price: 0, stock: 0 });
    setEditingProductId(null);
    setError(null);
    setSuccess(null);
  };

  const handlePaginationChange = (page: number) => {
    setPaginationModel((prev) => ({ ...prev, page }));
  };

  return (
    <div className="p-6">
      {/* Error and Success Messages */}
      {(error || success) && (
        <div
          className={`p-4 mb-4 rounded-md ${
            error ? "bg-red-200 text-red-700" : "bg-green-200 text-green-700"
          }`}
        >
          {error || success}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Product Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          {editingProductId ? "Edit Product" : "Add New Product"}
        </h2>
        <TextField
          label="Product ID"
          name="id"
          disabled={true}
          value={editingProductId || ""}
          onChange={handleChange}
          placeholder="Product ID"
        />
        <TextField
          label="Product Name"
          name="name"
          value={newProduct.name}
          onChange={handleChange}
          placeholder="Product Name"
        />
        <TextField
          label="Product Description"
          name="description"
          value={newProduct.description}
          onChange={handleChange}
          placeholder="Product Description"
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={newProduct.price}
          onChange={handleChange}
          placeholder="Price"
        />
        <TextField
          label="Stock"
          name="stock"
          type="number"
          value={newProduct.stock}
          onChange={handleChange}
          placeholder="Stock"
        />
        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white p-2 rounded"
          >
            {editingProductId ? "Update Product" : "Add Product"}
          </button>
          {editingProductId && (
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <ProductTable
          products={products}
          onDelete={handleDelete}
          onEdit={handleEdit}
          editingProductId={editingProductId}
        />
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-between items-center">
        <button
          disabled={paginationModel.page <= 1}
          onClick={() => handlePaginationChange(paginationModel.page - 1)}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Previous
        </button>
        <span>
          Page {paginationModel.page} of {paginationModel.totalPages}
        </span>
        <button
          disabled={paginationModel.page >= paginationModel.totalPages}
          onClick={() => handlePaginationChange(paginationModel.page + 1)}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductDashboard;
