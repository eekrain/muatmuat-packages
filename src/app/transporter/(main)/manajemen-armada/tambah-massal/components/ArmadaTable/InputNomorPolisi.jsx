import { forwardRef } from "react";

import Input from "@/components/Form/Input";

/**
 * InputNomorPolisi - Specialized input component for Indonesian license plates
 *
 * Features:
 * - Only accepts letters, numbers, and spaces
 * - Maximum 15 characters including spaces
 * - Auto-sanitizes pasted content with special characters
 * - Validation happens on form submission only
 *
 * @typedef {Object} InputNomorPolisiProps
 * @property {string} [value] - Current value of the input
 * @property {(e: Event) => void} [onChange] - Change event handler
 * @property {string} [placeholder] - Placeholder text
 * @property {boolean} [disabled] - Whether the input is disabled
 * @property {string} [errorMessage] - Error message to display
 * @property {string} [name] - Input name attribute
 * @property {Object} [appearance] - Appearance configuration (same as Input component)
 * @property {string} [className] - Additional CSS classes
 *
 * @param {InputNomorPolisiProps} props
 * @param {import('react').Ref<HTMLInputElement>} ref
 * @returns {JSX.Element}
 */
const InputNomorPolisi = forwardRef(
  (
    {
      value = "",
      onChange,
      placeholder = "Contoh: L 1234 TY (maks 15 karakter)",
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
     * Handles input changes with format validation only (no toasts)
     * @param {Event} e - Input change event
     */
    const handleChange = (e) => {
      const inputValue = e.target.value;

      // Remove special characters silently (no toast)
      const cleanedValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, "");

      // Limit to 15 characters including spaces
      const truncatedValue = cleanedValue.slice(0, 15);

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
     * Handles paste events to sanitize content (no toasts)
     * @param {ClipboardEvent} e - Paste event
     */
    const handlePaste = (e) => {
      e.preventDefault();

      // Get pasted content
      const pastedText = e.clipboardData.getData("text");

      // Clean and truncate the pasted content silently
      const cleanedValue = pastedText.replace(/[^a-zA-Z0-9\s]/g, "");
      const truncatedValue = cleanedValue.slice(0, 15);

      // Create a synthetic change event
      const syntheticEvent = {
        target: {
          name: name,
          value: (value || "") + truncatedValue,
        },
      };

      // Ensure we don't exceed 15 characters total
      const finalValue = syntheticEvent.target.value.slice(0, 15);
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
        maxLength={15}
        disabled={disabled}
        appearance={appearance}
        className={className}
        {...props}
      />
    );
  }
);

InputNomorPolisi.displayName = "InputNomorPolisi";

export default InputNomorPolisi;
