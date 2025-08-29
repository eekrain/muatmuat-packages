// From https://github.com/streamich/react-use/blob/master/src/useShallowCompareEffect.ts
import { useEffect, useRef } from "react";

import { equal as isShallowEqual } from "fast-shallow-equal";

const useCustomCompareEffect = (effect, deps, depsEqual) => {
  const ref = useRef(undefined);

  if (!ref.current || !depsEqual(deps, ref.current)) {
    ref.current = deps;
  }

  useEffect(effect, ref.current);
};

const shallowEqualDepsList = (prevDeps, nextDeps) =>
  prevDeps.every((dep, index) => isShallowEqual(dep, nextDeps[index]));

export const useShallowCompareEffect = (effect, deps) => {
  useCustomCompareEffect(effect, deps, shallowEqualDepsList);
};
