/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import useOnlineStatus from "../hooks/useOnlineStatus";
import OfflineNote from "../components/ui/OfflineNote";

const ChangeStatusModal = ({
  show,
  onHide,
  order,
  onConfirm,
  loading,
  backendError,
}) => {
  const [newStatus, setNewStatus] = useState(order?.status || "");
  const isOnline = useOnlineStatus();

  const STATUS_OPTIONS = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  useEffect(() => setNewStatus(order?.status || ""), [order]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop={loading ? "static" : true}
      keyboard={!loading}
    >
      <Modal.Header closeButton={!loading}>
        <Modal.Title>Update Order Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Order:</strong> #{order?.orderNumber || order?._id}
        </p>
        <Form>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              disabled={loading}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {backendError && (
            <div className="text-danger mt-2">{backendError}</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => onConfirm(order?._id, newStatus)}
          disabled={loading || newStatus === order?.status || !isOnline}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Saving
            </>
          ) : (
            "Save"
          )}
        </Button>
      </Modal.Footer>
      <OfflineNote isOnline={isOnline} className="text-end" />
    </Modal>
  );
};

export default ChangeStatusModal;
