import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import CartContext from "../../../context/CartContext";
import CheckoutForm from "../../../components/CheckoutForm";
import Image from "../../../components/ui/Image";

const CartCheckout = () => {
  const navigate = useNavigate();
  const { cart, error, clearCart } = useContext(CartContext);
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Shipping state (controlled by CheckoutForm)
  const [delivery, setDelivery] = useState("standard");

  // If cart is not available (error or not fetched), redirect to /cart, also to prevent cart guard navigation when order is successfully placed we need this orderCompleted flag to prevent this navigation
  if ((!cart || cart?.length === 0 || error) && !orderCompleted) {
    return <Navigate to="/cart" replace />;
  }

  // --- Price calculations ---
  const getDiscountedPrice = (price, discount) => {
    return discount > 0 ? price - (price * discount) / 100 : price;
  };
  // subtotal of cart items (without discount)
  const originalTotal = cart.reduce(
    (acc, item) => acc + item?.product?.price * item?.quantity,
    0
  );
  // Calculate subtotal (discounted)
  const subtotal = cart.reduce(
    (acc, item) =>
      acc +
      getDiscountedPrice(item?.product?.price, item?.product?.discount) *
        item?.quantity,
    0
  );

  const savings = originalTotal - subtotal;

  // ✅ shipping fee based on delivery type
  const shippingCost = delivery === "express" ? 10 : 5;

  const total = subtotal + shippingCost; // SHIPPING CHARGES INCLUDED

  return (
    <div className="container py-5" style={{ maxWidth: "1200px" }}>
      <h1 className="fw-bold mb-5 text-center">Checkout</h1>
      <div className="row g-4">
        {/* --- LEFT: Shipping form --- */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm p-4">
            <CheckoutForm
              items={cart.map((item) => ({
                productId: item?.product?._id,
                name: item?.product?.name,
                image: item?.product?.image,
                size: item?.size,
                quantity: item?.quantity,
                price: item?.product?.price,
                discount: item?.product?.discount,
              }))}
              checkoutType="cart"
              setDelivery={setDelivery}
              onOrderSuccess={(orderId) => {
                setOrderCompleted(true); // prevent cart guard from redirecting
                navigate(`/checkout/success/${orderId}`, { replace: true });
                clearCart(); // safe to clear cart now
              }}
            />
          </div>
        </div>

        {/* --- RIGHT: Order Summary --- */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm p-4">
            <h4 className="fw-semibold mb-4">Order Summary</h4>
            {cart.map((item) => (
              <div
                key={item?._id}
                className="d-flex mb-3 align-items-center border-bottom pb-2 cursor-pointer"
                onClick={() => navigate(`/products/${item?.product?._id}`)}
              >
                <Image
                  src={item?.product?.image}
                  alt={item?.product?.name}
                  className="rounded"
                  style={{ width: "70px", aspectRatio: "1/1" }}
                />
                <div className="ms-3 me-auto pe-4">
                  <p className="mb-1 fw-semibold">{item?.product?.name}</p>
                  <p className="mb-1 small">Size: {item?.size}</p>
                  <p className="mb-1 small">Qty: {item?.quantity}</p>
                </div>
                <div>
                  <p className="fw-semibold text-success mb-0">
                    $
                    {getDiscountedPrice(
                      item?.product?.price,
                      item?.product?.discount
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-between fw-semibold my-2">
              <span>Subtotal</span>
              <span>${subtotal?.toFixed(2)}</span>
            </div>
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

export default CartCheckout;
