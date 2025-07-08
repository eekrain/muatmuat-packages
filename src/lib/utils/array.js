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

// Buat bandingin informasi muatan tidak ada perubahan pada nama muatan
export const compareArraysByNameOnly = (array1, array2) => {
  // If arrays have different lengths, they can't have the same names
  if (array1.length !== array2.length) {
    return false;
  }

  // Create a map of namaMuatan values from the first array
  const namesMap = new Map();

  for (let i = 0; i < array1.length; i++) {
    const item = array1[i];
    if (!item.namaMuatan || !item.namaMuatan.value) {
      return false; // Invalid structure
    }
    namesMap.set(item.namaMuatan.value, true);
  }

  // Check if all namaMuatan values from the second array exist in the first array
  for (let i = 0; i < array2.length; i++) {
    const item = array2[i];
    if (!item.namaMuatan || !item.namaMuatan.value) {
      return false; // Invalid structure
    }

    // If a namaMuatan value doesn't exist in the first array, return false
    if (!namesMap.has(item.namaMuatan.value)) {
      return false;
    }

    // Remove the name from the map to ensure no duplicates
    namesMap.delete(item.namaMuatan.value);
  }

  // If all names were found and accounted for, namesMap should be empty
  return namesMap.size === 0;
};
