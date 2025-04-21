"use client";

import { MouseEvent } from "react";

interface StarRatingProps {
  value: number;
  readonly?: boolean;
  hover?: number;
  onChange?: (rating: number) => void;
  onHoverChange?: (rating: number) => void;
}

export function StarRating({
  value,
  readonly = false,
  hover = 0,
  onChange,
  onHoverChange,
}: StarRatingProps) {
  // Create handler functions to avoid inline function issues
  const handleClick = (rating: number) => (e: MouseEvent) => {
    e.preventDefault();
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = () => {
    if (!readonly && onHoverChange) {
      onHoverChange(hover || value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly && onHoverChange) {
      onHoverChange(0);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-2xl focus:outline-none transition-colors duration-150 ${
              readonly ? "cursor-default" : ""
            }`}
            onClick={handleClick(star)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
          >
            {star <= (hover || value) ? (
              <span className="text-yellow-400">★</span>
            ) : (
              <span className="text-gray-300 hover:text-yellow-200">★</span>
            )}
          </button>
        ))}
      </div>
      {value > 0 && (
        <span className="text-sm font-medium">
          ({value} {value === 1 ? "star" : "stars"})
        </span>
      )}
    </div>
  );
}
