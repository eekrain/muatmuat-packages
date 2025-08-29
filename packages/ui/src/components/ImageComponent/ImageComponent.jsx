"use client";

import Image from "next/image";

/**
 * @typedef {Object} ImageProps
 * @property {string} [src=""] - The path or URL to the image
 * @property {number} [width=100] - The width of the image in pixels
 * @property {number} [height=100] - The height of the image in pixels
 * @property {string} [alt="alt"] - Alt text for the image
 * @property {string} [className] - CSS class name
 * @property {number} [quality] - The quality of the optimized image, an integer 1-100
 * @property {boolean} [priority] - True if image should be prioritized for loading
 * @property {boolean} [loading] - "lazy" | "eager"
 * @property {boolean} [unoptimized] - True if image should be unoptimized
 * @property {string} [blurDataURL] - Base64-encoded image placeholder
 * @property {'fill' | 'contain' | 'cover' | 'none' | 'scale-down'} [objectFit] - CSS object-fit property
 * @property {'blur' | 'empty' | 'color'} [placeholder] - Placeholder type while loading
 * @property {(error: Error) => void} [onError] - Error handler
 * @property {() => void} [onLoad] - Load complete handler
 * @property {string[]} [sizes] - Responsive size hints
 */

/**
 * A wrapper component around Next.js Image with custom source URL handling
 * @param {ImageProps & Omit<React.ComponentProps<'img'>, keyof ImageProps>} props
 * @returns {JSX.Element}
 */
function ImageComponent({
  src = "",
  width = 100,
  height = 100,
  alt = "alt",
  className,
  ...props
}) {
  const source = src?.includes("https")
    ? src
    : process.env.NEXT_PUBLIC_ASSET_REVERSE +
      (src.startsWith("/") ? src : `/${src}`);

  return (
    <Image
      src={source}
      width={width}
      height={height}
      className={className}
      alt={alt}
      {...props}
    />
  );
}

export default ImageComponent;
