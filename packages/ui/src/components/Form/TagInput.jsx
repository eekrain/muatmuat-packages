import React, { useCallback, useRef, useState } from "react";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

import { TagBubble } from "../Badge/TagBubble";

/**
 * @typedef {Object} TagInputProps
 * @property {string[]} [tags] - Array of current tags (for controlled component)
 * @property {(tags: string[]) => void} [onTagsChange] - Callback when tags change (for controlled component)
 * @property {string} [placeholder] - Placeholder text for the input field
 * @property {number} [maxTags] - Maximum number of tags allowed
 * @property {number} [maxLength] - Maximum length for each tag
 * @property {boolean} [allowDuplicates] - Whether to allow duplicate tags
 * @property {boolean} [disabled] - Whether the component is disabled
 * @property {string} [className] - Additional CSS class for the container
 * @property {string} [tagClassName] - Additional CSS class for individual tags
 * @property {string} [inputClassName] - Additional CSS class for the input field
 */

/**
 * A reusable tag input component that allows users to add and remove tags
 * @param {TagInputProps} props - The component props
 * @returns {React.ReactElement} The TagInput component
 */
export const TagInput = ({
  tags = [],
  onTagsChange,
  onTagsDuplicate,
  placeholder = "Type and press Enter to add tags...",
  maxTags = Infinity,
  maxLength = 50,
  allowDuplicates = false,
  disabled = false,
  errorMessage,
  withTagInputHelp = false,
  className = "",
  appearance = {
    tagClassName: "",
    inputClassName: "",
  },
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [internalTags, setInternalTags] = useState(tags);

  /** @type {React.RefObject<HTMLInputElement>} */
  const inputRef = useRef(null);

  // Use provided tags or internal state
  const currentTags = onTagsChange ? tags : internalTags;

  /**
   * Updates the tags array
   * @param {string[]} newTags - The new array of tags
   */
  const updateTags = useCallback(
    (newTags) => {
      if (onTagsChange) {
        onTagsChange(newTags);
      } else {
        setInternalTags(newTags);
      }
    },
    [onTagsChange]
  );

  /**
   * Adds a new tag to the list
   * @param {string} tag - The tag to add
   */
  const addTag = useCallback(
    (tag) => {
      const trimmedTag = tag.trim();

      if (!trimmedTag) return;

      if (currentTags.length >= maxTags) return;

      if (!allowDuplicates && currentTags.includes(trimmedTag)) {
        onTagsDuplicate?.(trimmedTag);
        return;
      }

      if (trimmedTag.length > maxLength) return;

      updateTags([...currentTags, trimmedTag]);
      setInputValue("");
    },
    [
      currentTags,
      maxTags,
      allowDuplicates,
      maxLength,
      updateTags,
      onTagsDuplicate,
    ]
  );

  /**
   * Removes a tag at the specified index
   * @param {number} indexToRemove - The index of the tag to remove
   */
  const removeTag = useCallback(
    (indexToRemove) => {
      updateTags(currentTags.filter((_, index) => index !== indexToRemove));
    },
    [currentTags, updateTags]
  );

  /**
   * Handles keyboard events for the input field
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event
   */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTag(inputValue);
      } else if (
        e.key === "Backspace" &&
        inputValue === "" &&
        currentTags.length > 0
      ) {
        removeTag(currentTags.length - 1);
      }
    },
    [inputValue, addTag, removeTag, currentTags.length]
  );

  /**
   * Handles input value changes
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  /**
   * Focuses the input field
   */
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={cn("block", className)}>
      <div
        className={cn(
          "flex w-full max-w-[576px] cursor-text flex-col items-start gap-2 p-0",
          disabled && "cursor-not-allowed"
        )}
        onClick={disabled ? undefined : focusInput}
      >
        <div
          className={cn(
            "box-border flex min-h-[32px] w-full flex-row items-center gap-2 rounded-md border border-gray-500 bg-white px-3 transition-colors duration-200 focus-within:border-blue-600",
            tags.length > 0 && "min-h-[52px] p-3"
          )}
        >
          <div className="flex min-h-[28px] flex-1 flex-row flex-wrap content-start items-center gap-2">
            {currentTags.map((tag, index) => (
              <TagBubble
                key={`${tag}-${index}`}
                disabled={disabled}
                appearance={appearance.tagClassName}
                withRemove={
                  disabled
                    ? null
                    : {
                        onRemove: () => removeTag(index),
                      }
                }
              >
                {tag}
              </TagBubble>
            ))}

            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={currentTags.length === 0 ? placeholder : ""}
              disabled={disabled || currentTags.length >= maxTags}
              maxLength={maxLength}
              className={cn(
                "h-8 min-w-[120px] flex-1 border-none bg-transparent text-xs font-medium leading-[14.4px] text-neutral-900 placeholder-neutral-600 outline-none disabled:cursor-not-allowed",
                appearance.inputClassName
              )}
              aria-label="Add new tag"
              aria-describedby="tag-input-help"
            />
          </div>
        </div>

        {withTagInputHelp && (
          <div id="tag-input-help" className="px-1 text-xs text-gray-500">
            {currentTags.length > 0 && (
              <span>
                {currentTags.length} tag{currentTags.length !== 1 ? "s" : ""}
                {maxTags !== Infinity && ` (max ${maxTags})`}
              </span>
            )}
            {currentTags.length >= maxTags && (
              <span className="ml-2 text-amber-600">Maximum tags reached</span>
            )}
          </div>
        )}
      </div>

      {errorMessage && (
        <span className="mt-2 text-sm text-red-500">{t(errorMessage)}</span>
      )}
    </div>
  );
};
