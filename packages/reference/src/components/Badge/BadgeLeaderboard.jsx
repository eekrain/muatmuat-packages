import PropTypes from "prop-types";

import { cn } from "@/lib/utils";

/**
 * A badge component to display a driver's rank in the leaderboard.
 * It features a two-toned circular design and dynamically adjusts its width
 * for ranks with two or more characters.
 */
const BadgeLeaderboard = ({ rank, className }) => {
  // Convert rank to string to safely check its length.
  const rankStr = String(rank);

  return (
    // The outer container creates the gradient border.
    // Flexbox properties are used to center the inner circle.
    <div
      className={cn(
        "flex h-4 items-center justify-center rounded-full p-[1.5px]",
        // Dynamically set the width based on the rank's character count.
        {
          "w-4": rankStr.length < 2, // Default width for single-digit ranks.
          "w-6": rankStr.length >= 2, // Wider for two-digit or more ranks.
        },
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
