import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

/**
 * Input component with left/right icon, left/right text, and supportive text.
 * Uses Tailwind CSS for styling and cn for class composition.
 *
 * @param {object} props
 * @param {string} [props.name]
 * @param {string} [props.type]
 * @param {string} [props.placeholder]
 * @param {boolean} [props.disabled]
 * @param {"error"|"success"|null} [props.status]
 * @param {{left?: React.ReactNode, right?: React.ReactNode}} [props.icon]
 * @param {{left?: React.ReactNode, right?: React.ReactNode}} [props.text]
 * @param {{title?: string, desc?: string}} [props.supportiveText]
 * @param {{width?: string, maxWidth?: string, minWidth?: string}} [props.width]
 * @param {string} [props.className]
 * @param {string} [props.classInput]
 * @param {any} [props.rest]
 */
const Input = forwardRef(
  (
    {
      name,
      type = "text",
      placeholder = "Placeholder",
      disabled = false,
      icon = { left: null, right: null },
      text = { left: null, right: null },
      errorMessage,
      className,
      appearance = {
        containerClassName: "",
        inputClassName: "",
      },
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("flex w-full flex-col gap-y-2", className)}>
        <div
          className={cn(
            "flex h-8 w-full items-center rounded-md border border-neutral-600 bg-neutral-50 px-3 transition-colors",
            "focus-within:border-primary-700 hover:border-primary-700",
            errorMessage && "border-error-400",
            disabled &&
              "cursor-not-allowed border-neutral-400 bg-neutral-100 opacity-50",
            appearance.containerClassName
          )}
        >
          {icon.left && (
            <div className="mr-2 flex items-center">
              {typeof icon.left === "string" ? (
                <IconComponent
                  loader={false}
                  src={{ src: icon.left }}
                  height={16}
                  width={16}
                  className={cn(errorMessage && "text-error-400")}
                />
              ) : (
                icon.left
              )}
            </div>
          )}
          {text.left && (
            <span className="mr-3 text-xs font-medium leading-[14.4px] text-neutral-900 max-[600px]:text-sm max-[600px]:font-semibold max-[600px]:leading-[15.4px]">
              {text.left}
            </span>
          )}
          <input
            {...props}
            type={type}
            ref={ref}
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full min-w-0 border-none border-transparent bg-transparent text-xs font-medium leading-[14.4px] text-neutral-900 outline-none placeholder:text-neutral-600 max-[600px]:text-sm max-[600px]:font-semibold max-[600px]:leading-[15.4px]",
              appearance.inputClassName
            )}
          />
          {icon.right && (
            <div className="ml-2 flex items-center">
              {typeof icon.right === "string" ? (
                <IconComponent
                  loader={false}
                  src={{ src: icon.right }}
                  height={16}
                  width={16}
                  className={cn(errorMessage && "text-error-400")}
                />
              ) : (
                icon.right
              )}
            </div>
          )}
          {text.right && (
            <span className="ml-3 text-xs font-medium leading-[14.4px] text-neutral-900 max-[600px]:text-sm max-[600px]:font-semibold max-[600px]:leading-[15.4px]">
              {text.right}
            </span>
          )}
        </div>
        {errorMessage && (
          <div className="flex items-center justify-between text-xs font-medium text-error-400">
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
