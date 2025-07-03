import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

const Context = createContext({
  activeWidthPercent: 0,
});

export const StepperContainer = ({ totalStep, activeIndex, children }) => {
  const containerRef = useRef(null);

  const [titleWidth, setTitleWidth] = useState(110);

  useLayoutEffect(() => {
    // get width of container
    const width = containerRef.current.offsetWidth;
    setTitleWidth(width / totalStep - 10);
  }, [totalStep]);

  useEffect(() => {
    const updateTitleWidth = () => {
      const width = containerRef.current.offsetWidth;
      setTitleWidth(width / totalStep - 10);
    };

    // Initial check
    updateTitleWidth();

    // Add event listener
    window.addEventListener("resize", updateTitleWidth);

    // Clean up
    return () => {
      window.removeEventListener("resize", updateTitleWidth);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Context.Provider value={{ titleWidth, activeIndex }}>
      <div
        ref={containerRef}
        className="h-[64px]"
        style={{
          paddingLeft: `calc(${titleWidth}px / 2 - 16px)`,
          paddingRight: `calc(${titleWidth}px / 2 - 16px)`,
          height: totalStep > 5 ? "80px" : "64px",
        }}
      >
        <div className="relative flex items-start justify-between gap-4">
          {/* Background line */}
          <div className="absolute left-0 top-4 z-0 h-0.5 w-full bg-[#C4C4C4]" />

          {/* Active progress line */}
          {activeIndex > 0 && (
            <div
              className="absolute left-0 top-4 z-10 h-0.5 bg-[#FFC217] transition-all duration-300"
              style={{
                width: `${(activeIndex / (totalStep - 1)) * 100}%`,
                maxWidth: "calc(100% - 32px)",
              }}
            />
          )}

          {children}
        </div>
      </div>
    </Context.Provider>
  );
};

/**
 * @typedef {Object} StepperItem
 * @property {string} label
 * @property {string} status
 * @property {string} icon
 * @property {string} subtitle
 */

/**
 * @param {{
 *  step: StepperItem,
 *  index: number,
 * }} props
 * @returns
 */
export const StepperItem = ({ step, index }) => {
  const { titleWidth, activeIndex } = useContext(Context);

  const status = useMemo(() => {
    if (step?.status && step.status.startsWith("CANCELED")) return "canceled";
    if (index < activeIndex) return "completed";
    if (index === activeIndex) return "active";
    return "inactive";
  }, [step, activeIndex, index]);

  return (
    <div key={index} className="relative z-20 flex flex-col gap-2">
      {/* Step Circle */}
      <div
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-full border border-[#C4C4C4] bg-[#F1F1F1] transition-all duration-300",
          (status === "active" || status === "completed") &&
            "border-[#FFC217] bg-[#FFC217]",
          status === "canceled" && "border-error-400 bg-error-400"
        )}
      >
        <IconComponent
          src={step.icon}
          width={16}
          height={16}
          className={cn(
            "text-neutral-600",
            status !== "inactive" && "text-muat-trans-primary-900",
            status === "canceled" && "text-neutral-50"
          )}
        />

        {/* Step Label */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full text-center text-[12px] font-medium leading-[1.2] text-[#000000]"
          style={{ width: titleWidth }}
        >
          <span className="block h-2 font-semibold">{step.label}</span>
          {step.subtitle && <span className="mt-2 block">{step.subtitle}</span>}
        </div>
      </div>
    </div>
  );
};
