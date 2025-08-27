export const successResponse = {
  Message: {
    Code: 200,
    Text: "Preferensi tutorial berhasil diupdate",
  },
  Data: {
    userId: "mock-user-id",
    showTutorialDaftarPesananAktif: true,
    updatedAt: new Date().toISOString(),
    success: true,
  },
  Type: "TUTORIAL_STATUS_UPDATED",
};

export const successGetResponse = {
  Message: {
    Code: 200,
    Text: "Status tutorial berhasil diambil",
  },
  Data: {
    userId: "mock-user-id",
    showTutorialDaftarPesananAktif: true,
    tutorialVersion: "1.0.0",
    lastShownAt: new Date().toISOString(),
    completedSections: ["intro"],
  },
  Type: "TUTORIAL_STATUS",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Payload tidak valid",
  },
  Data: {
    errors: [
      {
        field: "showTutorialDaftarPesananAktif",
        message: "Field required or invalid type",
      },
    ],
  },
  Type: "TUTORIAL_STATUS_UPDATE_ERROR",
};

export const serverErrorResponse = {
  Message: {
    Code: 500,
    Text: "Internal Server Error",
  },
  Data: {
    errors: [
      {
        field: "general",
        message: "Terjadi kesalahan pada sistem kami",
      },
    ],
  },
  Type: "INTERNAL_SERVER_ERROR",
};
