"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

// Simple avatar that attempts to load an image and falls back to initials
// derived from the provided `name`. Background color is chosen deterministically
// from the name so the same name gets the same color.
const PALETTE = [
  "#E53E3E",
  "#DD6B20",
  "#D69E2E",
  "#38A169",
  "#3182CE",
  "#805AD5",
  "#D53F8C",
  "#4A5568",
];

function nameToColor(name) {
  if (!name) return PALETTE[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  const idx = Math.abs(hash) % PALETTE.length;
  return PALETTE[idx];
}

function initialsFromName(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1][0] || "")).toUpperCase();
}

const Avatar = ({
  src,
  name = "",
  size = 36,
  className = "",
  alt = "avatar",
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  // reset when src changes
  useEffect(() => setImgFailed(false), [src]);

  const initials = initialsFromName(name);
  const bg = nameToColor(name || initials);

  // Map common sizes to Tailwind classes. Fallback uses 36px classes.
  const SIZE_MAP = {
    24: { wrapper: "w-6 h-6 min-w-[24px] min-h-[24px]", text: "text-xs" },
    32: { wrapper: "w-8 h-8 min-w-[32px] min-h-[32px]", text: "text-sm" },
    36: {
      wrapper: "w-[36px] h-[36px] min-w-[36px] min-h-[36px]",
      text: "text-sm",
    },
    48: { wrapper: "w-12 h-12 min-w-[48px] min-h-[48px]", text: "text-base" },
  };

  const chosen = SIZE_MAP[size] || SIZE_MAP[36];

  const baseWrapper = cn(
    "inline-flex select-none items-center justify-center overflow-hidden rounded-full",
    chosen.wrapper,
    className
  );

  const textClass = cn("font-semibold leading-none text-white", chosen.text);

  if (src && !imgFailed) {
    return (
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={cn(baseWrapper, "object-cover")}
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <div className={cn(baseWrapper)} title={name} style={{ background: bg }}>
      <span className={textClass}>{initials}</span>
    </div>
  );
};

export default Avatar;
