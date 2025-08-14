import { cn } from "@/lib/utils";

const bulletStyles = {
  muat: "border-[#FFC217] bg-[#461B02]",
  bongkar: "border-[#461B02] bg-neutral-50",
};

/**
 * @typedef {object} LocationPointProps
 * @property {string} title - The smaller text appearing on the top line (e.g., "Lokasi Muat").
 * @property {string} subtitle - The larger, bolded text on the bottom line (e.g., "Kota Surabaya, Kec. Tegalsari").
 * @property {string} [className] - Optional additional class names for the root element.
 */

/**
 * A component to display a location point with a custom icon and two lines of text.
 * It's designed based on the provided Figma specifications, featuring an icon
 * created with a border to avoid nested divs.
 * @param {LocationPointProps} props
 */
const LocationPoint = ({ title, subtitle, className, type = "muat" }) => {
  return (
    <div className={cn("flex basis-1/2 items-center gap-[4.5px]", className)}>
      {/* Icon implementation:
        - A single div is used as requested.
        - `box-content` ensures the border is added outside the element's dimensions.
        - `h-[4.5px] w-[4.5px]` sets the size of the inner dot.
        - `border-[3.75px]` creates the outer ring. The width is calculated as (12px - 4.5px) / 2.
        - `bg-[#461B02]` is the color of the inner dot.
        - `border-[#FFC217]` is the color of the outer ring.
      */}
      <div
        className={cn(
          "box-content h-[4.5px] w-[4.5px] rounded-full border-[3.75px]",
          bulletStyles[type]
        )}
      />

      <div className="flex flex-col">
        <p className="text-[8px] font-medium leading-[1.3] text-[#000000]">
          {title}
        </p>
        <p className="text-xxs font-semibold leading-[1.3] text-[#000000]">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default LocationPoint;
