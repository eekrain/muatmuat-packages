import { useLayoutEffect } from "react";

import { useModal } from "./Modal";

export function useRegisterModalPortalNode(node, deps = []) {
  const { registerAllowedNode, unregisterAllowedNode } = useModal?.() || {};

  useLayoutEffect(() => {
    // console.log("useRegisterModalPortalNode effect running", node);
    if (node && registerAllowedNode && unregisterAllowedNode) {
      // console.log("Registering dropdown node", node);
      registerAllowedNode(node);
      return () => {
        // console.log("Unregistering dropdown node", node);
        unregisterAllowedNode(node);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node, registerAllowedNode, unregisterAllowedNode, ...deps]);
}
