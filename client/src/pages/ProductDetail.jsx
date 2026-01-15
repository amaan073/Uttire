import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import StarRating from "../components/ui/StarRating";
import DemoTooltip from "../components/ui/DemoTooltip";
import ReviewSection from "../components/ReviewSection";
import ReviewList from "../components/ReviewList";
import RelatedProducts from "../components/RelatedProducts";
import useOnlineStatus from "../hooks/useOnlineStatus";
import useDocumentTitle from "../hooks/useDocumentTitle";
import LoadingScreen from "../components/ui/LoadingScreen";
import ErrorState from "../components/ui/ErrorState";
import Image from "../components/ui/Image";
import OfflineNote from "../components/ui/OfflineNote";

import {
  ShoppingCart as ShoppingCartIcon,
  ShoppingBag as ShoppingBagIcon,
} from "lucide-react";
import { Spinner } from "react-bootstrap";
import publicAxios from "../api/publicAxios";
import CartContext from "../context/CartContext";
import { toast } from "react-toastify";
import AuthContext from "../context/AuthContext";

const ProductDetail = () => {
  const isOnline = useOnlineStatus();
  const { id } = useParams(); // URL param
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // state
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState();
  const [sizeError, setSizeError] = useState(null);

  const { user } = useContext(AuthContext);

  // add to cart feature
  const { addToCart } = useContext(CartContext);
  const [adding, setAdding] = useState(false); // adding to cart process feadback

  const averageRating = product?.reviews?.length
    ? product?.reviews?.reduce((sum, review) => sum + review?.rating, 0) /
      product?.reviews?.length
    : 0;

  const totalReviews = product?.reviews?.length || 0;

  // calculate discount price if exists
  const discountedPrice = product?.discount
    ? (product?.price - product?.price * (product?.discount / 100)).toFixed(2)
    : product?.price.toFixed(2);

  const normalizeProduct = (product) => {
    if (!product) return null;

    return {
      _id: product?._id ?? "",
      name: product?.name ?? "Unnamed Product",
      brand: product?.brand ?? "",
      description: product?.description ?? "",
      price: typeof product?.price === "number" ? product.price : 0,
      discount: typeof product?.discounts === "number" ? product.discount : 0,
      stock: typeof product?.stock === "number" ? product.stock : 0,
      quantity: typeof product?.quantity === "number" ? product.quantity : 1,
      sizes: Array.isArray(product?.sizes) ? product.sizes : [],
      image: product?.image ?? "",
      imagePublicId: product?.imagePublicIds ?? "",
      category: product?.category ?? "",
      gender: product?.gender ?? "",
      color: product?.color ?? "",
      featured: Boolean(product?.featured),
      freeShipping: Boolean(product?.freeShipping),
      easyReturns: Boolean(product?.easyReturns),
      fabric: product?.fabric ?? "",
      care: Array.isArray(product?.care) ? product?.care : [],
      fit: product?.fit ?? "",
      modelInfo: product?.modelInfo ?? "",
      reviews: Array.isArray(product?.reviews) ? product?.reviews : [],
      specifications: product?.specifications ? product?.specifications : {},
    };
  };

  // product fetch
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await publicAxios.get(`/products/${id}`);
      setProduct(normalizeProduct(data));
      setError(null);
    } catch (error) {
      console.error(error);

      if (error?.code === "OFFLINE_ERROR" || error?.code === "NETWORK_ERROR") {
        setError("Couldn't reach server. Check your connection and try again.");
      } else if (error?.response?.status === 404) {
        setError("Product not found");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // reset states when product changes
    setQuantity(1);
    setSelectedSize(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Update document title when product loads
  useDocumentTitle(product?.name || null);

  // scroll to hash
  useEffect(() => {
    if (location.hash) {
      const scrollToHash = () => {
        const element = document.querySelector(location.hash);
        if (element) element.scrollIntoView({ behavior: "smooth" });
        else requestAnimationFrame(scrollToHash); // try again next frame
      };
      requestAnimationFrame(scrollToHash);
    }
  }, [location]);

  // add to cart handler
  const handleAddToCart = async () => {
    if (!user) {
      toast.info("Please login first");
      return navigate("/login");
    }
    if (!selectedSize) {
      setSizeError("Please select a size");
      return;
    }

    setSizeError(null);
    try {
      setAdding(true);
      await addToCart({
        productId: product?._id,
        size: selectedSize,
        quantity,
      });
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.info("Please login first");
      return navigate("/login");
    }
    if (!selectedSize) {
      setSizeError("Please select a size");
      return;
    }

    setSizeError(null);

    navigate(`/products/${product._id}/checkout`, {
      state: {
        size: selectedSize,
        quantity: quantity,
        name: product?.name,
        image: product?.image,
        discount: product?.discount,
        price: product?.price,
      },
    });
  };

  // ======= Full Page Loading & Error Handling ========
  if (loading) return <LoadingScreen />;
  if (error) return <ErrorState message={error} retry={fetchProduct} />;
  if (!product) return null;

  return (
    <div className="container-xxl px-3 px-md-4 py-4 py-md-5">
      {/* --- PRODUCT SECTION --- */}
      <div className="d-md-flex gap-4 align-items-stretch">
        {/* Image */}
        <div className="product-image-wrap col-md-6 col-xl-5 d-flex justify-content-center align-items-center overflow-hidden shadow-sm">
          <Image
            src={product?.image}
            alt={product?.name}
            loading="eager"
            style={{ aspectRatio: "1/1" }}
            className="h-100 w-100"
          />
        </div>
        {/* Info */}
        <div className="col-md-6 col-xl-7 mt-4 mt-md-0">
          <h2 className="fw-bold">{product?.name}</h2>
          <p className="text-muted">{product?.brand}</p>

          <div className="d-flex align-items-center gap-2 mb-2">
            <StarRating rating={averageRating} />
            <span className="pt-1">
              {averageRating?.toFixed(1)} ({totalReviews} reviews)
            </span>
          </div>

          <h4 className="fw-bold mb-1">
            ${discountedPrice}
            {product?.discount > 0 && (
              <small className="text-muted ms-1 text-decoration-line-through">
                ${product?.price?.toFixed(2)}
              </small>
            )}
          </h4>
          {product?.discount > 0 && (
            <p className="text-success">{product?.discount}% off</p>
          )}
          <p
            className={`fw-semibold ${
              product?.stock > 0 ? "text-primary" : "text-danger"
            }`}
          >
            {product?.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          {/* Sizes */}
          <div className="mb-4 position-relative">
            <h6>Size</h6>
            <div className="d-flex gap-2 align-items-center">
              {product?.sizes?.map((size) => (
                <button
                  key={size}
                  className={`btn rounded-3 px-3 py-1 ${
                    selectedSize === size
                      ? "btn-dark text-white"
                      : sizeError
                        ? "btn-outline-danger is-invalid"
                        : "btn-outline-dark"
                  }`}
                  onClick={() => {
                    setSelectedSize(size);
                    setSizeError(null);
                  }}
                  disabled={product?.stock === 0 || !isOnline}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError && (
              <div className="invalid-feedback d-block m-0 small fw-semibold position-absolute">
                *{sizeError}
              </div>
            )}
          </div>

          {/* Colors */}

          <div className="mb-3 d-inline-block">
            <h6>Color</h6>
            <DemoTooltip>
              <div className="d-flex gap-2">
                {["red", "blue", "green", "black", "white"].map((clr) => (
                  <button
                    key={clr}
                    className="rounded-circle border"
                    style={{
                      background: clr,
                      width: "28px",
                      height: "28px",
                    }}
                  />
                ))}
              </div>
            </DemoTooltip>
          </div>

          {/* Quantity */}
          <div className="mb-3">
            <h6>Quantity</h6>
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-light"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                className="btn btn-light"
                onClick={() =>
                  setQuantity((prev) => Math.min(prev + 1, product?.stock))
                }
                disabled={product?.stock === 0}
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              disabled={product?.stock === 0 || adding || !isOnline}
              onClick={handleAddToCart}
            >
              {adding ? (
                <>
                  <Spinner animation="border" size="sm" /> <span>Adding</span>
                </>
              ) : (
                <>
                  <ShoppingCartIcon size={18} /> Add to Cart
                </>
              )}
            </button>

            <button
              className="btn btn-success d-flex align-items-center gap-2"
              disabled={product?.stock === 0 || !isOnline}
              onClick={handleBuyNow}
            >
              <ShoppingBagIcon size={18} /> Buy Now
            </button>
          </div>
          <OfflineNote isOnline={isOnline} />

          {/* Shipping & Returns Flags */}
          <div className="d-flex flex-wrap gap-3 mt-3">
            {product?.freeShipping && <span>✅ Free Shipping</span>}
            {product?.easyReturns && <span>✅ Easy Returns</span>}
          </div>
        </div>
      </div>

      {/* --- DESCRIPTION --- */}
      <section className="my-5">
        {/* desctiption */}
        {product?.description && (
          <>
            <h3>Description</h3>
            <p>{product?.description}</p>
          </>
        )}

        {/* Fabric & Care */}
        {(product?.fabric || product?.care?.length > 0) && (
          <>
            <h5 className="mt-4">Fabric & Care</h5>
            <ul>
              {product?.fabric && <li>{product?.fabric}</li>}
              {product?.care?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </>
        )}

        {/* Size & Fit */}
        {product?.fit && (
          <>
            <h5 className="mt-4">Size & Fit</h5>
            <p>
              {product?.fit} fit.
              <span href="#" className="text-primary small">
                {" "}
                View Size Guide{">>"}
              </span>
            </p>
          </>
        )}

        {/* Specifications */}
        {product?.specifications &&
          Object.keys(product?.specifications)?.length > 0 && (
            <>
              <h5 className="mt-4">Specifications</h5>
              <div
                className="row row-cols-2 g-2 mt-2"
                style={{ maxWidth: "400px" }}
              >
                {Object.entries(product?.specifications)?.map(
                  ([key, value]) => (
                    <React.Fragment key={key}>
                      <div className="fw-semibold">
                        {key.replace(/([A-Z])/g, " $1")} {/* formatting text*/}
                      </div>
                      <div>{value}</div>
                    </React.Fragment>
                  )
                )}
              </div>
            </>
          )}
      </section>

      {/* --- REVIEWS --- */}
      <section className="my-5" id="reviews">
        <h3 className="mb-4">Customer Reviews</h3>

        {/* Rating summary */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <StarRating rating={averageRating} />
          <span className="fw-semibold pt-1">
            {averageRating?.toFixed(1)} out of 5{" "}
            <span className="text-muted">({totalReviews} reviews)</span>
          </span>
        </div>

        {/* Review Button and Form */}
        <ReviewSection
          productId={product?._id}
          product={product}
          refetchProduct={fetchProduct}
        />

        {/* Review List */}
        <ReviewList productId={product?._id} />
      </section>

      {/* --- RELATED PRODUCTS --- */}
      <RelatedProducts category={product?.category} excludeId={product?._id} />
    </div>
  );
};

export default ProductDetail;
