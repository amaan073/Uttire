import { ShoppingCart as ShoppingCartIcon } from "lucide-react";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import CartContext from "../../context/CartContext";
import { toast } from "react-toastify";
import AuthContext from "../../context/AuthContext";

/* eslint-disable react/prop-types */
const Card = ({ product, className, style }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

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
      await addToCart({
        productId: product._id,
        size: selectedSize,
        quantity: 1,
      });
      setShowModal(false);
      setSelectedSize("");
    } catch (err) {
      console.error(err);
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
        <img
          src={"http://localhost:5000/public" + product.image}
          alt={product.name}
          className="w-100 object-fit-cover rounded-top-3"
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
        <p className="text-muted small mb-2">{product.description}</p>

        {/* Rating */}
        <div className="d-flex align-items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={i < 4 ? "text-warning" : "text-secondary"}
              fontSize="small"
            />
          ))}
          <span className="small text-muted ms-2">
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
          <button
            className="btn btn-dark btn-sm ms-auto d-flex align-align-items-center gap-2 "
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
          >
            <ShoppingCartIcon size={18} /> Add to cart
          </button>
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
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="dark" onClick={handleAddToCart}>
                  Add to Cart
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
