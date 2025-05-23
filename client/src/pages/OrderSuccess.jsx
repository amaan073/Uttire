import { Link } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const OrderSuccess = () => {
  return (
    <>
      <div
        className="container d-flex justify-content-center align-items-center text-center"
        style={{ height: "calc(var(--safe-height) - 83px)" }}
      >
        <div className="border bg-white p-4">
          <CheckCircleIcon
            sx={{ color: " rgb(42 158 90)", height: "90px", width: "auto" }}
          />
          <h1 className="fw-semibold my-3">Order Successful</h1>
          <p className="mb-3">
            Thank you! your order has been placed succesfully!
          </p>
          <div className="mb-4">
            <div className="mb-2">
              <b>Order ID: </b>
              123456
            </div>
            <div className="mb-2">
              <b>Payment method: </b>
              Credit Card
            </div>
            <div>
              <b>Estimated Delivery Date: </b>
              January 25, 2025
            </div>
          </div>
          <Link to="/shop" className="btn btn-primary mb-3">
            Continue shopping
          </Link>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
