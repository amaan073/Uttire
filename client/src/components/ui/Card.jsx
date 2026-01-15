import { ShoppingCart as ShoppingCartIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import CartContext from "../../context/CartContext";
import { toast } from "react-toastify";
import AuthContext from "../../context/AuthContext";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import Image from "../../components/ui/Image";
import OfflineNote from "./OfflineNote";

/* eslint-disable react/prop-types */
const Card = ({ product, className, style }) => {
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [adding, setAdding] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState(""); // Error state for size validation

  if (!product) return null;

  // calculate discount price if exists
  const discountedPrice = product?.discount
    ? (product?.price - product?.price * (product?.discount / 100)).toFixed(2)
    : product?.price.toFixed(2);

  const handleAddToCart = async () => {
    if (!user) {
      toast.info("Please login first");
      return navigate("/login");
    }
    if (!selectedSize) {
      setSizeError("Please select a size");
      return;
    }
    try {
      setAdding(true);
      await addToCart({
        productId: product?._id,
        size: selectedSize,
        quantity: 1,
      });
      setShowModal(false);
      setSelectedSize("");
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setAdding(false);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeError(""); // Clear error when user selects a size
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedSize("");
    setSizeError(""); // Clear error when modal closes
  };

  return (
    <>
      <div
        className={`bg-white border rounded-3 shadow-sm d-flex flex-column mb-4 mb-sm-0 ${className}`}
        style={{ cursor: "pointer", ...style }}
        onClick={() => navigate(`/products/${product._id}`)}
      >
        {/* Image */}
        <div className="position-relative">
          <Image
            src={product?.image}
            alt={product?.name}
            className="w-100 rounded-top-3"
            style={{ aspectRatio: "1/1", backgroundColor: "#dcdcdc" }}
          />

          {product?.discount > 0 && (
            <span
              className="badge bg-danger position-absolute top-0 start-0 m-2"
              style={{ fontSize: "0.875rem" }}
            >
              -{product?.discount}%
            </span>
          )}
          {/* Rating Badge  */}
          {product?.reviews?.length > 0 && (
            <div
              className="badge position-absolute top-0 end-0 m-2 border border-1"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(8px)",
                fontSize: "0.875rem",
                height: "23px",
              }}
            >
              <span className="text-warning" style={{ marginRight: "2px" }}>
                ★
              </span>
              <span className="fw-semibold text-black">
                {(
                  product?.reviews?.reduce((sum, r) => sum + r.rating, 0) /
                  product?.reviews?.length
                ).toFixed(1)}
              </span>
              <span className="ms-1 text-muted fw-normal">
                ({product?.reviews?.length})
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-card-info p-3 text-start d-flex flex-column flex-grow-1">
          {/* Brand/Name on Left, Price on Right */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="flex-grow-1 pe-3 mb-1">
              <p
                className="text-uppercase text-muted small mb-1 fw-semibold"
                style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}
              >
                {product?.brand || "No Brand"}
              </p>
              <h5
                className="fw-semibold mb-0 lh-sm break-word"
                style={{ fontSize: "1rem" }}
              >
                {product?.name}
              </h5>
            </div>

            <div className="text-end" style={{ minWidth: "fit-content" }}>
              <h4
                className="text-danger fw-bold mb-0"
                style={{ fontSize: "1.1rem", whiteSpace: "nowrap" }}
              >
                ${discountedPrice}
              </h4>
              {product?.discount > 0 && (
                <span
                  className="text-muted text-decoration-line-through d-block"
                  style={{ fontSize: "0.875rem", paddingRight: "3px" }}
                >
                  ${product?.price?.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Add to cart Button*/}
          <div className="mt-auto">
            {/* Add to Cart Button at Bottom */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
            >
              <button
                className="btn btn-dark w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                disabled={!isOnline}
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                <ShoppingCartIcon size={18} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Size selection modal */}
      <Modal
        show={showModal}
        onHide={handleModalClose}
        centered
        backdrop={adding ? "static" : true}
        keyboard={!adding}
      >
        <Modal.Header closeButton={!adding}>
          <Modal.Title>Select Size</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className={`d-flex flex-wrap gap-2 justify-content-center ${sizeError ? "is-invalid" : ""}`}
          >
            {product?.sizes?.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "dark" : "outline-secondary"}
                onClick={() => handleSizeSelect(size)}
                disabled={adding}
                className={
                  sizeError && !selectedSize ? "border-danger text-danger" : ""
                }
              >
                {size}
              </Button>
            ))}
          </div>
          {sizeError && (
            <div className="text-danger small text-center">{sizeError}</div>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex flex-wrap gap-2 justify-content-center">
          <Button
            variant="secondary"
            onClick={handleModalClose}
            disabled={adding}
          >
            Cancel
          </Button>
          <Button
            variant="dark"
            onClick={handleAddToCart}
            disabled={adding || !isOnline || product?.stock === 0}
          >
            {adding ? (
              <>
                <Spinner animation="border" size="sm" /> Adding...
              </>
            ) : (
              "Add to Cart"
            )}
          </Button>
        </Modal.Footer>
        {product?.stock === 0 ? (
          <div className="text-center text-danger fw-bold">Out of stock</div>
        ) : (
          <OfflineNote isOnline={isOnline} className="text-center" />
        )}
      </Modal>
    </>
  );
};

export default Card;
