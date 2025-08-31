import image from "../../assets/image.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import "./card.css";

// eslint-disable-next-line react/prop-types
const Card = ({ className, style }) => {
  return (
    <div
      className={`product-card bg-white border rounded-3 shadow-sm d-flex flex-column ${className}`}
      style={{ cursor: "pointer", ...style }}
    >
      {/* Image */}
      <div className="position-relative">
        <img src={image} className="w-100 object-fit-cover rounded-top-3" />
        {/* Example discount badge */}
        <span className="badge bg-danger position-absolute top-0 start-0 m-2">
          -20%
        </span>
      </div>

      {/* Info */}
      <div className="p-3 text-start d-flex flex-column flex-grow-1">
        <h6 className="text-muted mb-1">Backpack • Travel</h6>
        <h5 className="fw-bold mb-1">Stylish Backpack</h5>
        <p className="text-muted small mb-2">
          Durable, waterproof material with spacious design.
        </p>

        {/* Rating */}
        <div className="d-flex align-items-center mb-2">
          <StarIcon className="text-warning" fontSize="small" />
          <StarIcon className="text-warning" fontSize="small" />
          <StarIcon className="text-warning" fontSize="small" />
          <StarIcon className="text-warning" fontSize="small" />
          <StarIcon className="text-secondary" fontSize="small" />
          <span className="small text-muted ms-2">(120 reviews)</span>
        </div>

        {/* Price + Button */}
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <h5 className="text-danger fw-bold mb-0">$50.00</h5>
          <button className="btn btn-dark btn-sm">
            <ShoppingCartIcon fontSize="small" /> Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
