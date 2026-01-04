import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import publicAxios from "../api/publicAxios";
import { useNavigate } from "react-router-dom";
import Image from "./ui/Image";

// eslint-disable-next-line react/prop-types
const RelatedProducts = ({ category, excludeId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!category) return;
    const fetchRelated = async () => {
      try {
        // excluding the current product in fetching related products
        const { data } = await publicAxios.get(
          `/products/related?category=${category}&exclude=${excludeId}&limit=8`
        );
        setRelatedProducts(data || []); // ✅ backend returns array
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };
    fetchRelated();
  }, [category, excludeId]);

  if (!relatedProducts.length) return null;

  return (
    <section className="my-5">
      <h3 className="mb-3">Related Products</h3>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={16}
        slidesPerView={5} // ✅ default for large screen
        breakpoints={{
          1250: { slidesPerView: 5 }, // desktops / large screens
          992: { slidesPerView: 4 }, // laptops
          700: { slidesPerView: 3 }, // tablets (portrait)
          480: { slidesPerView: 2 }, // mobiles
          360: { slidesPerView: 1 },
        }}
      >
        {relatedProducts.map((product) => {
          const discountedPrice = product.discount
            ? (
                product.price -
                product.price * (product.discount / 100)
              ).toFixed(2)
            : product.price.toFixed(2);

          return (
            <SwiperSlide key={product._id}>
              <div
                className="bg-white border rounded shadow-sm p-2 h-100 d-flex flex-column cursor-pointer"
                onClick={() => navigate(`/products/${product._id}`)}
              >
                <div
                  className="position-relative w-100"
                  style={{ aspectRatio: "1/1", overflow: "hidden" }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="w-100 h-100 rounded bg-secondary"
                  />
                  {product.discount > 0 && (
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                <div className="mt-2 text-start d-flex flex-column justify-content-between flex-grow-1">
                  {/* Product Name → clamp to 2 lines */}
                  <h6
                    className="fw-bold mb-2"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={product.name}
                  >
                    {product.name}
                  </h6>

                  {/* Price always at bottom */}
                  {product.discount > 0 ? (
                    <p className="mb-0">
                      <span className="text-danger fw-bold">
                        ${discountedPrice}
                      </span>{" "}
                      <span className="text-muted text-decoration-line-through small">
                        ${product.price.toFixed(2)}
                      </span>
                    </p>
                  ) : (
                    <p className="mb-0 fw-bold">${product.price.toFixed(2)}</p>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default RelatedProducts;
