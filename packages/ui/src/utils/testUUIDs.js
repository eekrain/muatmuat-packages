// Valid UUIDs untuk testing
export const TEST_UUIDS = {
  // UUID untuk testing waiting time details
  WAITING_TIME_REPORT: "550e8400-e29b-41d4-a716-446655440001",

  // UUID untuk testing overload details
  OVERLOAD_REPORT: "550e8400-e29b-41d4-a716-446655440002",

  // UUID untuk testing additional cost report detail
  ADDITIONAL_COST_REPORT: "550e8400-e29b-41d4-a716-446655440003",

  // UUID yang sudah ada di aplikasi (dari OrderWithAdditionalCost.jsx)
  EXISTING_REPORT: "2f8d1b39-ae1c-45c0-a1be-326431d64255",
};

// Fungsi untuk generate UUID yang valid
export const generateValidUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Fungsi untuk validasi UUID
export const isValidUUID = (uuid) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};
