"use client";

import Image from "next/image";

function ImageComponent({
  src = "",
  width = 100,
  height = 100,
  alt,
  className,
  ...props
}) {
  const source = src?.includes("https")
    ? src
    : process.env.NEXT_PUBLIC_ASSET_REVERSE +
      (src.startsWith("/") ? src : `/${src}`);
  console.log("source", source);
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
