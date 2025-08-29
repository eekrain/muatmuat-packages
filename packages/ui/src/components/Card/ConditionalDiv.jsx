"use client";

import { Children, useEffect, useState } from "react";

// This component will hide itself if it has no children
// Great for items which has multiple conditional rendered component / element
export const ConditionalDiv = ({ className, children, ...props }) => {
  const [hasChildren, setHasChildren] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const childElements = Children.toArray(children);
      console.log("🚀 ~ useEffect ~ childElements:", childElements);
      // Check if any child elements are actually rendered (not null/undefined)
      const hasRenderedChildren = childElements.some(
        (child) => child !== null && child !== undefined
      );
      setHasChildren(hasRenderedChildren);
    }
  }, [children, mounted]);

  if (!hasChildren) return null;

  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};
