"use client";

import * as React from "react";

import debounce from "lodash.debounce";

export function useUnmount(func) {
  const funcRef = React.useRef(func);

  funcRef.current = func;

  React.useEffect(
    () => () => {
      funcRef.current();
    },
    []
  );
}

export function useDebounceCallback(func, delay = 500, options) {
  const debouncedFunc = React.useRef(null);

  useUnmount(() => {
    if (debouncedFunc.current) {
      debouncedFunc.current.cancel();
    }
  });

  const debounced = React.useMemo(() => {
    const debouncedFuncInstance = debounce(func, delay, options);

    const wrappedFunc = (...args) => {
      return debouncedFuncInstance(...args);
    };

    wrappedFunc.cancel = () => {
      debouncedFuncInstance.cancel();
    };

    wrappedFunc.isPending = () => {
      return !!debouncedFunc.current;
    };

    wrappedFunc.flush = () => {
      return debouncedFuncInstance.flush();
    };

    return wrappedFunc;
  }, [func, delay, options]);

  React.useEffect(() => {
    debouncedFunc.current = debounce(func, delay, options);
  }, [func, delay, options]);

  return debounced;
}
