import { Card, Button, ListGroup } from "react-bootstrap";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DemoTooltip from "./ui/DemoTooltip";

function PaymentMethods() {
  return (
    <Card className="p-4 shadow-sm rounded-3 mb-3 border">
      <h5 className="mb-3 fw-semibold ">Payment methods</h5>

      <ListGroup variant="flush">
        {/* Dummy payment method 1 */}
        <ListGroup.Item className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <CreditCardIcon className="me-2 text-primary" />
            <div>
              <div className="fw-bold">Visa **** 1234</div>
              <div className="text-muted small">Expires 12/25</div>
            </div>
          </div>
          <span className="text-muted small">(Demo)</span>
        </ListGroup.Item>

        {/* Dummy payment method 2 */}
        <ListGroup.Item className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <CreditCardIcon className="me-2 text-success" />
            <div>
              <div className="fw-bold">Mastercard **** 5678</div>
              <div className="text-muted small">Expires 08/26</div>
            </div>
          </div>
          <span className="text-muted small">(Demo)</span>
        </ListGroup.Item>

        {/* Dummy payment method 3 */}
        <ListGroup.Item className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <CreditCardIcon className="me-2 text-warning" />
            <div>
              <div className="fw-bold">Amex **** 9012</div>
              <div className="text-muted small">Expires 03/27</div>
            </div>
          </div>
          <span className="text-muted small">(Demo)</span>
        </ListGroup.Item>
      </ListGroup>

      <div className="mt-3 text-center mb-1">
        <DemoTooltip>
          <Button variant="outline-primary">Add Payment Method</Button>
        </DemoTooltip>
      </div>
    </Card>
  );
}

export default PaymentMethods;
