import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import privateAxios from "../../api/privateAxios";
import { toast } from "react-toastify";
import ProductForm from "../../components/AdminProductForm";
import { Button, Spinner } from "react-bootstrap";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await privateAxios.get(`/products/${id}`);
        setProductData(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Product not found");
        } else {
          setError("Failed to load product");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Update document title when product loads
  useDocumentTitle(
    productData ? `Edit ${productData.name}` : "Edit Product"
  );

  const handleUpdate = async (updatedData) => {
    try {
      await privateAxios.put(`/admin/product/${id}`, updatedData);
      toast.success("✅ Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      toast.error("❌ Update failed!");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
        style={{ marginTop: "-83px" }}
      >
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" variant="primary" role="status" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
        style={{ marginTop: "-83px" }}
      >
        <i
          className="bi bi-exclamation-triangle text-danger mb-3"
          style={{ fontSize: "3rem" }}
        ></i>
        <p className="text-danger fw-bold mb-3">{error}</p>
        <Button onClick={() => window.location.reload()} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  if (!productData) {
    return (
      <div
        className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
        style={{ marginTop: "-83px" }}
      >
        <h4 className="text-muted mb-4">⚠️ Product not found</h4>
        <Button onClick={() => navigate("/admin/products")} variant="secondary">
          Back to Products
        </Button>
      </div>
    );
  }

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
