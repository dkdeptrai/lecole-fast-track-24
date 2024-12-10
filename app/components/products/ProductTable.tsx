import React from "react";
import { Product } from "~/lib/types";
import { Button } from "../ui/button";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  editingProductId: string | null;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onDelete,
  onEdit,
  editingProductId,
}) => {
  return (
    <div className="overflow-x-auto">
      {/* Add horizontal scrolling */}
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Price</th>
            <th className="border border-gray-300 px-4 py-2">Stock</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className={`hover:bg-gray-50 ${
                product.id === editingProductId ? "bg-yellow-100" : ""
              }`}
            >
              <td className="border border-gray-300 px-4 py-2">{product.id}</td>
              <td className="border border-gray-300 px-4 py-2">
                {product.name}
              </td>
              <td className="border border-gray-300 px-4 py-2 max-w-xs overflow-auto">
                {product.description}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                ${product.price.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {product.stock}
              </td>
              <td className="border border-gray-300 px-4 py-2 space-x-2">
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => onEdit(product.id)}
                    variant={"default"}
                  >
                    Edit
                  </Button>
                  <Button
                    variant={"destructive"}
                    onClick={() => onDelete(product.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
