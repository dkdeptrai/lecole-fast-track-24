import React from "react";
import { Product } from "~/lib/types";
import { Button } from "../ui/Button";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onMassDelete: (ids: string[]) => void;
  editingProductId: string | null;
  selectedProductIds: string[];
  setSelectedProductIds: (ids: string[]) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onDelete,
  onEdit,
  onMassDelete,
  editingProductId,
  selectedProductIds,
  setSelectedProductIds,
}) => {
  const handleCheckboxChange = (id: string) => {
    setSelectedProductIds(
      selectedProductIds.includes(id)
        ? selectedProductIds.filter((selectedId) => selectedId !== id)
        : [...selectedProductIds, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedProductIds.length === products.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(products.map((product) => product.id));
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-2">
        <Button
          variant="destructive"
          onClick={() => onMassDelete(selectedProductIds)}
          disabled={selectedProductIds.length === 0}
        >
          Delete Selected
        </Button>
      </div>

      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-2 py-2 text-left w-8">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedProductIds.length === products.length}
                />
              </div>
            </th>
            <th className="border border-gray-300 px-2 py-2 text-left w-16">
              ID
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Description
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Price
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Stock
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Actions
            </th>
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
              <td
                className="border border-gray-300 px-2 py-2 w-8 cursor-pointer"
                onClick={() => handleCheckboxChange(product.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedProductIds.includes(product.id)}
                  onChange={() => handleCheckboxChange(product.id)}
                  className="pointer-events-none"
                />
              </td>
              <td className="border border-gray-300 px-2 py-2 w-16">
                {product.id}
              </td>
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
                  <Button onClick={() => onEdit(product.id)} variant="default">
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
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
