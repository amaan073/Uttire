import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";

/* eslint-disable react/prop-types */
const Card = ({ product, className, style }) => {
  if (!product) return null;

  // calculate discount price if exists
  const discountedPrice = product.discount
    ? (product.price - product.price * (product.discount / 100)).toFixed(2)
    : product.price.toFixed(2);

  return (
    <div
      className={`bg-white border rounded-3 shadow-sm d-flex flex-column mb-4 mb-sm-0 ${className}`}
      style={{ cursor: "pointer", ...style }}
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
          <button className="btn btn-dark btn-sm ms-auto">
            <ShoppingCartIcon fontSize="small" /> Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
