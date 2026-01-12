import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { InputGroup, Button, Form, Spinner } from "react-bootstrap";
import { ShoppingCart, ShoppingBagIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import CartContext from "../../context/CartContext";
import DemoTooltip from "../../components/ui/DemoTooltip.jsx";
import { toast } from "react-toastify";
import AuthContext from "../../context/AuthContext.jsx";
import useOnlineStatus from "../../hooks/useOnlineStatus.jsx";
import ErrorState from "../../components/ui/ErrorState.jsx";
import LoadingScreen from "../../components/ui/LoadingScreen.jsx";
import Image from "../../components/ui/Image.jsx";

const Cart = () => {
  const { cart, fetchCart, loading, updateQuantity, removeFromCart, error } =
    useContext(CartContext);
  const isOnline = useOnlineStatus();
  const { user } = useContext(AuthContext);
  const [updatingItem, setUpdatingItem] = useState(null); // track which item is updating quanitity
  const [removingItem, setRemovingItem] = useState(null);
  const navigate = useNavigate();

  const getDiscountedPrice = (price, discount) => {
    return discount > 0 ? price - (price * discount) / 100 : price;
  };

  // without discont total of cart items
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

  const BASE_SHIPPING = 5;

  const total = subtotal + BASE_SHIPPING; // SHIPPING CHARGES INCLUDED

  const handleQuantityChange = async (itemId, newQuantity) => {
    setUpdatingItem(itemId);
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemove = async (itemId) => {
    setRemovingItem(itemId); //  mark this item as being removed
    try {
      await removeFromCart(itemId);
    } finally {
      setRemovingItem(null); //  reset regardless of success or error
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.info("Please login first");
      return navigate("/login");
    }
    navigate("/cart/checkout");
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorState message={error} retry={fetchCart} />;

  return (
    <>
      {cart?.length === 0 ? (
        <div
          className="container text-center d-flex justify-content-center align-items-center pb-5"
          style={{
            maxWidth: "1600px",
            minHeight: "calc(var(--safe-height) - 83px)",
          }}
        >
          <div>
            <div>
              <ShoppingCart style={{ height: "120px", width: "100px" }} />
            </div>
            <div className="fw-semibold fs-1">Your cart is empty</div>
            <div className="text-muted fs-4">
              Add items to your cart and they&apos;ll appear here
            </div>
            <div className="btn btn-primary mt-3">
              <Link
                to="/shop"
                style={{ all: "unset" }}
                className="d-flex align-items-center gap-1"
              >
                <ShoppingBagIcon />
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="container-fluid text-center"
          style={{
            maxWidth: "1600px",
            minHeight: "calc(var(--safe-height) - 83px)",
          }}
        >
          <div className="bg-light py-3 pt-4 border-bottom">
            <h1 className="h1 mb-0 me-2 mb-3 d-flex align-items-center gap-2 justify-content-center">
              <ShoppingCartIcon fontSize="inherit" />
              <div className="fw-semibold">Your Shopping Cart</div>
            </h1>
            <p className="text-muted">
              You have{" "}
              <b>{cart?.length == 1 ? "1 item" : `${cart?.length} items`}</b> in
              your cart.
            </p>
          </div>
          <div className="d-md-flex justify-content-center align-items-start gap-4 my-5 text-start">
            <div
              style={{ flex: "1", maxWidth: "600px" }}
              className="mx-auto mx-md-0 d"
            >
              {cart?.map((item) => (
                <div
                  key={item?._id}
                  className="cart-item d-flex gap-3 align-items-center border rounded-4 p-3 shadow-sm bg-white mb-3"
                >
                  {/* Product Image */}
                  <div
                    style={{
                      minWidth: "110px",
                      width: "110px",
                      height: "110px",
                    }}
                    className="cart-product-img overflow-hidden rounded-3 border bg-secondary cursor-pointer"
                    onClick={() => navigate(`/products/${item?.product?._id}`)}
                  >
                    <Image
                      src={item?.product?.image}
                      alt={item?.product?.name ?? "Product image"}
                      className="w-100 h-100"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="cart-product-info flex-grow-1">
                    <b className="fs-5">
                      {item?.product?.name ?? "Unnamed product"}
                    </b>
                    <p className="text-muted mb-1 small">
                      Size: {item?.size ?? "N/A"} | Color:{" "}
                      {item?.product?.color ?? "N/A"}
                    </p>
                    <div>
                      <p className="fw-semibold text-success mb-0">
                        $
                        {getDiscountedPrice(
                          item?.product?.price,
                          item?.product?.discount
                        ).toFixed(2)}
                      </p>
                      {item?.product?.discount > 0 && (
                        <small className="text-muted text-decoration-line-through">
                          ${item?.product?.price?.toFixed(2)}
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Quantity + Actions */}
                  <div
                    className="cart-actions-btn-wrapper d-flex flex-column align-items-end justify-content-end gap-1"
                    style={{ minWidth: "110px" }}
                  >
                    <div className="d-flex align-items-center flex-row-reverse mb-2 gap-2">
                      <InputGroup size="sm" style={{ maxWidth: "90px" }}>
                        {/* Decrease */}
                        <Button
                          variant="outline-secondary"
                          style={{ fontWeight: "bold" }}
                          onClick={() =>
                            handleQuantityChange(
                              item?._id,
                              Math.max(1, item?.quantity - 1)
                            )
                          }
                          disabled={
                            updatingItem === item?._id ||
                            item?.quantity <= 1 ||
                            !isOnline
                          }
                        >
                          −
                        </Button>

                        {/* Input field */}
                        <Form.Control
                          type="number"
                          min={1}
                          max={item?.product?.stock}
                          value={item?.quantity}
                          disabled={updatingItem === item?._id || !isOnline} //  disable while loading
                          onChange={(e) => {
                            let value = parseInt(e.target.value) || 1;
                            if (value > item?.product?.stock)
                              value = item?.product?.stock;
                            handleQuantityChange(item?._id, value);
                          }}
                          style={{ textAlign: "center" }}
                        />

                        {/* Increase */}
                        <Button
                          variant="outline-secondary"
                          style={{ fontWeight: "bold" }}
                          onClick={() =>
                            handleQuantityChange(
                              item?._id,
                              Math.min(item?.product?.stock, item?.quantity + 1)
                            )
                          }
                          disabled={
                            updatingItem === item?._id ||
                            item?.quantity >= item?.product?.stock ||
                            !isOnline
                          }
                        >
                          +
                        </Button>
                      </InputGroup>

                      {/* Show spinner while updating */}
                      {updatingItem === item?._id && (
                        <Spinner animation="border" size="sm" />
                      )}
                    </div>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="d-flex align-items-center gap-1 px-2 py-1 rounded-2 justify-content-center"
                      style={{ width: "90px" }}
                      onClick={() => handleRemove(item?._id)}
                      disabled={removingItem === item?._id || !isOnline} //  disable while removing
                    >
                      {removingItem === item?._id ? (
                        <Spinner animation="border" size="sm" cl /> //  show spinner
                      ) : (
                        <>
                          <i className="bi bi-trash"></i> <span>Remove</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal */}
            <div
              className="cart-summary shadow-sm p-4 rounded-4 bg-light mx-auto mx-md-0 mt-4 mt-md-0 position-sticky border"
              style={{ minWidth: "280px", maxWidth: "600px", top: "107px" }}
            >
              <h5 className="fw-bold mb-3 text-primary mb-3">Order Summary</h5>
              <hr className="hr" />

              <div className="d-flex justify-content-between align-items-center my-3">
                <span className="text-muted">Subtotal</span>
                <span className="fw-semibold ">${subtotal.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <DemoTooltip>
                  <span className="text-muted">Shipping</span>
                </DemoTooltip>
                <span className="fw-semibold">${BASE_SHIPPING}</span>
              </div>
              {savings > 0 && (
                <div className="d-flex justify-content-between text-success mb-3">
                  <span>You saved</span>
                  <span>${savings.toFixed(2)}</span>
                </div>
              )}

              <hr className="hr" />

              <div className="d-flex justify-content-between align-items-center my-3">
                <span className="fw-bold fs-5">Total</span>
                <span className="fw-bold fs-4 text-success">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button
                className="btn btn-success w-100 fw-semibold py-2 rounded-pill"
                disabled={!isOnline}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
