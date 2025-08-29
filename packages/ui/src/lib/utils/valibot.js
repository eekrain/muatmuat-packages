/**
 * Maps nested Valibot errors to a flat error object.
 * @param {object} valibotErrors - The `nested` error object from Valibot's `flatten`.
 * @returns {object} A flat error object for the Zustand state.
 */
export const mapValibotErrors = (valibotErrors) => {
  const newErrors = {};

  for (const fieldName in valibotErrors) {
    const messageArray = valibotErrors[fieldName];
    if (messageArray?.[0]) {
      newErrors[fieldName] = messageArray[0];
    }
  }

  return newErrors;
};
