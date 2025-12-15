import { ShoppingCart as ShoppingCartIcon } from "lucide-react";
import StarRating from "../../components/ui/StarRating";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import {
  Modal,
  Button,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import CartContext from "../../context/CartContext";
import { toast } from "react-toastify";
import AuthContext from "../../context/AuthContext";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import Image from "../../components/ui/Image";

/* eslint-disable react/prop-types */
const Card = ({ product, className, style }) => {
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [adding, setAdding] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  if (!product) return null;

  // calculate discount price if exists
  const discountedPrice = product.discount
    ? (product.price - product.price * (product.discount / 100)).toFixed(2)
    : product.price.toFixed(2);

  const handleAddToCart = async () => {
    if (!user) {
      toast.info("Please login first");
      return navigate("/login");
    }
    if (!selectedSize) return toast.error("Please select a size");
    try {
      setAdding(true);
      await addToCart({
        productId: product._id,
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

  return (
    <div
      className={`bg-white border rounded-3 shadow-sm d-flex flex-column mb-4 mb-sm-0 ${className}`}
      style={{ cursor: "pointer", ...style }}
      onClick={() => navigate(`/products/${product._id}`)}
    >
      {/* Image */}
      <div className="position-relative">
        <Image
          src={product.image}
          alt={product.name}
          className="w-100 rounded-top-3"
          style={{ height: "350px" }}
        />

        {product.discount > 0 && (
          <span className="badge bg-danger position-absolute top-0 start-0 m-2">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 text-start d-flex flex-column flex-grow-1">
        <h6 className="text-muted mb-1">{product.brand || "No Brand"}</h6>
        <h5 className="fw-bold mb-1">{product.name}</h5>
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>{product.description}</Tooltip>}
        >
          <p className="text-muted small mb-2" style={{ cursor: "pointer" }}>
            {product.description.split(" ").slice(0, 10).join(" ") +
              (product.description.split(" ").length > 10 ? "..." : "")}
          </p>
        </OverlayTrigger>

        {/* Rating */}
        <div className="d-flex align-items-center mb-2">
          {product.reviews?.length > 0 ? (
            <StarRating
              rating={
                product.reviews?.length > 0
                  ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                    product.reviews.length
                  : 0
              }
            />
          ) : (
            <StarRating />
          )}

          <span className="small text-muted ms-2" style={{ paddingTop: "2px" }}>
            ({product.reviews?.length || 0} reviews)
          </span>
        </div>

        {/* Price + Button */}
        <div className="mt-auto d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="text-danger fw-bold mb-0">
            ${discountedPrice}
            {product.discount > 0 && (
              <small className="text-muted ms-1 text-decoration-line-through">
                ${product.price.toFixed(2)}
              </small>
            )}
          </h5>
          {/* stopPropagation so button click won’t trigger card navigation */}
          <div
            className={`btn-wrapper ms-auto ${!isOnline ? "disabled" : ""}`}
            onClick={(e) => {
              e.stopPropagation(); // always stops the card click
              if (!isOnline) return; // prevent modal open
              setShowModal(true);
            }}
          >
            <button
              className="btn btn-dark btn-sm d-flex align-items-center gap-2"
              disabled={product.stock === 0}
            >
              <ShoppingCartIcon size={18} /> Add to Cart
            </button>
          </div>

          {/* Size selection modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <div onClick={(e) => e.stopPropagation()}>
              <Modal.Header closeButton>
                <Modal.Title>Select Size</Modal.Title>
              </Modal.Header>
              <Modal.Body className="d-flex flex-wrap gap-2 justify-content-center">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={
                      selectedSize === size ? "dark" : "outline-secondary"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                  >
                    {size}
                  </Button>
                ))}
              </Modal.Body>
              <Modal.Footer className="d-flex flex-wrap gap-2 justify-content-center">
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  disabled={adding}
                >
                  Cancel
                </Button>
                <Button
                  variant="dark"
                  onClick={handleAddToCart}
                  disabled={adding || !isOnline || product.stock === 0}
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
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Card;
