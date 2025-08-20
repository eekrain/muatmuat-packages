export const authErrorResponse = {
  Message: {
    Code: 401,
    Text: "Unauthorized - Token required",
  },
  Data: {
    errors: [
      {
        field: "authorization",
        message: "Authorization header is required",
      },
    ],
  },
  Type: "AUTHENTICATION_ERROR",
};

export const serverErrorResponse = {
  Message: {
    Code: 500,
    Text: "Terjadi kesalahan pada server. Coba lagi nanti.",
  },
  Data: {
    errors: [
      {
        field: "server",
        message: "Internal server error occurred",
      },
    ],
  },
  Type: "SERVER_ERROR",
};

export const mockUpdateAreaBongkarSuccess = {
  Message: {
    Code: 200,
    Text: "Berhasil mengupdate pilihan kota/kabupaten",
  },
  Data: {
    updated: true,
    provinsiId: "550e8400-e29b-41d4-a716-446655440001",
    provinsiName: "DKI Jakarta",
    selectedCount: 3,
    totalCount: 5,
    isAllSelected: false,
  },
  Type: "UPDATE_AREA_BONGKAR_SELECTION",
};

export const mockUpdateAreaBongkarError = {
  Message: {
    Code: 400,
    Text: "Pilih minimal 1 Kota/Kab pada Provinsi ini",
  },
  Data: {
    errors: [
      {
        field: "kotaKabupaten",
        message: "Minimal 1 kota/kabupaten harus dipilih",
      },
    ],
  },
  Type: "UPDATE_AREA_BONGKAR_SELECTION_ERROR",
};
