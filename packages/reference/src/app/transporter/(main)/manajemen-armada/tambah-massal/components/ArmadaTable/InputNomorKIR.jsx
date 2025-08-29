import { forwardRef } from "react";

import Input from "@/components/Form/Input";

/**
 * InputNomorKIR - Specialized input component for KIR vehicle numbers
 *
 * Features:
 * - Only accepts letters, numbers, and spaces
 * - Maximum 20 characters including spaces
 * - Auto-sanitizes pasted content with special characters
 *
 * @typedef {Object} InputNomorKIRProps
 * @property {string} [value] - Current value of the input
 * @property {(e: Event) => void} [onChange] - Change event handler
 * @property {string} [placeholder] - Placeholder text
 * @property {boolean} [disabled] - Whether the input is disabled
 * @property {string} [errorMessage] - Error message to display
 * @property {string} [name] - Input name attribute
 * @property {Object} [appearance] - Appearance configuration (same as Input component)
 * @property {string} [className] - Additional CSS classes
 *
 * @param {InputNomorKIRProps} props
 * @param {import('react').Ref<HTMLInputElement>} ref
 * @returns {JSX.Element}
 */
const InputNomorKIR = forwardRef(
  (
    {
      value = "",
      onChange,
      placeholder = "Contoh: SBY 123456 (maks 20 karakter)",
      disabled = false,
      errorMessage,
      name,
      appearance = {},
      className,
      ...props
    },
    ref
  ) => {
    /**
     * Handles input changes with format validation
     * @param {Event} e - Input change event
     */
    const handleChange = (e) => {
      const inputValue = e.target.value;

      // Remove special characters, keep letters, numbers, and spaces
      const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, "");

      // Limit to 20 characters including spaces
      const truncatedValue = cleanedValue.slice(0, 20);

      // If the value was changed (cleaned or truncated), update it
      if (truncatedValue !== inputValue) {
        const cleanedEvent = {
          ...e,
          target: {
            ...e.target,
            value: truncatedValue,
          },
        };

        if (onChange) {
          onChange(cleanedEvent);
        }
        return;
      }

      // Pass through the original event if no changes needed
      if (onChange) {
        onChange(e);
      }
    };

    /**
     * Handles paste events to sanitize content
     * @param {ClipboardEvent} e - Paste event
     */
    const handlePaste = (e) => {
      e.preventDefault();

      // Get pasted content
      const pastedText = e.clipboardData.getData("text");

      // Clean the pasted content - keep letters, numbers, and spaces
      const cleanedValue = pastedText.replace(/[^a-zA-Z0-9\s]/g, "");
      const truncatedValue = cleanedValue.slice(0, 20);

      // Create a synthetic change event
      const syntheticEvent = {
        target: {
          name: name,
          value: (value || "") + truncatedValue,
        },
      };

      // Ensure we don't exceed 20 characters total
      const finalValue = syntheticEvent.target.value.slice(0, 20);
      syntheticEvent.target.value = finalValue;

      if (onChange) {
        onChange(syntheticEvent);
      }
    };

    return (
      <Input
        ref={ref}
        name={name}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        maxLength={20}
        disabled={disabled}
        errorMessage={errorMessage}
        appearance={appearance}
        className={className}
        {...props}
      />
    );
  }
);

InputNomorKIR.displayName = "InputNomorKIR";

export default InputNomorKIR;
