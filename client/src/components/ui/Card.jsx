import image from "../../assets/image.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Card = () => {
  return (
    <div className="bg-white border">
      <img
        src={image}
        className="w-100 object-fit-cover"
        style={{ aspectRatio: "1 / 0.8" }}
      />
      <div className="p-3">
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
