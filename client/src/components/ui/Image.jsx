import { Img } from "react-image";
import { ImageOff } from "lucide-react";
import PropTypes from "prop-types";
import "./Image.css";

const Image = ({
  src,
  alt,
  className = "",
  style = {},
  critical = false,
  fit = "contain",
}) => {
  return (
    <div
      className={`image-shell position-relative overflow-hidden ${className}`}
      style={style}
      aria-live="polite"
    >
      <Img
        src={src}
        alt={alt}
        className="w-100 h-100 fade-in"
        style={{ objectFit: fit }}
        loader={
          <div
            className="image-loader"
            role="status"
            aria-label="Loading image"
          />
        }
        unloader={
          <div
            role="img"
            aria-label={critical ? alt : "Image unavailable"}
            className="image-fallback"
          >
            <ImageOff className="fallback-icon" />
            {critical && <p className="fallback-text">{alt}</p>}
          </div>
        }
      />
    </div>
  );
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  critical: PropTypes.bool,
  fit: PropTypes.oneOf(["contain", "cover", "fill", "none", "scale-down"]), // CHANGED
};

export default Image;
