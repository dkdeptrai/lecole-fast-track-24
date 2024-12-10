import { Product } from "~/lib/types.ts";
import { Button } from "../ui/Button.tsx";
import { TextField } from "../ui/TextField.tsx";

interface ProductFormProps {
  newProduct: Product;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSave: () => void;
  handleCancel: () => void;
  editingProductId: string | null;
}

const ProductForm: React.FC<ProductFormProps> = (props: ProductFormProps) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2">
      {props.editingProductId ? "Edit Product" : "Add New Product"}
    </h2>
    <TextField
      label="Product ID"
      name="id"
      disabled
      value={props.editingProductId || ""}
    />
    <TextField
      label="Product Name"
      name="name"
      value={props.newProduct.name}
      onChange={props.handleChange}
    />
    <TextField
      label="Product Description"
      name="description"
      value={props.newProduct.description}
      onChange={props.handleChange}
    />
    <TextField
      label="Price"
      name="price"
      type="number"
      value={props.newProduct.price}
      onChange={props.handleChange}
    />
    <TextField
      label="Stock"
      name="stock"
      type="number"
      value={props.newProduct.stock}
      onChange={props.handleChange}
    />
    <div className="flex space-x-4 mt-4">
      <Button variant="default" onClick={props.handleSave}>
        {props.editingProductId ? "Update Product" : "Add Product"}
      </Button>
      {props.editingProductId && (
        <Button variant="default" onClick={props.handleCancel}>
          Cancel
        </Button>
      )}
    </div>
  </div>
);

export default ProductForm;
