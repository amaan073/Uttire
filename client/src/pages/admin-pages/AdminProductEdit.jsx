import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import privateAxios from "../../api/privateAxios";
import { toast } from "react-toastify";
import ProductForm from "../../components/AdminProductForm";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await privateAxios.get(`/api/products/${id}`);
        setProductData(data);
      } catch (err) {
        toast.error("❌ Failed to load product");
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdate = async (updatedData) => {
    try {
      await privateAxios.put(`/api/products/${id}`, updatedData);
      toast.success("✅ Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      toast.error("❌ Update failed!");
      console.error(error);
    }
  };

  if (!productData) return <p>Loading...</p>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
      <ProductForm
        initialData={productData}
        onSubmit={handleUpdate}
        isEdit={true}
      />
    </div>
  );
};

export default EditProductPage;
