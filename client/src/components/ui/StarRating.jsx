import { Star } from "lucide-react";
import HalfStar from "../ui/HalfStar";

/* eslint-disable react/prop-types */
const StarRating = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<Star key={i} className="text-warning" fill="currentColor" />); // full star (Bootstrap yellow)
    } else if (rating >= i - 0.5) {
      stars.push(<HalfStar key={i} className="text-warning" />); // half star
    } else {
      stars.push(<Star key={i} className="text-secondary" />); // empty star (gray)
    }
  }

  return <div className="d-flex">{stars}</div>;
};

export default StarRating;
