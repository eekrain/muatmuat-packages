import { cn } from "@/lib/utils";

const Section = ({ className, title, children }) => {
  return (
    <div
      className={cn("flex flex-col gap-y-6 bg-neutral-50 px-4 py-5", className)}
    >
      {title ? (
        <h1 className="text-base font-bold leading-[1.1] text-neutral-900">
          {title}
        </h1>
      ) : null}
      {children}
    </div>
  );
};

export default Section;
