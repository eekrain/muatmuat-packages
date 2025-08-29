export const searchFilter = (keyword, arr, key) =>
  arr?.filter((item) => {
    const arrItem = key ? item[key] : item;
    return arrItem?.toLowerCase().includes(keyword?.toLowerCase());
  });
