// ✅ DirectCheckout.jsx
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../../../context/AuthContext";
import CheckoutForm from "../../../components/CheckoutForm";

const DirectCheckout = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // logged-in user info
  const { id } = useParams(); // productId from URL
  const location = useLocation();

  // ✅ product info passed via state from Buy Now
  const {
    name,
    image,
    size,
    quantity,
    price,
    discount = 0,
  } = location.state || {};

  // Pre-fill form with user info
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    paymentMethod: "debitCard",
    delivery: "standard",
  });

  // Guard: if state is missing
  if (!name || !image || !size || !quantity || !price) {
    return (
      <div
        className="container py-5 text-center d-flex justify-content-center align-items-center"
        style={{ height: "calc(100vh - 83px)" }}
      >
        <div>
          <h3>Invalid checkout request</h3>
          <p>Please go back and try again.</p>
        </div>
      </div>
    );
  }

  // --- Price calculations ---
  const originalTotal = price * quantity;
  const discountedPrice = price - (price * discount) / 100;
  const itemTotal = discountedPrice * quantity;
  const savings = originalTotal - itemTotal;
  // --- Shipping calculations ---
  const BASE_SHIPPING = 5;
  const EXPRESS_FEE = 5;

  const shippingCost =
    formData.delivery === "express"
      ? BASE_SHIPPING + EXPRESS_FEE
      : BASE_SHIPPING;

  const total = itemTotal + shippingCost;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // // ✅ Clean order payload
    // const orderData = {
    //   userId: user._id,
    //   items: [
    //     {
    //       productId: id,
    //       size,
    //       quantity,
    //     },
    //   ],
    //   shipping: {
    //     name: formData.name,
    //     email: formData.email,
    //     address: formData.address,
    //     city: formData.city,
    //     state: formData.state,
    //     zip: formData.zip,
    //     phone: formData.phone,
    //   },
    //   paymentMethod: formData.paymentMethod,
    //   delivery: formData.delivery,
    // };

    // console.log("Placing order:", orderData);
    // // TODO: call API -> privateAxios.post("/orders", orderData)
    // navigate("/order-success");
  };

  return (
    <div className="container py-5" style={{ maxWidth: "1200px" }}>
      <h1 className="fw-bold mb-5 text-center">Checkout</h1>
      <div className="row g-4">
        {/* --- LEFT: Form --- */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm p-4">
            <CheckoutForm
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        {/* --- RIGHT: Order Summary --- */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm p-4">
            <h4 className="fw-semibold mb-4">Order Summary</h4>

            {/* Single Product */}
            <div className="d-flex mb-3 align-items-center border-bottom pb-3">
              <img
                src={`http://localhost:5000/public${image}`}
                alt={name}
                className="rounded cursor-pointer"
                width="70"
                height="70"
                onClick={() => navigate(`/products/${id}`)}
              />
              <div className="ms-3 me-auto pe-4">
                <p className="mb-1 fw-semibold">{name}</p>
                <p className="mb-1 small">Size: {size}</p>
                <p className="mb-1 small">Qty: {quantity}</p>
              </div>
              <p className="fw-bold text-success mb-0 fs-6">
                ${itemTotal.toFixed(2)}
              </p>
            </div>

            {/* Price Summary */}
            <div className="d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <span>+${shippingCost}</span>
            </div>
            {savings > 0 && (
              <div className="d-flex justify-content-between text-success mb-3">
                <span>You saved</span>
                <span>${savings.toFixed(2)}</span>
              </div>
            )}
            <hr className="hr" />
            <div className="d-flex justify-content-between fw-bold fs-4 mt-3">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectCheckout;
