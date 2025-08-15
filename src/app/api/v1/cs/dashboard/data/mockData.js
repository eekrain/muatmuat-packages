export const mockDashboardData = {
  orderStatusCounts: {
    menungguKonfirmasi: 2,
    pesananTerkonfirmasi: 2,
    armadaDijadwalkan: 2,
    prosesMuat: 2,
    prosesBongkar: 2,
    dokumenSedangDisiapkan: 2,
    prosesPengirimanDokumen: 2,
    pesananSelesai: 2,
  },
  attentionItems: {
    perluResponPerubahan: 2,
    perluKonfirmasiSiap: 2,
    perluAssignArmada: 2,
    ulasanBaru: 2,
    laporanSOS: 1,
  },
  transporterRating: {
    averageRating: 4.9,
    formattedRating: "4,9/5",
  },
  metadata: {
    lastUpdated: new Date().toISOString(),
  },
};

export const mockDashboardDataEmpty = {
  orderStatusCounts: {
    menungguKonfirmasi: 0,
    pesananTerkonfirmasi: 0,
    armadaDijadwalkan: 0,
    prosesMuat: 0,
    prosesBongkar: 0,
    dokumenSedangDisiapkan: 0,
    prosesPengirimanDokumen: 0,
    pesananSelesai: 0,
  },
  attentionItems: {
    perluResponPerubahan: 0,
    perluKonfirmasiSiap: 0,
    perluAssignArmada: 0,
    ulasanBaru: 0,
    laporanSOS: 0,
  },
  transporterRating: {
    averageRating: 0,
    formattedRating: "0/5",
  },
  metadata: {
    lastUpdated: new Date().toISOString(),
  },
};

export const successShell = {
  Message: { Code: 200, Text: "Dashboard data retrieved successfully" },
  Data: {},
  Type: "DASHBOARD_DATA",
};
