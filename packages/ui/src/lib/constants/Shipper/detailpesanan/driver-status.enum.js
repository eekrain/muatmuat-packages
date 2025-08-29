export const DriverStatusEnum = {
  LOADING: {
    MENUJU: {
      code: "MENUJU_KE_LOKASI_MUAT",
      name: "labelMenujuKeLokasiMuat",
    },
    TIBA: {
      code: "TIBA_DI_LOKASI_MUAT",
      name: "labelTibaDiLokasiMuat",
    },
    ANTRI: {
      code: "ANTRI_DI_LOKASI_MUAT",
      name: "labelAntriDiLokasiMuat",
    },
    MUAT: {
      code: "SEDANG_MUAT",
      name: "Sedang Muat",
    },
    MUAT_MULTIPLE: {
      code: "SEDANG_MUAT_MULTIPLE",
      name: "Sedang Muat di Lokasi",
    },
  },
  UNLOADING: {
    MENUJU: {
      code: "MENUJU_KE_LOKASI_BONGKAR",
      name: "labelMenujuKeLokasiBongkar",
    },
    TIBA: {
      code: "TIBA_DI_LOKASI_BONGKAR",
      name: "labelTibaDiLokasiBongkar",
    },
    ANTRI: {
      code: "ANTRI_DI_LOKASI_BONGKAR",
      name: "labelAntriDiLokasiBongkar",
    },
    BONGKAR: {
      code: "SEDANG_BONGKAR",
      name: "labelSedangBongkar",
    },
    BONGKAR_MULTIPLE: {
      code: "SEDANG_BONGKAR_MULTIPLE",
      name: "Sedang Bongkar di Lokasi",
    },
    SELESAI: {
      code: "PENGIRIMAN_MUATAN_SELESAI",
      name: "labelPengirimanMuatanSelesai",
    },
  },
  FLEET_CHANGE: {
    MENUNGGU: {
      code: "MENUNGGU_ARMADA_PENGGANTI",
      name: "labelMenungguArmadaPengganti",
    },
    PINDAH: {
      code: "MUATAN_PINDAH_ARMADA",
      name: "labelMuatanPindahArmada",
    },
    JALAN: {
      code: "ARMADA_PENGGANTI_BERJALAN",
      name: "labelArmadaPenggantiBerjalan",
    },
  },
};

export const DriverStatusLabel = Object.values(DriverStatusEnum)
  .flatMap((category) => Object.values(category))
  .reduce((acc, status) => {
    acc[status.code] = status.name;
    return acc;
  }, {});

export const DriverStatusScanEnum = {
  BELUM_SCAN_MUAT: "BELUM_SCAN_MUAT",
  SUDAH_SCAN_MUAT: "SUDAH_SCAN_MUAT",
  BELUM_SCAN_BONGKAR: "BELUM_SCAN_BONGKAR",
  SUDAH_SCAN_BONGKAR: "SUDAH_SCAN_BONGKAR",
};
