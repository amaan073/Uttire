/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Country, State, City } from "country-state-city";
import privateAxios from "../api/privateAxios";
import { toast } from "react-toastify";
import { isValidZip } from "../utils/validators";
import useOnlineStatus from "../hooks/useOnlineStatus";

const ManageAddressModal = ({ show, onHide, address, setProfile }) => {
  const isOnline = useOnlineStatus();
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    type: "home",
  });
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState({});

  // Country / State / City lists
  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = formData.country
    ? State.getStatesOfCountry(formData.country)
    : [];
  const cities = formData.state
    ? City.getCitiesOfState(formData.country, formData.state)
    : [];

  // Initialize form with existing address
  useEffect(() => {
    if (address && Object.keys(address).length > 0) setFormData(address);
    setIsChanged(false);
  }, [address]);

  // Compare current formData with original address to enable/disable Save
  useEffect(() => {
    // no change logic check when user is adding address first time
    if (!address || Object.keys(address).length === 0) {
      return;
    }
    const hasChanged =
      formData.street.trim() !== (address.street || "").trim() ||
      formData.city.trim() !== (address.city || "").trim() ||
      formData.state.trim() !== (address.state || "").trim() ||
      formData.country.trim() !== (address.country || "").trim() ||
      formData.zip.trim() !== (address.zip || "").trim() ||
      formData.type !== (address.type || "home");
    setIsChanged(hasChanged);
  }, [formData, address]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear input errors when user input again
  };

  const resetForm = () => {
    if (address && Object.keys(address).length > 0) {
      setFormData(address);
    } else {
      setFormData({
        street: "",
        city: "",
        state: "",
        country: "",
        zip: "",
        type: "home",
      });
    }
    setIsChanged(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await privateAxios.put("/users/address", { address: null });
      toast.success("Address deleted successfully!");
      setFormData({
        street: "",
        city: "",
        state: "",
        country: "",
        zip: "",
        type: "home",
      }); // reset form
      setIsChanged(false); // disable Save
      setProfile((prev) => ({ ...prev, address: null }));
      onHide(); // close modal
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address");
    } finally {
      setIsDeleting(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const street = formData.street?.trim() || "";

    if (street.length < 5 || !/^[a-zA-Z0-9\s]+$/.test(street)) {
      newErrors.street =
        "Street must be at least 5 characters and contain only letters, numbers, or spaces.";
    }

    if (!isValidZip(formData.zip))
      newErrors.zip = "ZIP code must be 4–10 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const res = await privateAxios.put("/users/address", {
        address: formData,
      });
      toast.success(res.data.message || "Address saved successfully!");
      setProfile((prev) => ({ ...prev, address: res.data.address }));
      setIsChanged(false);
      onHide(); // close modal
    } catch (err) {
      console.error(err);
      toast.error("Failed to save address");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "1rem" }}>Manage Address</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ fontSize: "0.85rem" }}>
        <Form className="p-2" style={{ fontSize: "0.85rem" }}>
          <Row className="g-2">
            <Col xs={12}>
              <Form.Control
                name="street"
                placeholder="Street"
                value={formData.street}
                onChange={handleChange}
                required
                className={`py-1 ${errors.street ? "is-invalid" : ""}`}
                style={{ fontSize: "0.85rem" }}
              />
              {errors.street && (
                <Form.Control.Feedback type="invalid">
                  {errors.street}
                </Form.Control.Feedback>
              )}
            </Col>

            <Col xs={6}>
              <Form.Select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="py-1"
                style={{ fontSize: "0.85rem" }}
                required
              >
                <option value="">Country</option>
                {countries.map((c) => (
                  <option key={c.isoCode} value={c.isoCode}>
                    {c.name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={6}>
              <Form.Select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="py-1"
                style={{ fontSize: "0.85rem" }}
                required
                disabled={!formData.country}
              >
                <option value="">State</option>
                {states.map((s) => (
                  <option key={s.isoCode} value={s.isoCode}>
                    {s.name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={6}>
              <Form.Select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="py-1"
                style={{ fontSize: "0.85rem" }}
                required
                disabled={!formData.state}
              >
                <option value="">City</option>
                {cities.map((ct) => (
                  <option key={ct.name} value={ct.name}>
                    {ct.name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={6}>
              <Form.Control
                name="zip"
                type="number"
                placeholder="ZIP / Postal Code"
                value={formData.zip}
                onChange={handleChange}
                required
                className={`py-1 ${errors.zip ? "is-invalid" : ""}`}
                style={{ fontSize: "0.85rem" }}
              />
              {errors.zip && (
                <Form.Control.Feedback type="invalid">
                  {errors.zip}
                </Form.Control.Feedback>
              )}
            </Col>

            <Col xs={12}>
              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="py-1"
                style={{ fontSize: "0.85rem" }}
              >
                <option value="home">Home</option>
                <option value="office">Office</option>
                <option value="other">Other</option>
              </Form.Select>
            </Col>
          </Row>
          <div className="d-flex mt-3">
            {address && Object.keys(address).length > 0 && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={!isOnline}
                style={{ fontSize: "0.8rem" }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            )}

            <div className="d-flex gap-2 ms-auto">
              <Button
                variant="secondary"
                size="sm"
                onClick={resetForm}
                style={{ fontSize: "0.8rem" }}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveAddress}
                disabled={
                  !(
                    formData.street.trim() &&
                    formData.city &&
                    formData.state &&
                    formData.country &&
                    formData.zip.trim()
                  ) ||
                  (address && Object.keys(address).length > 0
                    ? !isChanged
                    : false) ||
                  !isOnline
                }
                style={{ fontSize: "0.8rem" }}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ManageAddressModal;
