import React, { useState, useEffect } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../lib/productService.ts";
import { Product } from "../../lib/types.ts";
import ProductTable from "./ProductTable.tsx";
import { Button } from "../ui/Button.tsx";
import ProductForm from "./ProductForm.tsx";
import Alert from "../shared/Alert.tsx";

const ProductDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    stock: 0,
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

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
      setPaginationModel((prev) => ({
        ...prev,
        totalCount: data.totalCount,
        totalPages: data.totalPages,
      }));
      setProducts(data.products);
    } catch (error: any) {
      // Extract error messages from the response
      const errorMessages = error?.response?.data?.errors?.map(
        (err: any) => err.msg
      ) || ["Error fetching products."];
      showAlert(errorMessages, "error");
    }
  };

  const handleSave = async () => {
    try {
      if (editingProductId) {
        await updateProduct(editingProductId, newProduct);
        showAlert(["Product updated successfully!"], "success");
      } else {
        await addProduct(newProduct);
        showAlert(["Product added successfully!"], "success");
      }
      resetForm();
      fetchProducts();
    } catch (error: any) {
      const errorMessages = error?.response?.data?.errors?.map(
        (err: any) => err.msg
      ) || ["Error saving product."];
      showAlert(errorMessages, "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        showAlert(["Product deleted successfully!"], "success");
        fetchProducts();
      } catch (error: any) {
        const errorMessages = error?.response?.data?.errors?.map(
          (err: any) => err.msg
        ) || ["Error deleting product."];
        showAlert(errorMessages, "error");
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const showAlert = (messages: string[], type: "error" | "success") => {
    setAlert({ message: messages.join(", "), type });
    setTimeout(() => setAlert(null), 10000);
  };

  const resetForm = () => {
    setNewProduct({
      id: "",
      name: "",
      description: "",
      price: 0,
      stock: 0,
    });
    setEditingProductId(null);
  };

  const handleEdit = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setNewProduct(product);
      setEditingProductId(id);
      window.scrollTo(0, 0);
    }
  };

  const handleMassDelete = async (ids: string[]) => {
    if (window.confirm("Are you sure you want to delete these products?")) {
      await Promise.all(ids.map((id) => deleteProduct(id)));
      setSelectedProductIds([]);
      fetchProducts();
    }
  };

  const handleCancel = () => {
    setNewProduct({ id: "", name: "", description: "", price: 0, stock: 0 });
    setEditingProductId(null);
  };
  const handlePaginationChange = (page: number) =>
    setPaginationModel((prev) => ({ ...prev, page }));

  return (
    <div className="p-6">
      {alert && <Alert message={alert.message} type={alert.type} />}

      <h1 className="text-2xl font-bold mb-4">Product Dashboard</h1>

      <ProductForm
        newProduct={newProduct}
        handleChange={handleChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        editingProductId={editingProductId}
      />

      <ProductTable
        products={products}
        onDelete={handleDelete}
        onEdit={handleEdit}
        setSelectedProductIds={setSelectedProductIds}
        selectedProductIds={selectedProductIds}
        onMassDelete={handleMassDelete}
        editingProductId={editingProductId}
      />

      {/* Pagination Controls */}
      <div className="mt-6 mx-auto w-fit flex gap-8 justify-between items-center">
        <Button
          variant={"default"}
          disabled={paginationModel.page <= 1}
          onClick={() => handlePaginationChange(paginationModel.page - 1)}
        >
          Previous
        </Button>
        <span>
          Page {paginationModel.page} of {paginationModel.totalPages}
        </span>
        <Button
          variant={"default"}
          disabled={paginationModel.page >= paginationModel.totalPages}
          onClick={() => handlePaginationChange(paginationModel.page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProductDashboard;
