import image from "../../assets/image.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "./card.css";

const Card = () => {
  return (
    <div
      className="product-card bg-white border d-flex d-sm-block text-start text-sm-center mb-4 mb-sm-0"
      style={{ cursor: "pointer" }}
    >
      <div style={{ flex: "0.9" }}>
        <img src={image} className="w-100 h-100 object-fit-cover" />
      </div>
      <div className="p-3" style={{ flex: "1" }}>
        <h5 className="fw-bold">Stylish Backpack</h5>
        <h5 className="text-danger fst-italic">$50.00</h5>
        <button className="btn btn-outline-dark mb-2">
          <ShoppingCartIcon /> Add to cart
        </button>
      </div>
    </div>
  );
};

export default Card;
