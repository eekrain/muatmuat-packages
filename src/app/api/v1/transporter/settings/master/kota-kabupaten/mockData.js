export const kotaKabupatenSuccessResponse = {
  Message: {
    Code: 200,
    Text: "Master data kota/kabupaten berhasil diambil",
  },
  Data: {
    cities: [
      {
        provinceId: 31,
        provinceName: "DKI Jakarta",
        selectedCount: 3,
        totalCount: 5,
        isAllSelected: false,
        kota: [
          {
            cityId: "550e8400-e29b-41d4-a716-446655440011",
            cityName: "Jakarta Pusat",
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440012",
            cityName: "Jakarta Selatan",
            isSelected: false,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440013",
            cityName: "Jakarta Utara",
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440014",
            cityName: "Jakarta Timur",
            isSelected: false,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440015",
            cityName: "Jakarta Barat",
            isSelected: true,
          },
        ],
      },
      {
        provinceId: 32,
        provinceName: "Jawa Barat",
        selectedCount: 2,
        totalCount: 6,
        isAllSelected: false,
        kota: [
          {
            cityId: "550e8400-e29b-41d4-a716-446655440021",
            cityName: "Bandung",
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440022",
            cityName: "Bekasi",
            isSelected: false,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440023",
            cityName: "Bogor",
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440024",
            cityName: "Depok",
            isSelected: false,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440025",
            cityName: "Cimahi",
            isSelected: false,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440026",
            cityName: "Sukabumi",
            isSelected: false,
          },
        ],
      },
      {
        provinceId: 33,
        provinceName: "Jawa Tengah",
        selectedCount: 1,
        totalCount: 4,
        isAllSelected: false,
        kota: [
          {
            cityId: "550e8400-e29b-41d4-a716-446655440031",
            cityName: "Semarang",
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440032",
            cityName: "Solo",
            isSelected: false,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440033",
            cityName: "Yogyakarta",
            isSelected: false,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440034",
            cityName: "Magelang",
            isSelected: false,
          },
        ],
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 2,
      totalItems: 15,
      itemsPerPage: 12,
    },
  },
  Type: "GET_MASTER_KOTA_KABUPATEN",
};

export const kotaKabupatenNoDataResponse = {
  Message: {
    Code: 404,
    Text: "Data kota/kabupaten tidak ditemukan",
  },
  Data: {
    cities: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 12,
    },
  },
  Type: "GET_MASTER_KOTA_KABUPATEN_ERROR",
};

export const serverErrorResponse = {
  Message: {
    Code: 500,
    Text: "Terjadi kesalahan pada server",
  },
  Data: null,
  Type: "GET_MASTER_KOTA_KABUPATEN_ERROR",
};
