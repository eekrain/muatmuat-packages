import { cn } from "@/lib/utils";

const ResponsiveSection = ({
  appearance = {}, // Fallback for entire appearance object
  title,
  children,
}) => {
  const {
    containerClassName = "", // Fallback for containerClassName
    titleClassname = "", // Fallback for titleClassname
  } = appearance;

  return (
    <div
      className={cn(
        "flex flex-col gap-y-6 bg-neutral-50 px-4 py-5",
        containerClassName
      )}
    >
      {title ? (
        <h1
          className={cn(
            "text-sm font-semibold leading-[1.1] text-neutral-900",
            titleClassname
          )}
        >
          {title}
        </h1>
      ) : null}
      {children}
    </div>
  );
};

export default ResponsiveSection;
