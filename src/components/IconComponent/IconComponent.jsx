import PropTypes from "prop-types";
import SVG from "react-inlinesvg";

import style from "./IconComponent.module.scss";

const sizes = {
  small: 16,
  medium: 24,
  large: 32,
};

function IconComponent({
  src,
  color = "default",
  size,
  title,
  height = 16,
  width = 16,
  loader = true,
  rotate = 0,
  className,
  onClick,
  ref,
}) {
  // interactive element,
  if (onClick)
    return (
      <button
        style={{
          width: `${sizes[size] ? sizes[size] : width}px`,
          height: `${sizes[size] ? sizes[size] : height}px`,
        }}
        onClick={onClick}
      >
        <SVG
          cacheRequests
          loader={
            loader && (
              <span
                className={"animate-pulse rounded-sm"}
                style={{
                  background: "gray",
                  width: `${sizes[size] ? sizes[size] : width}px`,
                  height: `${sizes[size] ? sizes[size] : height}px`,
                  rotate: rotate,
                }}
              ></span>
            )
          }
          src={
            typeof src === "string"
              ? process.env.NEXT_PUBLIC_ASSET_REVERSE + src
              : process.env.NEXT_PUBLIC_ASSET_REVERSE + src.src
          }
          title={title}
          width={sizes[size] ? sizes[size] : width}
          height={sizes[size] ? sizes[size] : height}
          className={`${className} ${style[color]}`}
        />
      </button>
    );
  // not interactive element
  return (
    <SVG
      cacheRequests
      loader={
        loader && (
          <span
            className={"animate-pulse rounded-sm"}
            style={{
              background: "gray",
              width: `${sizes[size] ? sizes[size] : width}px`,
              height: `${sizes[size] ? sizes[size] : height}px`,
              rotate: rotate,
            }}
          ></span>
        )
      }
      src={
        typeof src === "string"
          ? process.env.NEXT_PUBLIC_ASSET_REVERSE + src
          : process.env.NEXT_PUBLIC_ASSET_REVERSE + src.src
      }
      title={title}
      width={sizes[size] ? sizes[size] : width}
      height={sizes[size] ? sizes[size] : height}
      className={`${className} ${style[color]}`}
    />
  );
}

export default IconComponent;

IconComponent.propTypes = {
  src: PropTypes.string.isRequired,
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "default",
    "danger",
    "white",
    "gray",
  ]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  title: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  loader: PropTypes.bool,
  rotate: PropTypes.oneOfType([
    PropTypes.oneOf([0, 45, 90, 135, 180, 225, 270, 315, 360]),
    PropTypes.number,
  ]),
  className: PropTypes.string,
  onClick: PropTypes.func,
};
