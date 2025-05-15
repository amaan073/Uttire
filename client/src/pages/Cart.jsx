import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import image from "../assets/image.png";
import { InputGroup, Button, Form } from "react-bootstrap";
import { ShoppingCart } from "lucide-react"; //empty-cart-icon
import { ShoppingBagIcon } from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";

const Cart = () => {
  const cartItems = ["1"];

  const [quantities, setQuantities] = useState({
    first: 31, // Product Name                                //All of this is temporary solution will fix when backend is ready
    second: 19, // Womens Sweater
    third: 40, // Kids Hoodie
  });

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: value, //used scquare brackets for id because this is how you access object properties when you want to access by key but key is a string to turn the string into a key we have to use square bracket
    }));
  };

  return (
    <>
      {cartItems.length === 0 ? (
        <div
          className="container text-center d-flex justify-content-center align-items-center"
          style={{ maxWidth: "1600px", minHeight: "calc(100vh - 210px)" }}
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
          style={{ maxWidth: "1600px", minHeight: "calc(100vh - 83px)" }}
        >
          <div className="bg-light py-3 pt-4 border-bottom">
            <h1 className="h1 mb-0 me-2 mb-3 d-flex align-items-center gap-2 justify-content-center bg-body-tertiary">
              <ShoppingCartIcon fontSize="inherit" />
              <div className="fw-semibold">Your Shopping Cart</div>
            </h1>
            <p className="text-muted">
              You have <b>3 items</b> in your cart.
            </p>
          </div>
          <div className="d-md-flex justify-content-center align-items-start gap-5 my-5 text-start">
            <div
              style={{ flex: "1", maxWidth: "600px" }}
              className="mx-auto mx-md-0"
            >
              <div className="cart-list-card d-flex gap-3 align-items-center border-bottom pb-4">
                <div
                  style={{ minWidth: "100px", width: "100px" }}
                  className="overflow-hidden rounded"
                >
                  <img
                    src={image}
                    className="w-100"
                    style={{ height: "120px" }}
                  />
                </div>
                <div>
                  <b className="fs-5">
                    Product name dsfkjdsl dkfdj dfds l fudslkf{" "}
                  </b>
                  <p className="text-muted">Size: M | Color: Black</p>
                </div>
                <div className="ms-auto text-end">
                  <p className="fs-5 fw-semibold mb-2">25$</p>
                  <InputGroup style={{ width: "70px", height: "32px" }}>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        handleQuantityChange("first", quantities.first - 1)
                      }
                      style={{
                        padding: "0 6px",
                        fontSize: "14px",
                        height: "32px",
                        lineHeight: "1",
                      }}
                    >
                      −
                    </Button>
                    <Form.Control
                      type="number"
                      id="first"
                      min={1}
                      value={quantities.first}
                      onChange={(e) =>
                        handleQuantityChange(
                          e.target.id,
                          parseInt(e.target.value) || ""
                        )
                      }
                      style={{
                        width: "20px", // very narrow input
                        padding: "0",
                        fontSize: "14px",
                        textAlign: "center",
                        borderRadius: "0",
                        height: "32px",
                      }}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        handleQuantityChange("first", quantities.first + 1)
                      }
                      style={{
                        padding: "0 6px",
                        fontSize: "14px",
                        height: "32px",
                        lineHeight: "1",
                      }}
                    >
                      +
                    </Button>
                  </InputGroup>
                </div>
              </div>
              <div className="cart-list-card d-flex gap-3 align-items-center border-bottom py-4">
                <div
                  style={{ minWidth: "100px", width: "100px" }}
                  className="overflow-hidden rounded"
                >
                  <img
                    src={image}
                    className="w-100"
                    style={{ height: "120px" }}
                  />
                </div>
                <div>
                  <b className="fs-5">Product name</b>
                  <p className="text-muted">Size: M | Color: Black</p>
                </div>
                <div className="ms-auto text-end">
                  <p className="fs-5 fw-semibold mb-2">25$</p>
                  <InputGroup style={{ width: "70px", height: "32px" }}>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        handleQuantityChange("second", quantities.second - 1)
                      }
                      style={{
                        padding: "0 6px",
                        fontSize: "14px",
                        height: "32px",
                        lineHeight: "1",
                      }}
                    >
                      −
                    </Button>
                    <Form.Control
                      type="number"
                      id="second"
                      min={1}
                      value={quantities.second}
                      onChange={(e) =>
                        handleQuantityChange(
                          e.target.id,
                          parseInt(e.target.value) || ""
                        )
                      }
                      style={{
                        width: "20px", // very narrow input
                        padding: "0",
                        fontSize: "14px",
                        textAlign: "center",
                        borderRadius: "0",
                        height: "32px",
                      }}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        handleQuantityChange("second", quantities.second + 1)
                      }
                      style={{
                        padding: "0 6px",
                        fontSize: "14px",
                        height: "32px",
                        lineHeight: "1",
                      }}
                    >
                      +
                    </Button>
                  </InputGroup>
                </div>
              </div>
              <div className="cart-list-card d-flex gap-3 align-items-center py-4">
                <div
                  style={{ minWidth: "100px", width: "100px" }}
                  className="overflow-hidden rounded"
                >
                  <img
                    src={image}
                    className="w-100"
                    style={{ height: "120px" }}
                  />
                </div>
                <div>
                  <b className="fs-5">Product name</b>
                  <p className="text-muted">Size: M | Color: Black</p>
                </div>
                <div className="ms-auto text-end">
                  <p className="fs-5 fw-semibold mb-2">25$</p>
                  <InputGroup style={{ width: "70px", height: "32px" }}>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        handleQuantityChange("third", quantities.third - 1)
                      }
                      style={{
                        padding: "0 6px",
                        fontSize: "14px",
                        height: "32px",
                        lineHeight: "1",
                      }}
                    >
                      −
                    </Button>
                    <Form.Control
                      type="number"
                      id="third"
                      min={1}
                      value={quantities.third}
                      onChange={(e) =>
                        handleQuantityChange(
                          e.target.id,
                          parseInt(e.target.value) || ""
                        )
                      }
                      style={{
                        width: "20px", // very narrow input
                        padding: "0",
                        fontSize: "14px",
                        textAlign: "center",
                        borderRadius: "0",
                        height: "32px",
                      }}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        handleQuantityChange("third", quantities.third + 1)
                      }
                      style={{
                        padding: "0 6px",
                        fontSize: "14px",
                        height: "32px",
                        lineHeight: "1",
                      }}
                    >
                      +
                    </Button>
                  </InputGroup>
                </div>
              </div>
            </div>
            <div
              className="p-4 border rounded-3 text-start bg-white mx-auto mx-md-0 mt-4 mt-md-0"
              style={{ maxWidth: "600px" }}
            >
              <h5 className="mb-3">Cart summary</h5>
              <hr className="hr" />
              <div className="d-flex justify-content-between mt-3">
                <p>Subtotal</p>
                <p>$140</p>
              </div>
              <button className="btn btn-primary text-nowrap px-3 ms-auto ms-md-0 d-block">
                Proceed to checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
