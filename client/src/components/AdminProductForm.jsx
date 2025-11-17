import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import useOnlineStatus from "../hooks/useOnlineStatus";

// eslint-disable-next-line react/prop-types
const ProductForm = ({ initialData = {}, onSubmit, isEdit = false }) => {
  const isOnline = useOnlineStatus();
  const [errors, setErrors] = useState({}); // form validation errors state
  const [loading, setLoading] = useState(false); // addding or updating product api state
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    discount: 0,
    stock: "",
    sizes: [],
    image: "",
    category: "",
    gender: "",
    color: "",
    featured: false,
    freeShipping: false,
    easyReturns: false,
    fabric: "",
    care: "",
    fit: "",
    modelInfo: "",
  });

  const categories = [
    "T-Shirts",
    "Shirts",
    "Jeans",
    "Jackets",
    "Hoodies",
    "Sweatshirts",
    "Shorts",
    "Track Pants",
    "Trousers",
    "Suits",
    "Blazers",
    "Other",
  ];

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const colors = ["Red", "Green", "Blue", "Black", "White", "Yellow", "Grey"];

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0 && isEdit) {
      const normalized = {
        name: initialData.name || "",
        brand: initialData.brand || "",
        description: initialData.description || "",
        price: (initialData.price ?? "") ? String(initialData.price) : "",
        discount: initialData.discount ?? 0,
        stock: (initialData.stock ?? "") ? String(initialData.stock) : "",
        sizes: Array.isArray(initialData.sizes) ? initialData.sizes : [],
        image: initialData.image || "",
        imagePublicId: initialData.imagePublicId || "", // extra field since its available in edit mode
        category: initialData.category || "",
        gender: initialData.gender || "",
        color: initialData.color || "",
        featured: !!initialData.featured,
        freeShipping: !!initialData.freeShipping,
        easyReturns: !!initialData.easyReturns,
        fabric: initialData.fabric || "",
        care: Array.isArray(initialData.care)
          ? initialData.care.join(", ")
          : initialData.care || "",
        fit: initialData.fit || "",
        modelInfo: initialData.modelInfo || "",
      };

      setFormData((prev) => ({ ...prev, ...normalized }));
    }
  }, [initialData, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Clear the error for this specific field when user modifies it
    setErrors((prev) => ({ ...prev, [name]: "" }));

    // Handle image file upload to Cloudinary
    if (name === "image" && files && files[0]) {
      const file = files[0];

      // Only WEBP
      if (file.type !== "image/webp") {
        setErrors((prev) => ({
          ...prev,
          image: "Only WEBP images are allowed.",
        }));
        return;
      }

      // Max 1MB
      const maxSizeMB = 1;
      if (file.size / 1024 / 1024 > maxSizeMB) {
        setErrors((prev) => ({
          ...prev,
          image: `Image size must be less than ${maxSizeMB} MB.`,
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      return;
    }

    if (type === "checkbox" && name === "sizes") {
      // Toggle sizes
      setFormData((prev) => {
        const updatedSizes = checked
          ? [...(prev.sizes || []), value]
          : (prev.sizes || []).filter((s) => s !== value);
        return { ...prev, sizes: updatedSizes };
      });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required.";

    if (!formData.brand.trim()) newErrors.brand = "Brand name is required.";

    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    else if (formData.description.trim().split(/\s+/).length < 10)
      newErrors.description = "Description must be at least 10 words.";

    if (!formData.price) newErrors.price = "Price is required.";
    else if (isNaN(formData.price) || Number(formData.price) <= 0)
      newErrors.price = "Enter a valid positive price.";

    if (formData.stock === "" || formData.stock === null)
      newErrors.stock = "Stock is required.";
    else if (isNaN(formData.stock) || Number(formData.stock) < 0)
      newErrors.stock = "Stock must be 0 or more.";

    if (!formData.category.trim()) newErrors.category = "Category is required.";

    if (!formData.color.trim()) newErrors.color = "Color is required.";

    if (!formData.gender.trim()) newErrors.gender = "Gender is required.";

    if (!formData.image) {
      // if editing and an existing URL is present, that's fine
      if (!(isEdit && initialData && initialData.image)) {
        newErrors.image = "Product image is required.";
      }
    }

    if (!formData.sizes || formData.sizes.length === 0)
      newErrors.sizes = "Select at least one size.";

    if (!String(formData.fabric || "").trim()) {
      newErrors.fabric = "Fabric is required.";
    }
    if (!String(formData.care || "").trim()) {
      newErrors.care = "Care instructions are required.";
    }

    if (!String(formData.fit || "").trim()) {
      newErrors.fit = "Fit type is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const processedData = {
      ...formData,
      price: Number(formData.price),
      discount: Math.min(Math.max(Number(formData.discount), 0), 100),
      stock: Number(formData.stock),
      fabric: formData.fabric.trim(),
      care: formData.care
        ? formData.care
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [],
      fit: formData.fit.trim(),
      modelInfo: formData.modelInfo.trim(),
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      description: formData.description.trim(),
    };

    const payload = new FormData();
    for (const key in processedData) {
      if (key === "image" && processedData.image instanceof File) {
        payload.append(key, processedData.image);
      } else if (Array.isArray(processedData[key])) {
        payload.append(key, JSON.stringify(processedData[key]));
      } else {
        payload.append(key, processedData[key]);
      }
    }

    try {
      await onSubmit(payload); // 🔁 Call parent submit
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // 🆕 Stop loading
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="container mt-4 mb-5 p-4 border rounded shadow-sm bg-light"
      noValidate
    >
      <h4 className="mb-4 text-center fw-semibold">
        {isEdit ? "Edit Product" : "Add New Product"}
      </h4>

      <div className="row g-3">
        {/* Product Name */}
        <div className="col-md-6">
          <label className="form-label fw-medium">Product Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            placeholder="e.g. Classic T-Shirt"
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        {/* Brand */}
        <div className="col-md-6">
          <label className="form-label fw-medium">Brand</label>
          <input
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            type="text"
            className={`form-control ${errors.brand ? "is-invalid" : ""}`}
            placeholder="e.g. UrbanWear"
          />
          {errors.brand && (
            <div className="invalid-feedback">{errors.brand}</div>
          )}
        </div>

        {/* Description */}
        <div className="col-12">
          <label className="form-label fw-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            placeholder="Write a short product description..."
          ></textarea>
          {errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
        </div>

        {/* Price */}
        <div className="col-md-6">
          <label className="form-label fw-medium">Price ($)</label>
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className={`form-control ${errors.price ? "is-invalid" : ""}`}
            required
          />
          {errors.price && (
            <div className="invalid-feedback">{errors.price}</div>
          )}
        </div>

        {/* Discount Range */}
        <div className="col-md-6">
          <label className="form-label fw-medium">
            Discount ({formData.discount}%)
          </label>
          <input
            name="discount"
            type="range"
            min="0"
            max="100"
            value={formData.discount}
            onChange={handleChange}
            className="form-range"
          />
        </div>

        {/* Stock */}
        <div className="col-md-6">
          <label className="form-label fw-medium">Stock</label>
          <input
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            className={`form-control ${errors.stock ? "is-invalid" : ""}`}
            required
          />
          {errors.stock && (
            <div className="invalid-feedback">{errors.stock}</div>
          )}
        </div>

        {/* Category */}
        <div className="col-md-6">
          <label className="form-label fw-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`form-select ${errors.category ? "is-invalid" : ""}`}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <div className="invalid-feedback">{errors.category}</div>
          )}
        </div>

        {/* Sizes */}
        <div className="col-md-6">
          <label className="form-label fw-medium">Available Sizes</label>
          <div className="d-flex flex-wrap">
            {availableSizes.map((size) => (
              <div className="form-check me-3" key={size}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="sizes"
                  value={size}
                  checked={
                    Array.isArray(formData.sizes) &&
                    formData.sizes.includes(size)
                  }
                  onChange={handleChange}
                  id={`size-${size}`}
                />
                <label htmlFor={`size-${size}`} className="form-check-label">
                  {size}
                </label>
              </div>
            ))}
          </div>
          {errors.sizes && (
            <div className="invalid-feedback d-block">{errors.sizes}</div>
          )}
        </div>

        {/* Color */}
        <div className="col-md-6">
          <label className="form-label fw-medium">Color</label>
          <select
            name="color"
            value={formData.color}
            onChange={handleChange}
            className={`form-select ${errors.color ? "is-invalid" : ""}`}
            required
          >
            <option value="">Select color</option>
            {colors.map((clr) => (
              <option key={clr} value={clr}>
                {clr}
              </option>
            ))}
          </select>
          {errors.color && (
            <div className="invalid-feedback">{errors.color}</div>
          )}
        </div>

        {/* Gender */}
        <div className="col-md-6">
          <label className="form-label fw-medium">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`form-select ${errors.gender ? "is-invalid" : ""}`}
          >
            <option value="">Select gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
          {errors.gender && (
            <div className="invalid-feedback">{errors.gender}</div>
          )}
        </div>

        {/*  Image File Upload */}
        <div className="col-md-6">
          <label className="form-label fw-medium">Upload Product Image</label>
          <input
            name="image"
            type="file"
            accept="image/webp"
            onChange={handleChange}
            className={`form-control ${errors.image ? "is-invalid" : ""}`}
          />
          {/* ✅ Preview if a File object exists */}
          {formData.image && (
            <img
              src={
                formData.image instanceof File
                  ? URL.createObjectURL(formData.image)
                  : formData.image
              }
              alt="Preview"
              className="mt-2 rounded border"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          )}
          {errors.image && (
            <div className="invalid-feedback d-block">{errors.image}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-medium">Fabric</label>
          <input
            name="fabric"
            value={formData.fabric}
            onChange={handleChange}
            type="text"
            className={`form-control ${errors.fabric ? "is-invalid" : ""}`}
            placeholder="e.g. Cotton, Polyester"
          />
          {errors.fabric && (
            <div className="invalid-feedback">{errors.fabric}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-medium">
            Care Instructions (comma separated)
          </label>
          <input
            name="care"
            value={formData.care}
            onChange={handleChange}
            type="text"
            className={`form-control ${errors.care ? "is-invalid" : ""}`}
            placeholder="e.g. Machine wash cold"
          />
          {errors.care && <div className="invalid-feedback">{errors.care}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-medium">Fit Type</label>
          <input
            name="fit"
            value={formData.fit}
            onChange={handleChange}
            type="text"
            className={`form-control ${errors.fit ? "is-invalid" : ""}`}
            placeholder="e.g. Regular Fit, Slim Fit"
          />
          {errors.fit && <div className="invalid-feedback">{errors.fit}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-medium">Model Info (Optional)</label>
          <input
            name="modelInfo"
            value={formData.modelInfo}
            onChange={handleChange}
            type="text"
            className="form-control"
            placeholder="e.g. Model height 6ft, wears size L"
          />
        </div>

        {/* Boolean options */}
        <div className="col-12">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
            <label className="form-check-label">Featured</label>
          </div>

          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              name="freeShipping"
              checked={formData.freeShipping}
              onChange={handleChange}
            />
            <label className="form-check-label">Free Shipping</label>
          </div>

          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              name="easyReturns"
              checked={formData.easyReturns}
              onChange={handleChange}
            />
            <label className="form-check-label">Easy Returns</label>
          </div>
        </div>

        {/* Submit */}
        <div className="col-12 text-center mt-3">
          <button
            type="submit"
            className="btn btn-primary px-5"
            disabled={loading || !isOnline}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : isEdit ? (
              "Update Product"
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
