import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <h1 className="fw-semibold mb-5 text-center">Checkout</h1>
      <div className="d-flex gap-4 align-items-start justify-content-center">
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <form onSubmit={() => navigate("/order-success")}>
            <div className="form-group mb-3">
              <label htmlFor="name-input">Name</label>
              <input
                type="text"
                className="form-control mt-1"
                id="name-input"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email-input">Email address</label>
              <input
                type="email"
                className="form-control mt-1"
                id="email-input"
                aria-describedby="emailHelp"
                required
              />
              <small id="emailHelp" className="form-text text-muted">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                We'll never share your email with anyone else.
              </small>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="address-input">Address</label>
              <input
                type="text"
                className="form-control mt-1"
                id="addressinput"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Payment Method</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="creditCard"
                  value="creditCard"
                  checked
                  //   checked={paymentMethod === "creditCard"}
                  //   onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label className="form-check-label" htmlFor="creditCard">
                  Credit Card
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="other"
                  value="other"
                  //   checked={paymentMethod === "other"}
                  //   onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label className="form-check-label" htmlFor="other">
                  Other (e.g., UPI or Cash on Delivery)
                </label>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Delivery</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="Delivery"
                  id="standardDelivery"
                  value="standardDelivery"
                  checked /*is to be removed later in backedn process */
                />
                <label className="form-check-label" htmlFor="standardDelivery">
                  Standard deliver
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="Delivery"
                  id="expressDelivery"
                  value="expressDelivery"
                />
                <label className="form-check-label" htmlFor="expressDelivery">
                  Express delivery
                </label>
              </div>
            </div>
            <button className="btn btn-primary" type="submit">
              Place order
            </button>
          </form>
        </div>
        <div
          className="border rounded p-3 bg-white"
          style={{ minWidth: "350px" }}
        >
          <h5 className="mb-3">Order summary</h5>
          <div className="d-flex justify-content-between my-3">
            <div>
              <div className="fw-semibold">Cotton-tshirt</div>
              <div>Qty: 2</div>
            </div>
            <div>$40.00</div>
          </div>
          <div className="d-flex justify-content-between my-3">
            <div>
              <div className="fw-semibold">Cotton-tshirt</div>
              <div>Qty: 2</div>
            </div>
            <div>$40.00</div>
          </div>
          <hr className="hr" />
          <div>
            <div className="d-flex justify-content-between fw-semibold mt-3">
              <span>Total</span>
              <span>$80.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
