export const periodFilterOptions = {
  periodOptions: [
    { value: "today", label: "Hari Ini", selected: false },
    { value: "week", label: "Minggu Ini", selected: false },
    { value: "month", label: "Bulan Ini", selected: false },
    { value: "custom", label: "Pilih Periode", selected: false },
  ],
  customPeriodModal: {
    title: "Pilih Periode",
    startDatePlaceholder: "Pilih tanggal mulai",
    endDatePlaceholder: "Pilih tanggal akhir",
    applyButtonText: "Terapkan",
    cancelButtonText: "Batal",
  },
};

export const successShell = {
  Message: { Code: 200, Text: "Request processed successfully" },
  Data: {},
  Type: "SUCCESS",
};

export const serverErrorResponse = {
  Message: { Code: 500, Text: "Internal Server Error" },
  Data: {
    errors: [{ field: "general", message: "An unexpected error occurred." }],
  },
  Type: "INTERNAL_SERVER_ERROR",
};
