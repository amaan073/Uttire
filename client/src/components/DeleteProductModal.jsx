/* eslint-disable react/prop-types */
import { Modal, Button, Spinner } from "react-bootstrap";
import useOnlineStatus from "../hooks/useOnlineStatus";
import { Img } from "react-image";
import { ImageOff } from "lucide-react";
import OfflineNote from "../components/ui/OfflineNote";

const DeleteProductModal = ({
  show,
  onHide,
  product,
  onConfirm, // function(productId) => parent handles API
  loading = false,
  backendError = "",
}) => {
  const isOnline = useOnlineStatus();

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop={loading ? "static" : true} // disable click outside
      keyboard={!loading} // disable ESC
    >
      <Modal.Header closeButton={!loading}>
        <Modal.Title>Delete product</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex gap-3 align-items-center">
          <div
            style={{ width: "64px", height: "64px" }}
            className="rounded-3 overflow-hidden mx-auto"
          >
            <Img
              src={product?.image}
              alt={product?.name}
              className="w-100 h-100"
              style={{ objectFit: "contain" }}
              loader={
                <div
                  className="w-100 h-100 bg-light rounded pulse"
                  role="status"
                  aria-label="Loading image"
                />
              }
              unloader={
                <div
                  role="alert"
                  className="w-100 h-100 bg-light d-flex flex-column align-items-center justify-content-center"
                >
                  <ImageOff size={20} className="text-muted" />
                </div>
              }
            />
          </div>
          <div>
            <div className="fw-semibold">{product?.name}</div>
            <div className="text-muted small">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </div>
          </div>
        </div>

        {backendError && (
          <div className="text-danger small mt-3 fst-italic">
            *{backendError}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => onConfirm(product?._id)}
          disabled={loading || !isOnline}
        >
          {loading ? (
            <>
              <Spinner
                animation="border"
                size="sm"
                role="status"
                className="me-2"
              />
              Deleting
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </Modal.Footer>
      <OfflineNote isOnline={isOnline} className="text-end" />
    </Modal>
  );
};

export default DeleteProductModal;
