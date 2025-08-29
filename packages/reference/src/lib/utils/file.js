export const base64ToFile = (base64String, filename, mimeType) => {
  // Decode base64 string to binary data
  const byteCharacters = atob(base64String.split(",")[1]); // Remove data URL prefix if present

  // Create a byte array from the binary data
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset++) {
    byteArrays.push(byteCharacters.charCodeAt(offset));
  }

  // Create a Blob from the byte array
  const blob = new Blob([new Uint8Array(byteArrays)], { type: mimeType });

  // Create a File from the Blob
  const file = new File([blob], filename, { type: mimeType });

  return file;
};
