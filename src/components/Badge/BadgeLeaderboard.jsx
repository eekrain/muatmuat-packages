// src/components/Badge/BadgeLeaderboard.jsx
import PropTypes from "prop-types";

import { cn } from "@/lib/utils";

/**
 * A badge component to display a driver's rank in the leaderboard.
 * It features a two-toned circular design with CSS gradients for the background and border.
 */
const BadgeLeaderboard = ({ rank, className }) => {
  return (
    // The outer container creates the gradient border.
    // Flexbox properties are used to center the inner circle.
    <div
      className={cn(
        "flex h-4 w-4 items-center justify-center rounded-full p-[1.5px]",
        // Gold Gradient for the border
        "bg-[linear-gradient(to_bottom,#D29A00,#FFD664,#D09C0C,#FFDA71)]",
        className
      )}
    >
      {/* The inner container holds the content and has its own gradient background. */}
      <div
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full",
          // Yellow Gradient for the main background
          "bg-[linear-gradient(to_bottom,#FFBC00,#FFD14F)]"
        )}
      >
        <span className="text-xs font-bold text-muat-trans-secondary-900">
          {rank}
        </span>
      </div>
    </div>
  );
};

BadgeLeaderboard.propTypes = {
  /**
   * The rank number to display inside the badge.
   */
  rank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /**
   * Optional additional class names for custom styling.
   */
  className: PropTypes.string,
};

BadgeLeaderboard.defaultProps = {
  className: "",
};

export default BadgeLeaderboard;
