// Legacy export for backward compatibility
// export const DriverStatusLabel = {
//   MENUJU_KE_LOKASI_MUAT: "labelMenujuKeLokasiMuat",
//   TIBA_DI_LOKASI_MUAT: "labelTibaDiLokasiMuat",
//   ANTRI_DI_LOKASI_MUAT: "labelAntriDiLokasiMuat",
//   SEDANG_MUAT: "labelSedangMuat",

//   MENUJU_KE_LOKASI_BONGKAR: "labelMenujuKeLokasiBongkar",
//   TIBA_DI_LOKASI_BONGKAR: "labelTibaDiLokasiBongkar",
//   ANTRI_DI_LOKASI_BONGKAR: "labelAntriDiLokasiBongkar",
//   SEDANG_BONGKAR: "labelSedangBongkar",

//   PENGIRIMAN_MUATAN_SELESAI: "labelPengirimanMuatanSelesai",
//   MENUNGGU_ARMADA_PENGGANTI: "labelMenungguArmadaPengganti",
//   MUATAN_PINDAH_ARMADA: "labelMuatanPindahArmada",
//   ARMADA_PENGGANTI_BERJALAN: "labelArmadaPenggantiBerjalan",
// Name nanti jadiin label multibahasa yoo
export const DriverStatusEnum = {
  LOADING: {
    MENUJU: {
      code: "MENUJU_KE_LOKASI_MUAT",
      name: "Menuju ke Lokasi Muat",
    },
    TIBA: {
      code: "TIBA_DI_LOKASI_MUAT",
      name: "Tiba di Lokasi Muat",
    },
    ANTRI: {
      code: "ANTRI_DI_LOKASI_MUAT",
      name: "Antri di Lokasi Muat",
    },
    MUAT: {
      code: "SEDANG_MUAT",
      name: "Sedang Muat",
    },
  },
  UNLOADING: {
    MENUJU: {
      code: "MENUJU_KE_LOKASI_BONGKAR",
      name: "Menuju ke Lokasi Bongkar",
    },
    TIBA: {
      code: "TIBA_DI_LOKASI_BONGKAR",
      name: "Tiba di Lokasi Bongkar",
    },
    ANTRI: {
      code: "ANTRI_DI_LOKASI_BONGKAR",
      name: "Antri di Lokasi Bongkar",
    },
    BONGKAR: {
      code: "SEDANG_BONGKAR",
      name: "Sedang Bongkar",
    },
    SELESAI: {
      code: "PENGIRIMAN_MUATAN_SELESAI",
      name: "Pengiriman Muatan Selesai",
    },
  },
  FLEET_CHANGE: {
    MENUNGGU: {
      code: "MENUNGGU_ARMADA_PENGGANTI",
      name: "Menunggu Armada Pengganti",
    },
    PINDAH: {
      code: "MUATAN_PINDAH_ARMADA",
      name: "Muatan Pindah Armada",
    },
    JALAN: {
      code: "ARMADA_PENGGANTI_BERJALAN",
      name: "Armada Pengganti Berjalan",
    },
  },
};

export const DriverStatusLabel = Object.values(DriverStatusEnum)
  .flatMap((category) => Object.values(category))
  .reduce((acc, status) => {
    acc[status.code] = status.name;
    return acc;
  }, {});
