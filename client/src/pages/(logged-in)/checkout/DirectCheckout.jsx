// ✅ DirectCheckout.jsx
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CheckoutForm from "../../../components/CheckoutForm";
import { useState } from "react";
import Image from "../../../components/ui/Image";

const DirectCheckout = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // productId from URL
  const location = useLocation();
  // Shipping state (controlled by CheckoutForm)
  const [delivery, setDelivery] = useState("standard");

  if (!location.state) return null; // for flickering issues

  // ✅ product info passed via state from Buy Now
  const {
    name,
    image,
    size,
    quantity,
    price,
    discount = 0,
  } = location.state || {};

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
  // ✅ shipping fee based on delivery type
  const shippingCost = delivery === "express" ? 10 : 5;

  const total = itemTotal + shippingCost;

  return (
    <div className="container py-5" style={{ maxWidth: "1200px" }}>
      <h1 className="fw-bold mb-5 text-center">Checkout</h1>
      <div className="row g-4">
        {/* --- LEFT: Form --- */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm p-4">
            <CheckoutForm
              items={[
                {
                  productId: id,
                  name,
                  image,
                  size,
                  quantity,
                  price,
                  discount,
                },
              ]}
              checkoutType="direct"
              setDelivery={setDelivery}
              onOrderSuccess={(orderId) =>
                navigate(`/checkout/success/${orderId}`, { replace: true })
              }
            />
          </div>
        </div>

        {/* --- RIGHT: Order Summary --- */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm p-4">
            <h4 className="fw-semibold mb-4">Order Summary</h4>

            {/* Single Product */}
            <div
              className="d-flex mb-3 align-items-center border-bottom pb-3  cursor-pointer"
              onClick={() => navigate(`/products/${id}`)}
            >
              <Image
                src={image}
                alt={name}
                className="rounded bg-secondary"
                style={{ width: "70px", aspectRatio: "1/1", minWidth: "70px" }}
              />
              <div className="ms-3 me-auto pe-4">
                <p className="mb-1 fw-semibold">{name}</p>
                <p className="mb-1 small">Size: {size}</p>
                <p className="mb-1 small">Qty: {quantity}</p>
              </div>
              <p className="fw-bold text-success mb-0 fs-6">
                ${itemTotal?.toFixed(2)}
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
                <span>${savings?.toFixed(2)}</span>
              </div>
            )}
            <hr className="hr" />
            <div className="d-flex justify-content-between fw-bold fs-4 mt-3">
              <span>Total</span>
              <span>${total?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectCheckout;
