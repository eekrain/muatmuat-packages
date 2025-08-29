import { forwardRef } from "react";

import Input from "@/components/Form/Input";

/**
 * InputNomorRangka - Specialized input component for vehicle chassis numbers
 *
 * Features:
 * - Auto capitalizes input
 * - Only accepts letters and numbers
 * - Maximum 17 characters
 * - Auto-sanitizes pasted content
 *
 * @typedef {Object} InputNomorRangkaProps
 * @property {string} [value] - Current value of the input
 * @property {(e: Event) => void} [onChange] - Change event handler
 * @property {string} [placeholder] - Placeholder text
 * @property {boolean} [disabled] - Whether the input is disabled
 * @property {string} [errorMessage] - Error message to display
 * @property {string} [name] - Input name attribute
 * @property {Object} [appearance] - Appearance configuration (same as Input component)
 * @property {string} [className] - Additional CSS classes
 *
 * @param {InputNomorRangkaProps} props
 * @param {import('react').Ref<HTMLInputElement>} ref
 * @returns {JSX.Element}
 */
const InputNomorRangka = forwardRef(
  (
    {
      value = "",
      onChange,
      placeholder = "Maksimal 17 Digit",
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

      // Remove non-alphanumeric characters and convert to uppercase
      const cleanedValue = inputValue
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase();

      // Limit to 17 characters
      const truncatedValue = cleanedValue.slice(0, 17);

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

      // Clean, uppercase, and truncate the pasted content
      const cleanedValue = pastedText
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase();
      const truncatedValue = cleanedValue.slice(0, 17);

      // Create a synthetic change event
      const syntheticEvent = {
        target: {
          name: name,
          value: (value || "") + truncatedValue,
        },
      };

      // Ensure we don't exceed 17 characters total
      const finalValue = syntheticEvent.target.value.slice(0, 17);
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
        maxLength={17}
        disabled={disabled}
        errorMessage={errorMessage}
        appearance={appearance}
        className={className}
        {...props}
      />
    );
  }
);

InputNomorRangka.displayName = "InputNomorRangka";

export default InputNomorRangka;
