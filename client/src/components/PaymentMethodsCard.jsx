import { Card, Button } from "react-bootstrap";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DemoTooltip from "./ui/DemoTooltip";

function PaymentMethods() {
  return (
    <DemoTooltip>
      <Card
        className="p-4 shadow-sm rounded-3 mb-3 border bg-white"
        style={{ minWidth: "340px", height: "127px" }}
      >
        {/* Header row */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-semibold">Payment Methods</h5>
          <Button
            variant="outline-primary"
            size="sm"
            className="rounded-3 px-3 py-1 fw-semibold"
          >
            + Add
          </Button>
        </div>

        <div className="d-flex gap-3 h-100">
          {/* Card 1 */}
          <div className="payment-box cursor-pointer px-3 gap-2 d-inline-flex align-items-center justify-content-center  rounded-3 border bg-light shadow-sm">
            <CreditCardIcon className="text-primary" fontSize="small" />
            <div
              className="small text-nowrap p-card"
              style={{ lineHeight: "12px" }}
            >
              Visa <span>****1234</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="payment-box cursor-pointer px-3 gap-2 d-inline-flex align-items-center justify-content-center rounded-3 border bg-light shadow-sm">
            <CreditCardIcon className="text-success " fontSize="small" />
            <div
              className="small text-nowrap p-card"
              style={{ lineHeight: "12px" }}
            >
              Mastercard <span>****5678</span>
            </div>
          </div>
        </div>
      </Card>
    </DemoTooltip>
  );
}

export default PaymentMethods;
