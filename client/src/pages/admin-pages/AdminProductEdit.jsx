import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import privateAxios from "../../api/privateAxios";
import { toast } from "react-toastify";
import ProductForm from "../../components/AdminProductForm";
import LoadingScreen from "../../components/ui/LoadingScreen";
import ErrorState from "../../components/ui/ErrorState";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await privateAxios.get(`/products/${id}`);

      setProductData(data);
    } catch (err) {
      console.error(err);
      if (err?.code === "OFFLINE_ERROR" || err?.code === "NETWORK_ERROR") {
        setError(
          "Couldn't reach server?. Check your connection and try again."
        );
      } else if (err?.response?.status === 404) {
        setError("Product not found");
      } else {
        setError("Failed to load product data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update document title when product loads
  useDocumentTitle(productData ? `Edit ${productData?.name}` : "Edit Product");

  const handleUpdate = async (updatedData) => {
    try {
      await privateAxios.put(`/admin/product/${id}`, updatedData);
      toast.success("✅ Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      if (error?.code === "OFFLINE_ERROR") {
        toast.error("You are offline. Please check your internet connection.");
      } else if (error?.code === "NETWORK_ERROR") {
        toast.error("Network error. Please try again.");
      } else {
        toast.error("❌ Update failed!");
      }
      console.error(error);
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorState message={error} retry={fetchProduct} />;

  return (
    <div className="p-5">
      <ProductForm
        initialData={productData}
        onSubmit={handleUpdate}
        isEdit={true}
      />
    </div>
  );
};

export default EditProductPage;
