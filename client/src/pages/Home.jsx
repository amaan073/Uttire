import { useCallback, useEffect, useState } from "react";
import publicAxios from "../api/publicAxios";
import { Link } from "react-router-dom";
import { isValidEmail } from "../utils/validators";

import Card from "../components/ui/Card";
import { ImageOff, ShoppingBagIcon } from "lucide-react";

import home1 from "../assets/images/home1.webp";
import home2 from "../assets/images/home2.webp";
import home3 from "../assets/images/home3.webp";

import LoadingScreen from "../components/ui/LoadingScreen";
import ErrorState from "../components/ui/ErrorState";

import DemoToolTip from "../components/ui/DemoTooltip";
import useOnlineStatus from "../hooks/useOnlineStatus";
import OfflineNote from "../components/ui/OfflineNote";

// Normalizes product data to ensure all required fields have default values
const normalizeProduct = (product) => {
  if (!product) return null;

  return {
    _id: product?._id ?? "",
    image: product?.image ?? "",
    name: product?.name ?? "Unnamed Product",
    discount: product?.discount ?? 0,
    price: product?.price ?? 0,
    brand: product?.brand ?? "",
    sizes: Array.isArray(product?.sizes) ? product.sizes : [],
    stock: product?.stock ?? 0,
    reviews: Array.isArray(product?.reviews) ? product.reviews : [],
  };
};

const Home = () => {
  const isOnline = useOnlineStatus();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // track static image preload
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imageErrors, setImageErrors] = useState({
    home1: false,
    home2: false,
    home3: false,
  });

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  const handleUnsubscribe = () => {
    setSubscribed(false);
    setEmail("");
  };

  const preloadImages = useCallback(() => {
    const images = [home1, home2, home3];
    let loadedCount = 0;

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) setImagesLoaded(true);
      };
      img.onerror = () => {
        loadedCount++; // ignore error
        if (loadedCount === images.length) setImagesLoaded(true);
      };
    });
  }, []);

  // Fetch Featured Products
  const fetchFeatured = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await publicAxios.get("/products/featured");
      setFeaturedProducts(data ?? []);
    } catch (error) {
      console.error("Error fetching featured products:", error);

      // codes from global interceptors of publicAxios
      if (error.code === "OFFLINE_ERROR" || error.code === "NETWORK_ERROR") {
        setError("Couldn't reach server. Check your connection and try again.");
      } else {
        // Server returned valid error
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    preloadImages(); // Preload static images first
    fetchFeatured(); // Begin fetching
  }, [preloadImages, fetchFeatured]);

  // ======= Full Page Loading & Error Handling ========
  if (!imagesLoaded || loading) return <LoadingScreen />;
  if (error) return <ErrorState message={error} retry={fetchFeatured} />;

  return (
    <>
      <div
        className="container-fluid text-center pb-3 px-0"
        style={{ maxWidth: "1600px" }}
      >
        <div className="home-header textured-bg py-3">
          <h1 className="main-logo-txt">Uttire</h1>
          <p
            className="my-2 mx-auto px-3"
            style={{ fontSize: "min(1.1rem,4vw)", color: "#fdf3e7db" }}
          >
            Welcome to Uttire! Explore our collection of stylish and comfortable
            clothing.
          </p>
          <div className="btn btn-outline-light mt-2 mb-4 mb-md-4">
            <Link
              to="/shop"
              style={{ all: "unset" }}
              className="d-flex align-items-center gap-1"
            >
              <ShoppingBagIcon />
              Shop Now
            </Link>
          </div>
        </div>

        {/*Home page Cover  */}
        <div className="home-cover d-flex w-100" style={{ height: "700px" }}>
          {[
            { src: home1, key: "home1" },
            { src: home2, key: "home2" },
            { src: home3, key: "home3" },
          ].map(({ src, key }) => (
            <div key={key} className="w-100">
              {!imageErrors[key] ? (
                <img
                  src={src}
                  alt="Home Cover"
                  className="h-100 w-100 object-fit-cover"
                  onError={() =>
                    setImageErrors((prev) => ({ ...prev, [key]: true }))
                  }
                />
              ) : (
                <div
                  role="img"
                  className="h-100 w-100 text-secondary d-flex justify-content-center align-items-center bg-light border"
                >
                  <div>
                    <ImageOff size={42} />
                    <div className="text-center px-2">Unable to load image</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Featured Product */}
        <div className="my-5 mx-1 mx-sm-3">
          <h2 className="text-md-start mb-5 fw-bold">Featured Products</h2>
          <div className="featured-products-grid">
            {featuredProducts.map((product) => {
              const normalizedProduct = normalizeProduct(product);
              return (
                <Card
                  key={normalizedProduct?._id ?? ""}
                  product={normalizedProduct}
                  className="text-start text-sm-center mb-4 mb-sm-0"
                />
              );
            })}
          </div>
        </div>
        {/* Newsletter subsciption */}
        <div className="card shadow-sm border-0 rounded-3 p-4 bg-light">
          <div className="card-body text-center">
            <h4 className="card-title mb-3">📩 Stay Updated</h4>
            <p className="text-muted mb-4">
              Subscribe to our newsletter for the latest updates and exclusive
              offers.
            </p>

            {!subscribed ? (
              <form
                onSubmit={handleSubscribe}
                className="d-flex flex-column flex-sm-row gap-2 justify-content-center"
                noValidate
              >
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  style={{ maxWidth: "400px" }}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <DemoToolTip>
                  <button
                    type="submit"
                    className="btn btn-dark"
                    disabled={!isValidEmail(email) || !isOnline}
                  >
                    Subscribe
                  </button>
                </DemoToolTip>
              </form>
            ) : (
              <div className="mt-3">
                <p className="text-success fw-semibold">
                  ✅ Subscribed as {email}
                </p>
                <DemoToolTip>
                  <button
                    onClick={handleUnsubscribe}
                    className="btn btn-outline-danger btn-sm"
                  >
                    Unsubscribe
                  </button>
                </DemoToolTip>
              </div>
            )}
            <OfflineNote isOnline={isOnline} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
