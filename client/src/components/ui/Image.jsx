// All state of image handled
import { Img } from "react-image";
import { ImageOff } from "lucide-react";

/* eslint-disable react/prop-types */
const Image = ({
  src,
  alt,
  className = "",
  style = {},
  fallbackText = "Unable to load image",
}) => {
  return (
    <div
      className={`position-relative overflow-hidden ${className}`}
      style={style}
      aria-live="polite"
    >
      <Img
        src={src}
        loader={
          <div
            className="w-100 h-100 bg-light rounded pulse"
            role="status"
            aria-label="Loading image"
          />
        }
        unloader={
          <div
            role="alert"
            className="w-100 h-100 bg-light d-flex flex-column align-items-center justify-content-center text-center p-3"
          >
            <ImageOff size={56} className="text-muted mb-3" />
            <p className="text-muted mb-0">{fallbackText}</p>
          </div>
        }
        alt={alt}
        className="w-100 h-100 fade-in"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
};

export default Image;
