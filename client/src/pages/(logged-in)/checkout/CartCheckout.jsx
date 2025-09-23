// ✅ CartCheckout.jsx
import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import CartContext from "../../../context/CartContext";
import CheckoutForm from "../../../components/CheckoutForm";

const CartCheckout = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { cart, error } = useContext(CartContext);

  // --- Pre-fill with user info ---
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

  // If cart is not available (error or not fetched), redirect to /cart
  if (!cart || cart.length === 0 || error) {
    return <Navigate to="/cart" replace />;
  }

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Build order payload
    const orderData = {
      userId: user._id,
      items: cart.map((item) => ({
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
      })),
      shipping: {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        phone: formData.phone,
      },
      paymentMethod: formData.paymentMethod,
      delivery: formData.delivery,
    };

    console.log("Placing cart order:", orderData);
    // TODO: call API -> privateAxios.post("/orders", orderData)
    navigate("/order-success");
  };

  // --- Price calculations ---
  const getDiscountedPrice = (price, discount) => {
    return discount > 0 ? price - (price * discount) / 100 : price;
  };
  // subtotal of cart items (without discount)
  const originalTotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  // Calculate subtotal (discounted)
  const subtotal = cart.reduce(
    (acc, item) =>
      acc +
      getDiscountedPrice(item.product.price, item.product.discount) *
        item.quantity,
    0
  );

  const savings = originalTotal - subtotal;

  // --- Shipping calculations ---
  const BASE_SHIPPING = 5;
  const EXPRESS_FEE = 5;

  const shippingCost =
    formData.delivery === "express"
      ? BASE_SHIPPING + EXPRESS_FEE
      : BASE_SHIPPING;

  const total = subtotal + shippingCost; // SHIPPING CHARGES INCLUDED

  return (
    <div className="container py-5" style={{ maxWidth: "1200px" }}>
      <h1 className="fw-bold mb-5 text-center">Checkout</h1>
      <div className="row g-4">
        {/* --- LEFT: Shipping form --- */}
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
            {cart.map((item) => (
              <div
                key={item._id}
                className="d-flex mb-3 align-items-center border-bottom pb-2"
              >
                <img
                  src={`http://localhost:5000/public${item.product.image}`}
                  alt={item.product.name}
                  className="rounded cursor-pointer"
                  width="70"
                  height="70"
                  onClick={() =>
                    navigate(`/products/${item.product.productId}`)
                  }
                />
                <div className="ms-3 me-auto pe-4">
                  <p className="mb-1 fw-semibold">{item.product.name}</p>
                  <p className="mb-1 small">Size: {item.size}</p>
                  <p className="mb-1 small">Qty: {item.quantity}</p>
                </div>
                <div>
                  <p className="fw-semibold text-success mb-0">
                    $
                    {getDiscountedPrice(
                      item.product.price,
                      item.product.discount
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-between fw-semibold my-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
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

export default CartCheckout;
