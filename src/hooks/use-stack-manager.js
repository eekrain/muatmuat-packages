import { useEffect } from "react";

const STACK_ITEM_SELECTOR = '[data-stack-item="true"]';
const OBSCURED_CLASS = "is-obscured";

/**
 * A hook to automatically manage the visibility of stackable UI elements.
 * It ensures only the topmost *active* (data-state="open") item is visible.
 * @param {React.RefObject<Element>} itemRef - A ref to the stackable element.
 * @param {boolean} isOpen - The open state of the element.
 */
export const useStackManager = (itemRef, isOpen) => {
  useEffect(() => {
    // This function is now smarter.
    const manageStack = () => {
      // Find ALL stackable items, including those opening and closing.
      const allStackItems = Array.from(
        document.querySelectorAll(STACK_ITEM_SELECTOR)
      );

      // First, remove the obscured class from everyone to reset the state.
      allStackItems.forEach((item) => {
        item.classList.remove(OBSCURED_CLASS);
      });

      // Now, find only the items that are currently OPEN.
      const openStackItems = allStackItems.filter(
        (item) => item.getAttribute("data-state") === "open"
      );

      // Apply the obscured class to all OPEN items except for the very last one.
      openStackItems.forEach((item, index) => {
        if (index < openStackItems.length - 1) {
          item.classList.add(OBSCURED_CLASS);
        }
      });
    };

    // We still run the logic when the state changes.
    // A delay ensures all DOM attribute changes have settled before we check.
    const timerId = setTimeout(manageStack, 50);

    return () => {
      clearTimeout(timerId);
      // We also run it on cleanup to handle the final state.
      manageStack();
    };
  }, [isOpen]); // We only need isOpen as a dependency.
};
