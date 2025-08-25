import { forwardRef } from "react";

import { X } from "lucide-react";

import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

/**
 * Input component with left/right icon, left/right text, and error message support.
 * Uses Tailwind CSS for styling and cn for class composition.
 *
 * @typedef {Object} InputIcon
 * @property {React.ReactNode|string} [left] - Left icon element or icon source string
 * @property {React.ReactNode|string} [right] - Right icon element or icon source string
 *
 * @typedef {Object} InputText
 * @property {React.ReactNode} [left] - Text to display on the left side
 * @property {React.ReactNode} [right] - Text to display on the right side
 *
 * @typedef {Object} InputAppearance
 * @property {string} [containerClassName] - Additional classes for the container element
 * @property {string} [inputClassName] - Additional classes for the input element
 *
 * @typedef {Object} InputProps
 * @property {string} [name] - Input name attribute
 * @property {"text"|"password"|"email"|"number"|"tel"|"url"} [type="text"] - Input type
 * @property {string} [placeholder="Placeholder"] - Input placeholder text
 * @property {string} [value] - Input value for controlled components
 * @property {boolean} [disabled=false] - Whether the input is disabled
 * @property {InputIcon} [icon] - Left and right icon configuration
 * @property {InputText} [text] - Left and right text configuration
 * @property {string} [errorMessage] - Error message to display
 * @property {string} [className] - Additional classes for the root element
 * @property {InputAppearance} [appearance] - Appearance configuration
 * @property {boolean} [hideErrorMessage=false] - Whether to hide error message
 * @property {(value: string) => void} [onChange] - Change event handler
 * @property {boolean} [positiveOnly=false] - For number inputs, whether to allow only positive values
 * @property {boolean} [withReset=false] - Whether to show a reset (X) button when input has value
 *
 * @param {InputProps} props
 * @param {import('react').Ref<HTMLInputElement>} ref
 * @returns {JSX.Element}
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
      className,
      maxLength,
      appearance = {
        containerClassName: "",
        inputClassName: "",
        errorMessageClassName: "",
        supportiveTextClassName: "",
        iconClassName: "",
      },
      errorMessage,
      hideErrorMessage = false,
      supportiveText,
      onChange,
      positiveOnly = false,
      withReset = false,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation();

    return (
      <div className={cn("flex w-full flex-col gap-y-2", className)}>
        <div
          className={cn(
            "flex h-8 w-full items-center rounded-md border border-neutral-600 bg-neutral-50 px-3 transition-colors",
            "focus-within:border-primary-700 hover:border-primary-700",
            errorMessage && "border-error-400",
            appearance.containerClassName,
            disabled
              ? "cursor-not-allowed border-neutral-600 bg-neutral-200 hover:border-neutral-600"
              : "cursor-pointer"
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
                  className={cn(
                    "text-neutral-700",
                    appearance.iconClassName,
                    errorMessage && "text-error-400"
                  )}
                />
              ) : (
                icon.left
              )}
            </div>
          )}
          {text.left && (
            <span className="mr-3 text-sm font-semibold text-neutral-900 md:text-xs md:font-medium">
              {text.left}
            </span>
          )}
          <input
            maxLength={maxLength}
            {...props}
            onChange={onChange}
            type={type}
            ref={ref}
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full min-w-0 cursor-pointer border-none border-transparent bg-transparent text-sm font-semibold text-neutral-900 outline-none placeholder:text-neutral-600 md:text-xs md:font-medium",
              disabled && "cursor-not-allowed",
              appearance.inputClassName
            )}
          />
          {withReset && (props.value || ref?.current?.value) ? (
            <div className="ml-2 flex items-center">
              <X
                onClick={() => {
                  if (onChange) {
                    // Create a synthetic event object that mimics the input change event
                    const syntheticEvent = {
                      target: {
                        value: "",
                        name: name,
                      },
                      currentTarget: {
                        value: "",
                        name: name,
                      },
                    };
                    onChange(syntheticEvent);
                  }
                  // Also clear the input directly if ref is available
                  if (ref && ref.current) {
                    ref.current.value = "";
                  }
                }}
                className="h-4 w-4 cursor-pointer text-neutral-700 hover:text-neutral-900"
              />
            </div>
          ) : icon.right ? (
            <div className="ml-2 flex items-center">
              {typeof icon.right === "string" ? (
                <IconComponent
                  loader={false}
                  src={{ src: icon.right }}
                  height={16}
                  width={16}
                  className={cn(
                    "text-neutral-700",
                    appearance.iconClassName,
                    errorMessage && "text-error-400"
                  )}
                />
              ) : (
                icon.right
              )}
            </div>
          ) : null}
          {text.right && (
            <span className="ml-3 text-sm font-semibold text-neutral-900 md:text-xs md:font-medium">
              {text.right}
            </span>
          )}
        </div>
        {errorMessage || supportiveText ? (
          <div className="flex w-full items-center">
            <span
              className={cn(
                "text-xs font-medium text-error-400",
                appearance.errorMessageClassName
              )}
            >
              {t(errorMessage)}
            </span>

            {supportiveText && (
              <span
                className={cn(
                  "ml-auto text-xs font-medium text-neutral-900",
                  appearance.supportiveTextClassName
                )}
              >
                {supportiveText}
              </span>
            )}
          </div>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
