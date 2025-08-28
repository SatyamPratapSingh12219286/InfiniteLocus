import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({ value, onChange, readonly = false, size = "md" }: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-2xl"
  };

  const handleStarClick = (rating: number) => {
    if (!readonly) {
      onChange(rating);
    }
  };

  const handleStarHover = (rating: number) => {
    if (!readonly) {
      setHoveredRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoveredRating(0);
    }
  };

  const getStarClass = (starNumber: number) => {
    const isActive = starNumber <= (hoveredRating || value);
    return `star ${isActive ? 'filled' : ''} ${sizeClasses[size]} ${readonly ? 'cursor-default' : 'cursor-pointer'}`;
  };

  return (
    <div 
      className="star-rating" 
      onMouseLeave={handleMouseLeave}
      data-testid="star-rating"
    >
      {[1, 2, 3, 4, 5].map((starNumber) => (
        <span
          key={starNumber}
          className={getStarClass(starNumber)}
          onClick={() => handleStarClick(starNumber)}
          onMouseEnter={() => handleStarHover(starNumber)}
          data-testid={`star-${starNumber}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}
