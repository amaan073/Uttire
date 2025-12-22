import { useState, useEffect } from "react";
import { Button, Modal, Form, Alert, Stack, Spinner } from "react-bootstrap";
import useOnlineStatus from "../hooks/useOnlineStatus";

/* eslint-disable react/prop-types */
function DeleteAccountModal({
  show,
  onHide,
  onConfirm,
  backendError,
  loading,
}) {
  const isOnline = useOnlineStatus();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Update error state if backendError changes
  useEffect(() => {
    if (backendError) setError(backendError);
  }, [backendError]);

  const handleSubmit = (e) => {
    e.preventDefault();

    //frontend validation
    if (!password) {
      setError("Password is required");
      return;
    }

    setError("");
    onConfirm(password); // Call parent callback
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        onHide();
        setError("");
      }} //clear error variable when modal hides
      size="md"
      aria-labelledby="delete-account-modal"
      backdrop={loading ? "static" : true}
      keyboard={!loading}
      centered
    >
      <Modal.Header closeButton={!loading}>
        <Modal.Title id="delete-account-modal">
          Confirm Delete Account
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          This action is <strong>irreversible</strong>. Please enter your
          password to confirm.
        </p>
        {error && <Alert variant="danger">{error}</Alert>}
        {/* show backend error */}
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </Form.Group>
          <Stack
            direction="horizontal"
            gap={3}
            className="mt-3 justify-content-center"
          >
            <Button
              variant="secondary"
              onClick={() => {
                setError(""); // clear error when closing modal
                onHide();
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              type="submit"
              disabled={!isOnline || loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </Button>
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteAccountModal;
