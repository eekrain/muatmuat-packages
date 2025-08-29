import React, { useMemo } from "react";

import PropTypes from "prop-types";
import SVG from "react-inlinesvg";

import style from "./IconComponent.module.scss";

const sizes = {
  xsmall: 12,
  small: 16,
  medium: 24,
  large: 32,
};

const IconComponent = React.memo(
  ({
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
  }) => {
    // Memoize computed values to prevent unnecessary re-renders
    const computedSize = useMemo(
      () => ({
        width: sizes[size] ? sizes[size] : width,
        height: sizes[size] ? sizes[size] : height,
      }),
      [size, width, height]
    );

    const iconSrc = useMemo(() => {
      const srcPath = typeof src === "string" ? src : src.src;
      return process.env.NEXT_PUBLIC_ASSET_REVERSE + srcPath;
    }, [src]);

    const loaderElement = useMemo(
      () =>
        loader ? (
          <span
            className="animate-pulse rounded-sm"
            style={{
              background: "gray",
              width: `${computedSize.width}px`,
              height: `${computedSize.height}px`,
              transform: `rotate(${rotate}deg)`, // Use transform instead of rotate
            }}
          />
        ) : null,
      [loader, computedSize.width, computedSize.height, rotate]
    );

    const buttonStyle = useMemo(
      () => ({
        width: `${computedSize.width}px`,
        height: `${computedSize.height}px`,
      }),
      [computedSize.width, computedSize.height]
    );

    const svgClassName = useMemo(
      () => `${className || ""} ${style[color] || ""}`.trim(),
      [className, color]
    );

    // Interactive element
    if (onClick) {
      return (
        <button style={buttonStyle} onClick={onClick} ref={ref}>
          <SVG
            cacheRequests
            loader={loaderElement}
            src={iconSrc}
            title={title}
            width={computedSize.width}
            height={computedSize.height}
            className={svgClassName}
          />
        </button>
      );
    }

    // Non-interactive element
    return (
      <SVG
        cacheRequests
        loader={loaderElement}
        src={iconSrc}
        title={title}
        width={computedSize.width}
        height={computedSize.height}
        className={svgClassName}
        ref={ref}
      />
    );
  }
);
IconComponent.displayName = "IconComponent";

IconComponent.propTypes = {
  src: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      src: PropTypes.string.isRequired,
    }),
  ]).isRequired,
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "default",
    "danger",
    "white",
    "gray",
  ]),
  size: PropTypes.oneOf(["xsmall", "small", "medium", "large"]),
  title: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  loader: PropTypes.bool,
  rotate: PropTypes.number,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default IconComponent;
