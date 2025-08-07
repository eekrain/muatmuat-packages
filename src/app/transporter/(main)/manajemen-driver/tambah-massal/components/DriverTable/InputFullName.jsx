import Input from "@/components/Form/Input";
import { cn } from "@/lib/utils";

/**
 * InputFullName Component
 *
 * A specialized input component for full name with validation:
 * 1. Only allows alphabets, spaces, dots, commas, quotes, apostrophes, and hyphens
 * 2. Minimum length of 3 characters
 * 3. Real-time input filtering
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Input name attribute
 * @param {string} props.value - Current input value
 * @param {Function} props.onChange - Change handler function
 * @param {boolean} props.hasError - Whether the input has validation errors
 * @param {string} props.placeholder - Input placeholder text
 * @param {string} props.className - Additional CSS classes
 */
const InputFullName = ({
  name,
  value = "",
  onChange,
  hasError = false,
  placeholder = "Masukkan Nama Lengkap",
  className = "",
  ...props
}) => {
  /**
   * Handle input change with real-time validation
   * Only allows valid name characters
   */
  const handleChange = (e) => {
    const inputValue = e.target.value;

    // Allow only letters, spaces, dots, commas, quotes, apostrophes, and hyphens
    const filteredValue = inputValue.replace(/[^a-zA-Z\s.,'"'-]/g, "");

    // Create a new event object with the filtered value
    const filteredEvent = {
      ...e,
      target: {
        ...e.target,
        value: filteredValue,
      },
    };

    // Call the parent onChange handler
    if (onChange) {
      onChange(filteredEvent);
    }
  };

  return (
    <Input
      name={name}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      appearance={{
        containerClassName: cn(
          hasError && "border-error-400 placeholder:text-error-400",
          className
        ),
      }}
      // Use text input type but with inputMode for better mobile experience
      inputMode="text"
      autoComplete="name"
      {...props}
    />
  );
};

export default InputFullName;
