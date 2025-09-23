/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { Country, State, City } from "country-state-city";
import {
  isValidName,
  isValidEmail,
  isValidPhone,
  isValidZip,
} from "../utils/validators";

const CheckoutForm = ({ formData, onChange, onSubmit }) => {
  const [errors, setErrors] = useState({});

  // Country/State/City lists
  const countries = useMemo(() => Country.getAllCountries(), []);

  const states = formData.country
    ? State.getStatesOfCountry(formData.country)
    : [];
  const cities = formData.state
    ? City.getCitiesOfState(formData.country, formData.state)
    : [];

  const validateForm = () => {
    const newErrors = {};

    if (!isValidName(formData.name)) newErrors.name = "Enter a valid name.";
    if (!isValidEmail(formData.email)) newErrors.email = "Enter a valid email.";
    if (!isValidPhone(formData.phone))
      newErrors.phone = "Enter a valid phone number.";

    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.country) newErrors.country = "Please select a country.";
    if (!formData.state) newErrors.state = "Please select a state.";
    if (!formData.city) newErrors.city = "Please select a city.";
    if (!isValidZip(formData.zip))
      newErrors.zip = "ZIP/Postal code is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h4 className="fw-semibold mb-4">Shipping Information</h4>

      <div className="row">
        {/* Name */}
        <div className="mb-3 col-6">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            value={formData.name}
            onChange={onChange}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        {/* Email */}
        <div className="mb-3 col-6">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            value={formData.email}
            onChange={onChange}
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
          onChange={onChange}
        />
        {errors.address && (
          <div className="invalid-feedback">{errors.address}</div>
        )}
      </div>

      <div className="row">
        {/* Country */}
        <div className="mb-3 col-6">
          <label className="form-label">Country</label>
          <select
            name="country"
            className={`form-select cursor-pointer ${errors.country ? "is-invalid" : ""}`}
            value={formData.country}
            onChange={onChange}
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
        <div className="mb-3 col-6">
          <label className="form-label">State</label>
          <select
            name="state"
            className={`form-select cursor-pointer ${errors.state ? "is-invalid" : ""}`}
            value={formData.state}
            onChange={onChange}
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
        <div className="mb-3 col-6">
          <label className="form-label">City</label>
          <select
            name="city"
            className={`form-select cursor-pointer ${errors.city ? "is-invalid" : ""}`}
            value={formData.city}
            onChange={onChange}
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
        <div className="mb-3 col-6">
          <label className="form-label">ZIP / Postal Code</label>
          <input
            type="text"
            inputMode="numeric"
            name="zip"
            className={`form-control ${errors.zip ? "is-invalid" : ""}`}
            value={formData.zip}
            onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
          id="upi"
          value="upi"
          checked={formData.paymentMethod === "upi"}
          onChange={onChange}
        />
        <label className="form-check-label" htmlFor="upi">
          UPI / Wallet / COD
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
          onChange={onChange}
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
          onChange={onChange}
        />
        <label className="form-check-label" htmlFor="express">
          Express Delivery <b>(+$5)</b>
        </label>
      </div>

      <button type="submit" className="btn btn-primary w-100 mt-4">
        Place Order
      </button>
    </form>
  );
};

export default CheckoutForm;
