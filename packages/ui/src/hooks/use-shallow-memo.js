import { useMemo, useRef } from "react";

import { equal as isShallowEqual } from "fast-shallow-equal";

const useCustomCompareMemo = (factory, deps, depsEqual) => {
  const ref = useRef(undefined);

  if (!ref.current || !depsEqual(deps, ref.current)) {
    ref.current = deps;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, ref.current);
};

const shallowEqualDepsList = (prevDeps, nextDeps) =>
  prevDeps.every((dep, index) => isShallowEqual(dep, nextDeps[index]));

export const useShallowMemo = (factory, deps) => {
  return useCustomCompareMemo(factory, deps, shallowEqualDepsList);
};
