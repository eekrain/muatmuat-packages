import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { useModal } from "./Modal";

/**
 * Hook to register a node with the modal system to prevent modal closure on clicks.
 * Automatically handles callback ref logic for immediate node registration.
 *
 * @param {Array} deps - Dependencies array to trigger re-registration
 * @returns {Function} Callback ref function to attach to the dropdown element
 */
export function useRegisterModalPortalNode(deps = []) {
  const { registerAllowedNode, unregisterAllowedNode } = useModal?.() || {};
  const lastNodeRef = useRef(null);
  const [dropdownNode, setDropdownNode] = useState(null);
  const ref = useRef(null);

  // Create callback ref that captures the node and updates state
  const setDropdownRef = useCallback((node) => {
    ref.current = node;
    setDropdownNode(node);
  }, []);

  useLayoutEffect(() => {
    // Validate that we have a proper DOM node
    const isValidNode =
      dropdownNode && typeof dropdownNode.contains === "function";

    if (isValidNode && registerAllowedNode && unregisterAllowedNode) {
      // Only register if it's a different node
      if (lastNodeRef.current !== dropdownNode) {
        if (lastNodeRef.current) {
          unregisterAllowedNode(lastNodeRef.current);
        }
        registerAllowedNode(dropdownNode);
        lastNodeRef.current = dropdownNode;
      }
    } else if (!isValidNode && lastNodeRef.current && unregisterAllowedNode) {
      // Unregister if node becomes invalid
      unregisterAllowedNode(lastNodeRef.current);
      lastNodeRef.current = null;
    }

    return () => {
      if (lastNodeRef.current && unregisterAllowedNode) {
        unregisterAllowedNode(lastNodeRef.current);
        lastNodeRef.current = null;
      }
    };
  }, [dropdownNode, registerAllowedNode, unregisterAllowedNode, ...deps]);

  return setDropdownRef;
}
