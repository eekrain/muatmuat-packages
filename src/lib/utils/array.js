export const addArraysUnique = (arr1, arr2) => {
  // Combine the arrays using the spread syntax
  const combinedArray = [...arr1, ...arr2];

  // Use a Set to store unique elements (Sets only allow unique values)
  const uniqueSet = new Set(combinedArray);

  // Convert the Set back to an array using the spread syntax
  const uniqueArray = [...uniqueSet];

  return uniqueArray;
};

export const getElementsNotInSecondArray = (arr1, arr2) => {
  const result = arr1.filter((element) => !arr2.includes(element));
  return result;
};
