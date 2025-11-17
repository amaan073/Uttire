/* eslint-disable react/prop-types */
import { useState, useContext, useMemo } from "react";
import { Country, State, City } from "country-state-city";
import AuthContext from "../context/AuthContext";
import {
  isValidEmail,
  isValidName,
  isValidPhone,
  isValidZip,
} from "../utils/validators";
import privateAxios from "../api/privateAxios";
import { toast } from "react-toastify";
import useOnlineStatus from "../hooks/useOnlineStatus.jsx";

const CheckoutForm = ({ items, checkoutType, setDelivery, onOrderSuccess }) => {
  const { user } = useContext(AuthContext);
  const isOnline = useOnlineStatus();

  // --- Pre-fill form with user info ---
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    country: user?.address?.country || "",
    zip: user?.address?.zip || "",
    phone: user?.phone || "",
    paymentMethod: "debitCard",
    delivery: "standard",
  });

  const [errors, setErrors] = useState({}); // input errors
  const [loading, setLoading] = useState(false); // place order loading state handler

  // --- Country/State/City lists ---
  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = formData.country
    ? State.getStatesOfCountry(formData.country)
    : [];
  const cities = formData.state
    ? City.getCitiesOfState(formData.country, formData.state)
    : [];

  // --- Handle input change ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear input errors when user input again

    if (name === "delivery" && setDelivery) setDelivery(value);
  };

  // --- Form validation ---
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    else if (!isValidName(formData.name))
      newErrors.name = "Please enter a valid name.";

    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!isValidEmail(formData.email))
      newErrors.email = "Please enter a valid email.";

    if (!formData.phone.trim()) newErrors.phone = "Phone is required.";
    else if (!isValidPhone(formData.phone))
      newErrors.phone = "Please enter a valid phone number.";

    if (!formData.zip.trim()) newErrors.zip = "ZIP is required.";
    else if (!isValidZip(formData.zip))
      newErrors.zip = "Please enter a valid 5–10 digit ZIP code.";

    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.state.trim()) newErrors.state = "State is required.";
    if (!formData.country.trim()) newErrors.country = "Country is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Calculate totals ---
  const getDiscountedPrice = (price, discount) =>
    discount > 0 ? price - (price * discount) / 100 : price;

  const subtotal = items.reduce(
    (acc, item) =>
      acc + getDiscountedPrice(item.price, item.discount) * item.quantity,
    0
  );

  const shippingCost = formData.delivery === "express" ? 10 : 5;
  const total = subtotal + shippingCost;

  // --- Handle submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Construct the core order object
      const orderPayload = {
        order: {
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            zip: formData.zip,
          },
          paymentMethod: formData.paymentMethod,
          delivery: formData.delivery,
          items: items.map((item) => ({
            product: item.productId,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
          })),
          totals: {
            subtotal,
            shipping: shippingCost,
            total,
          },
          status: "pending",
        },
        source: checkoutType, // "cart" or "direct"
      };

      const { data } = await privateAxios.post("/orders", orderPayload);

      if (onOrderSuccess) onOrderSuccess(data._id); // passing order id
    } catch (err) {
      console.error(err?.response?.data?.message || err.message);
      if (err?.response?.data?.code === "INSUFFICIENT_STOCK") {
        toast.error(err?.response?.data?.message);
        return;
      }
      toast.error("Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h4 className="fw-semibold mb-4">Shipping Information</h4>

      <div className="row">
        {/* Name */}
        <div className="mb-3 col-12 col-md-6">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        {/* Email */}
        <div className="mb-3 col-12 col-md-6">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="mb-3">
        <label className="form-label">Address</label>
        <input
          type="text"
          name="address"
          className={`form-control ${errors.address ? "is-invalid" : ""}`}
          value={formData.address}
          onChange={handleChange}
          required
        />
        {errors.address && (
          <div className="invalid-feedback">{errors.address}</div>
        )}
      </div>

      <div className="row">
        {/* Country */}
        <div className="mb-3 col-12 col-md-6">
          <label className="form-label">Country</label>
          <select
            name="country"
            className={`form-select ${errors.country ? "is-invalid" : ""}`}
            value={formData.country}
            onChange={handleChange}
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.isoCode} value={c.isoCode}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.country && (
            <div className="invalid-feedback">{errors.country}</div>
          )}
        </div>

        {/* State */}
        <div className="mb-3 col-12 col-md-6">
          <label className="form-label">State</label>
          <select
            name="state"
            className={`form-select ${errors.state ? "is-invalid" : ""}`}
            value={formData.state}
            onChange={handleChange}
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.isoCode}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.state && (
            <div className="invalid-feedback">{errors.state}</div>
          )}
        </div>
      </div>

      <div className="row">
        {/* City */}
        <div className="mb-3 col-12 col-md-6">
          <label className="form-label">City</label>
          <select
            name="city"
            className={`form-select ${errors.city ? "is-invalid" : ""}`}
            value={formData.city}
            onChange={handleChange}
          >
            <option value="">Select City</option>
            {cities.map((ct) => (
              <option key={ct.name} value={ct.name}>
                {ct.name}
              </option>
            ))}
          </select>
          {errors.city && <div className="invalid-feedback">{errors.city}</div>}
        </div>

        {/* ZIP */}
        <div className="mb-3 col-12 col-md-6">
          <label className="form-label">ZIP / Postal Code</label>
          <input
            type="number"
            name="zip"
            className={`form-control ${errors.zip ? "is-invalid" : ""}`}
            value={formData.zip}
            onChange={handleChange}
            min="100000"
            max="9999999999"
            required
          />
          {errors.zip && <div className="invalid-feedback">{errors.zip}</div>}
        </div>
      </div>

      {/* Phone */}
      <div className="mb-3">
        <label className="form-label">Phone</label>
        <input
          type="tel"
          name="phone"
          className={`form-control ${errors.phone ? "is-invalid" : ""}`}
          value={formData.phone}
          onChange={handleChange}
          required
        />
        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
      </div>

      {/* Payment Method */}
      <h5 className="mt-4 fw-semibold">Payment Method</h5>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="paymentMethod"
          id="debitCard"
          value="debitCard"
          checked={formData.paymentMethod === "debitCard"}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="debitCard">
          Debit / Credit Card
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="paymentMethod"
          id="creditCard"
          value="creditCard"
          checked={formData.paymentMethod === "creditCard"}
          onChange={handleChange}
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
          id="cod"
          value="cod"
          checked={formData.paymentMethod === "cod"}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="cod">
          Cash on Delivery
        </label>
      </div>

      {/* Delivery */}
      <h5 className="mt-4 fw-semibold">Delivery Option</h5>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="delivery"
          id="standard"
          value="standard"
          checked={formData.delivery === "standard"}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="standard">
          Standard Delivery
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="delivery"
          id="express"
          value="express"
          checked={formData.delivery === "express"}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="express">
          Express Delivery <b>(+$5)</b>
        </label>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100 mt-4"
        disabled={loading || !isOnline}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </form>
  );
};

export default CheckoutForm;
