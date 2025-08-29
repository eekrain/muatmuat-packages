import { cn } from "@/lib/utils";

export default function TestStyles() {
  return (
    <div className="space-y-4 p-8">
      <h1 className="mb-4 text-2xl font-bold">Font Size Test</h1>

      <div className="space-y-2">
        <div className="text-xxs">
          text-xxs: This should be 10px with 12px line-height
        </div>
        <div className="text-xs">
          text-xs: This should be 12px with 14.4px line-height
        </div>
        <div className="text-sm">
          text-sm: This should be 14px with 16.8px line-height
        </div>
        <div className="text-base">
          text-base: This should be 16px with 19.2px line-height
        </div>
      </div>

      <hr className="my-8" />

      <h2 className="mb-4 text-xl font-bold">Button Test with cn() function</h2>

      <div className="space-y-2">
        <button
          className={cn(
            "rounded-full border border-transparent bg-neutral-200 px-4 py-1.5 text-xxs font-semibold text-neutral-600 transition-colors duration-200"
          )}
        >
          Button with text-xxs via cn()
        </button>

        <button className="rounded-full border border-transparent bg-neutral-200 px-4 py-1.5 text-xxs font-semibold text-neutral-600 transition-colors duration-200">
          Button with text-xxs direct
        </button>

        <button
          className={cn(
            "rounded-full border border-transparent bg-neutral-200 px-4 py-1.5 text-xs font-semibold text-neutral-600 transition-colors duration-200"
          )}
        >
          Button with text-xs via cn()
        </button>
      </div>
    </div>
  );
}
