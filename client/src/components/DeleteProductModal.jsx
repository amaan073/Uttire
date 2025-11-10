/* eslint-disable react/prop-types */
import { Modal, Button, Spinner } from "react-bootstrap";
import ImagePlaceholder from "../assets/image.png";

const DeleteProductModal = ({
  show,
  onHide,
  product,
  onConfirm, // function(productId) => parent handles API
  loading = false,
  backendError = "",
}) => {
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
          <img
            src={(product && product.image) || ImagePlaceholder}
            alt={product?.name}
            width={64}
            height={64}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
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
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner
                animation="border"
                size="sm"
                role="status"
                className="me-2"
              />
              Deleting...
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteProductModal;
