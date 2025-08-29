import { useState } from "react";

import Input from "@/components/Form/Input";

/**
 * InputPhoneNumber component for WhatsApp number input with validation
 * @param {Object} props - Component props
 * @param {string} props.value - Current phone number value
 * @param {Function} props.onChange - Change handler function
 * @param {string} props.name - Input name attribute
 * @param {string} props.placeholder - Input placeholder text
 * @param {boolean} props.hasError - Whether the input has an error state
 * @param {string} props.className - Additional CSS classes
 */
const InputPhoneNumber = ({
  value = "",
  onChange,
  name,
  placeholder = "Contoh: 08xxxxxxxxxx",
  hasError = false,
  className = "",
  ...props
}) => {
  const [localValue, setLocalValue] = useState(value);

  /**
   * Handle input change with number-only validation
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const inputValue = e.target.value;

    // Only allow numbers and limit to reasonable phone number length
    const numbersOnly = inputValue.replace(/[^0-9]/g, "");

    // Limit to 15 digits (reasonable max for phone numbers)
    const limitedValue = numbersOnly.slice(0, 15);

    setLocalValue(limitedValue);

    // Call the parent onChange with the sanitized value
    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: limitedValue,
          name: name || e.target.name,
        },
      };
      onChange(syntheticEvent);
    }
  };

  /**
   * Handle input blur to ensure value is in sync
   * @param {Event} e - Blur event
   */
  const handleBlur = (e) => {
    // Ensure local value matches the prop value when component loses focus
    if (value !== localValue) {
      setLocalValue(value);
    }

    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  // Sync local value with prop value when it changes externally
  if (value !== localValue && value !== undefined) {
    setLocalValue(value);
  }

  return (
    <Input
      {...props}
      name={name}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      appearance={{
        containerClassName: hasError
          ? "border-error-400 placeholder:text-error-400"
          : "",
        ...props.appearance,
      }}
      className={className}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
    />
  );
};

export default InputPhoneNumber;
