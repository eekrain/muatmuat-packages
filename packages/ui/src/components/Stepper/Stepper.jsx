import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useClientHeight } from "@/hooks/use-client-height";
import useDevice from "@/hooks/use-device";
import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

const Context = createContext({
  activeWidthPercent: 0,
});

export const StepperContainer = ({ totalStep, activeIndex, children }) => {
  const containerRef = useRef(null);
  const { isMobile } = useDevice();

  const [titleWidth, setTitleWidth] = useState(110);
  const [titleHeights, setTitleHeights] = useState([]);

  useEffect(() => {
    const updateTitleWidth = () => {
      const width = containerRef.current.offsetWidth;
      setTitleWidth(width / totalStep - 16);
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

  const maxTitleHeight = Math.max(...titleHeights);

  return (
    <Context.Provider
      value={{ titleWidth, activeIndex, titleHeights, setTitleHeights }}
    >
      <div
        ref={containerRef}
        style={
          !isMobile
            ? {
                paddingLeft: `calc(${titleWidth}px / 2 - 16px)`,
                paddingRight: `calc(${titleWidth}px / 2 - 16px)`,
                height: `${32 + 8 + maxTitleHeight - 0}px`,
              }
            : {
                paddingLeft: `calc(${titleWidth}px / 2 - 14px)`,
                paddingRight: `calc(${titleWidth}px / 2 - 14px)`,
                height: `${28 + 8 + maxTitleHeight - 6}px`,
              }
        }
      >
        <div className="relative flex items-start justify-between gap-4">
          {/* Background line */}
          <div className="absolute left-0 top-3 h-0.5 w-full bg-[#C4C4C4] md:top-4" />

          {/* Active progress line */}
          {activeIndex > 0 && (
            <div
              className="absolute left-0 top-3 h-0.5 bg-[#FFC217] transition-all duration-300 md:top-4"
              style={{
                width: `${(activeIndex / (totalStep - 1)) * 100}%`,
                maxWidth: !isMobile ? "calc(100% - 32px)" : undefined,
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
  const { t } = useTranslation();
  const { titleWidth, activeIndex, setTitleHeights } = useContext(Context);

  const status = useMemo(() => {
    if (step?.status && step.status.startsWith("CANCELED")) return "canceled";
    if (index < activeIndex) return "completed";
    if (index === activeIndex) return "active";
    return "inactive";
  }, [step, activeIndex, index]);

  const { ref: titleRef, height: currentTitleHeight } = useClientHeight();

  useEffect(() => {
    if (currentTitleHeight) {
      setTitleHeights((prev) => [...prev, currentTitleHeight]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTitleHeight]);

  return (
    <div key={index} className="relative flex flex-col gap-2">
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
          ref={titleRef}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full text-center text-xs font-medium leading-[1.2] text-[#000000]"
          style={{ width: titleWidth }}
        >
          <span className="block text-center font-semibold">
            {t(step.label)}
          </span>
          {step.subtitle && <div className="mt-2">{step.subtitle}</div>}
        </div>
      </div>
    </div>
  );
};

/**
 * Responsive version of StepperItem that only renders the step circle with icon
 * without any title or subtitle elements
 * @param {{
 *  step: StepperItem,
 *  index: number,
 * }} props
 * @returns
 */
export const StepperItemResponsive = ({ step, index }) => {
  const { titleWidth, activeIndex, setTitleHeights } = useContext(Context);

  const statusCode = useMemo(() => {
    if (step?.status && step.status.startsWith("CANCELED")) return "canceled";
    if (index < activeIndex) return "completed";
    if (index === activeIndex) return "active";
    return "inactive";
  }, [step?.status, activeIndex, index]);

  const { ref: titleRef, height: currentTitleHeight } = useClientHeight();

  useEffect(() => {
    if (currentTitleHeight) {
      setTitleHeights((prev) => [...prev, currentTitleHeight]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTitleHeight]);

  return (
    <div key={index} className="relative flex flex-col gap-2">
      {/* Step Circle */}
      <div
        className={cn(
          "relative flex h-7 w-7 items-center justify-center rounded-full border border-[#C4C4C4] bg-[#F1F1F1] transition-all duration-300",
          (statusCode === "active" || statusCode === "completed") &&
            "border-[#FFC217] bg-[#FFC217]",
          statusCode === "canceled" && "border-error-400 bg-error-400"
        )}
      >
        <IconComponent
          src={step?.icon}
          width={20}
          height={20}
          className={cn(
            "text-neutral-600",
            statusCode !== "inactive" && "text-muat-trans-secondary-900",
            statusCode === "canceled" && "text-neutral-50"
          )}
        />
        {/* Step Label */}
        <div
          ref={titleRef}
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full text-center text-xxs font-medium leading-[1.2] text-[#000000]"
          style={{ width: titleWidth }}
        >
          {step?.subtitle && <div className="mt-2">{step?.subtitle}</div>}
        </div>
      </div>
    </div>
  );
};

const StepperContext = createContext({
  activeIndex: 0,
  totalStep: 0,
});

/**
 * Vertical Stepper Container with dotted connecting lines
 * @param {Object} props
 * @param {number} props.totalStep - Total number of steps
 * @param {number} props.activeIndex - Currently active step index
 * @param {React.ReactNode} props.children - StepperItem components
 * @param {string} [props.className] - Additional CSS classes
 */
export const VerticalStepperContainer = ({
  totalStep,
  activeIndex,
  children,
  className = "",
}) => {
  return (
    <StepperContext.Provider value={{ activeIndex, totalStep }}>
      <div className={`flex flex-col ${className}`}>
        {React.Children.map(children, (child, index) => (
          <div key={index} className="relative">
            {React.cloneElement(child, {
              index,
              isLast: index === totalStep - 1,
              isFirst: index === 0,
            })}
          </div>
        ))}
      </div>
    </StepperContext.Provider>
  );
};

/**
 * @typedef {Object} StepperItemData
 * @property {string} label - Step label
 * @property {string} [status] - Step status (CANCELED, etc.)
 * @property {string|React.ReactNode} icon - Step icon
 * @property {string} [subtitle] - Step subtitle
 */

/**
 * Vertical Stepper Item with dotted connecting lines
 * @param {Object} props
 * @param {StepperItemData} props.step - Step data
 * @param {number} [props.index] - Step index (auto-provided)
 * @param {boolean} [props.isLast] - Is last step (auto-provided)
 * @param {boolean} [props.isFirst] - Is first step (auto-provided)
 * @param {React.ReactNode} [props.children] - Additional content below the step
 * @param {string} [props.className] - Additional CSS classes
 */
export const VerticalStepperItem = ({
  step,
  index = 0,
  isLast = false,
  isFirst = false,
  children,
  className = "",
}) => {
  const { t } = useTranslation();
  const { activeIndex } = useContext(StepperContext);
  const { isMobile } = useDevice();

  const status = useMemo(() => {
    if (step?.status && step.status.startsWith("CANCELED")) return "canceled";
    if (index < activeIndex) return "completed";
    if (index === activeIndex) return "active";
    return "inactive";
  }, [step, activeIndex, index]);

  const { ref: contentRef, height: contentHeight } = useClientHeight();

  return (
    <div
      className={`relative flex gap-4 ${className}`}
      style={{ paddingBottom: isLast ? 0 : 24 }}
    >
      {/* Timeline column */}
      <div className="relative flex flex-col items-center">
        {/* Connecting line from previous step */}
        {!isFirst && (
          <div className="relative h-6 w-0.5">
            {/* Dotted line - abu-abu */}
            <div
              className="absolute left-0 top-0 h-full w-0.5"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, #C4C4C4 0, #C4C4C4 4px, transparent 4px, transparent 8px)",
                backgroundSize: "1px 8px",
              }}
            />

            {/* Active progress line - kuning untuk step yang sudah selesai */}
            {index <= activeIndex && (
              <div
                className="absolute left-0 top-0 h-full w-0.5 transition-all duration-300"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, #FFC217 0, #FFC217 4px, transparent 4px, transparent 8px)",
                  backgroundSize: "1px 8px",
                }}
              />
            )}
          </div>
        )}

        {/* Step Circle */}
        <div
          className={cn(
            "relative z-10 flex items-center justify-center rounded-full border transition-all duration-300",
            !isMobile ? "h-4 w-4" : "h-7 w-7",
            "border-[#C4C4C4] bg-[#F1F1F1]",
            (status === "active" || status === "completed") &&
              "border-[#FFC217] bg-[#FFC217]",
            status === "canceled" && "border-red-400 bg-red-400"
          )}
        >
          <IconComponent
            src={step.icon}
            width={!isMobile ? 16 : 14}
            height={!isMobile ? 16 : 14}
            className={cn(
              "text-neutral-600",
              status !== "inactive" && "text-yellow-900",
              status === "canceled" && "text-neutral-50"
            )}
          />
        </div>

        {/* Connecting line to next step */}
        {!isLast && (
          <div
            className="absolute left-1/2 h-full w-0.5 -translate-x-1/2 transform"
            style={{
              top: !isMobile ? "16px" : "28px", // Start after circle
            }}
          >
            {/* Dotted line - abu-abu */}
            <div
              className="absolute left-0 top-0 h-full w-0.5"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, #C4C4C4 0, #C4C4C4 4px, transparent 4px, transparent 8px)",
                backgroundSize: "1px 8px",
              }}
            />

            {/* Active progress line - kuning untuk step yang sudah selesai */}
            {index < activeIndex && (
              <div
                className="absolute left-0 top-0 h-full w-0.5 transition-all duration-300"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, #FFC217 0, #FFC217 4px, transparent 4px, transparent 8px)",
                  backgroundSize: "1px 8px",
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Content column */}
      <div ref={contentRef} className="flex-1 pb-6">
        {/* Step label and subtitle */}
        <div className="mb-2">
          <div
            className={cn(
              "font-semibold text-[#000000]",
              !isMobile ? "text-sm" : "text-xs"
            )}
          >
            {t(step.label)}
          </div>
          {step.subtitle && (
            <div
              className={cn(
                "mt-1 text-gray-600",
                !isMobile ? "text-xs" : "text-xs"
              )}
            >
              {step.subtitle}
            </div>
          )}
        </div>

        {/* Additional content */}
        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
};

/**
 * Responsive version - simplified stepper item
 */
export const VerticalStepperItemResponsive = ({
  step,
  index = 0,
  isLast = false,
  isFirst = false,
  children,
  className = "",
}) => {
  const { activeIndex } = useContext(StepperContext);

  const statusCode = useMemo(() => {
    if (step?.status && step.status.startsWith("CANCELED")) return "canceled";
    if (index < activeIndex) return "completed";
    if (index === activeIndex) return "active";
    return "inactive";
  }, [step?.status, activeIndex, index]);

  const { ref: contentRef, height: contentHeight } = useClientHeight();

  const lineHeight = useMemo(() => {
    if (children && contentHeight > 0) {
      return Math.max(contentHeight + 20, 60);
    }
    return 60;
  }, [contentHeight, children]);

  return (
    <div className={`relative flex gap-3 ${className}`}>
      {/* Timeline column */}
      <div className="flex flex-col items-center">
        {/* Connecting line from previous step */}
        {!isFirst && (
          <div className="relative h-5 w-0.5">
            <div
              className="absolute left-0 top-0 h-full w-0.5"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, #C4C4C4 0, #C4C4C4 3px, transparent 3px, transparent 6px)",
                backgroundSize: "1px 6px",
              }}
            />
            {index <= activeIndex && (
              <div
                className="absolute left-0 top-0 h-full w-0.5 transition-all duration-300"
                style={{
                  backgroundImage:
                    index <= activeIndex
                      ? "repeating-linear-gradient(to bottom, #FFC217 0, #FFC217 3px, transparent 3px, transparent 6px)"
                      : "none",
                  backgroundSize: "1px 6px",
                }}
              />
            )}
          </div>
        )}

        {/* Step Circle */}
        <div
          className={cn(
            "relative z-10 flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300",
            "border-[#C4C4C4] bg-[#F1F1F1]",
            (statusCode === "active" || statusCode === "completed") &&
              "border-[#FFC217] bg-[#FFC217]",
            statusCode === "canceled" && "border-red-400 bg-red-400"
          )}
        >
          <IconComponent
            src={step?.icon}
            width={12}
            height={12}
            className={cn(
              "text-neutral-600",
              statusCode !== "inactive" && "text-yellow-900",
              statusCode === "canceled" && "text-neutral-50"
            )}
          />
        </div>

        {/* Connecting line to next step */}
        {!isLast && (
          <div className="relative w-0.5" style={{ height: lineHeight }}>
            <div
              className="absolute left-0 top-0 h-full w-0.5"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, #C4C4C4 0, #C4C4C4 3px, transparent 3px, transparent 6px)",
                backgroundSize: "1px 6px",
              }}
            />
            {index < activeIndex && (
              <div
                className="absolute left-0 top-0 h-full w-0.5 transition-all duration-300"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, #FFC217 0, #FFC217 3px, transparent 3px, transparent 6px)",
                  backgroundSize: "1px 6px",
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Content column */}
      <div ref={contentRef} className="flex-1 pb-4">
        {step?.subtitle && (
          <div className="mb-2 text-xs font-medium text-[#000000]">
            {step?.subtitle}
          </div>
        )}

        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
};
