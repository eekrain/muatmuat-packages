// From https://github.com/streamich/react-use/blob/master/src/useShallowCompareEffect.ts
import { useEffect, useRef } from "react";

import { equal as isShallowEqual } from "fast-shallow-equal";

const isPrimitive = (val) => val !== Object(val);

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
  if (process.env.NODE_ENV !== "production") {
    if (!(deps instanceof Array) || !deps.length) {
      console.warn(
        "`useShallowCompareEffect` should not be used with no dependencies. Use React.useEffect instead."
      );
    }

    if (deps.every(isPrimitive)) {
      console.warn(
        "`useShallowCompareEffect` should not be used with dependencies that are all primitive values. Use React.useEffect instead."
      );
    }
  }

  useCustomCompareEffect(effect, deps, shallowEqualDepsList);
};
