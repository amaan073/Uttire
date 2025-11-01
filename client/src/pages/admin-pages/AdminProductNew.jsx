import { useNavigate } from "react-router-dom";
import privateAxios from "../../api/privateAxios";
import { toast } from "react-toastify";
import ProductForm from "../../components/AdminProductForm";

const AddProductPage = () => {
  const navigate = useNavigate();

  const handleAddProduct = async (data) => {
    try {
      const res = await privateAxios.post("/admin/products", data);
      console.log(res.data);
      toast.success("✅ Product added successfully!");
      navigate("/admin/products");
    } catch (error) {
      toast.error("❌ Failed to add product!");
      console.error(error);
      throw error;
    }
  };

  return (
    <div className="p-5">
      <ProductForm onSubmit={handleAddProduct} />
    </div>
  );
};

export default AddProductPage;
