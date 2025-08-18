export const masterProvinsiSuccessResponse = {
  Message: {
    Code: 200,
    Text: "Master data provinsi berhasil diambil",
  },
  Data: {
    provinsi: [
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440001",
        provinceName: "Aceh",
        alphabetGroup: "A",
        isSelected: false,
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440002",
        provinceName: "Bali",
        alphabetGroup: "B",
        isSelected: true,
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440003",
        provinceName: "Banten",
        alphabetGroup: "B",
        isSelected: false,
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440004",
        provinceName: "Bengkulu",
        alphabetGroup: "B",
        isSelected: false,
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440005",
        provinceName: "DI Yogyakarta",
        alphabetGroup: "D",
        isSelected: true,
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440006",
        provinceName: "DKI Jakarta",
        alphabetGroup: "D",
        isSelected: true,
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440007",
        provinceName: "Gorontalo",
        alphabetGroup: "G",
        isSelected: false,
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440008",
        provinceName: "Jambi",
        alphabetGroup: "J",
        isSelected: false,
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440009",
        provinceName: "Jawa Barat",
        alphabetGroup: "J",
        isSelected: true,
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440010",
        provinceName: "Jawa Tengah",
        alphabetGroup: "J",
        isSelected: false,
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 3,
      totalItems: 34,
      itemsPerPage: 10,
    },
    grouping: {
      A: 1,
      B: 3,
      D: 2,
      G: 1,
      J: 3,
    },
  },
  Type: "GET_MASTER_PROVINSI",
};

export const masterProvinsiNoDataResponse = {
  Message: {
    Code: 404,
    Text: "Data provinsi tidak ditemukan",
  },
  Data: {
    provinsi: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 10,
    },
  },
  Type: "GET_MASTER_PROVINSI_ERROR",
};

export const successResponse = {
  Message: {
    Code: 200,
    Text: "Data area bongkar berhasil diambil",
  },
  Data: {
    hasData: true,
    totalProvinces: 4,
    unloadingAreas: [
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440001",
        provinceName: "DKI Jakarta",
        areaName: "Area Jakarta Raya",
        cityCount: 5,
        isAllCitiesSelected: false,
        displayText: "DKI Jakarta - 5 Kota/Kab",
        cities: [
          {
            cityId: "550e8400-e29b-41d4-a716-446655440011",
            cityName: "Jakarta Pusat",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440012",
            cityName: "Jakarta Utara",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440013",
            cityName: "Jakarta Barat",
            isActive: true,
            isSelected: false,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440014",
            cityName: "Jakarta Selatan",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440015",
            cityName: "Jakarta Timur",
            isActive: true,
            isSelected: true,
          },
        ],
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440002",
        provinceName: "Jawa Barat",
        areaName: "Area Jawa Barat",
        cityCount: 8,
        isAllCitiesSelected: true,
        displayText: "Jawa Barat - 8 Kota/Kab",
        cities: [
          {
            cityId: "550e8400-e29b-41d4-a716-446655440021",
            cityName: "Bandung",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440022",
            cityName: "Bogor",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440023",
            cityName: "Depok",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440024",
            cityName: "Bekasi",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440025",
            cityName: "Cimahi",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440026",
            cityName: "Sukabumi",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440027",
            cityName: "Cirebon",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440028",
            cityName: "Tasikmalaya",
            isActive: true,
            isSelected: true,
          },
        ],
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440003",
        provinceName: "Jawa Tengah",
        areaName: "Area Jawa Tengah",
        cityCount: 6,
        isAllCitiesSelected: false,
        displayText: "Jawa Tengah - 3 Kota/Kab",
        cities: [
          {
            cityId: "550e8400-e29b-41d4-a716-446655440031",
            cityName: "Semarang",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440032",
            cityName: "Solo",
            isActive: true,
            isSelected: false,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440033",
            cityName: "Yogyakarta",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440034",
            cityName: "Magelang",
            isActive: true,
            isSelected: false,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440035",
            cityName: "Salatiga",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440036",
            cityName: "Pekalongan",
            isActive: true,
            isSelected: false,
          },
        ],
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440004",
        provinceName: "Jawa Timur",
        areaName: "Area Jawa Timur",
        cityCount: 7,
        isAllCitiesSelected: false,
        displayText: "Jawa Timur - 4 Kota/Kab",
        cities: [
          {
            cityId: "550e8400-e29b-41d4-a716-446655440041",
            cityName: "Surabaya",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440042",
            cityName: "Malang",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440043",
            cityName: "Kediri",
            isActive: true,
            isSelected: false,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440044",
            cityName: "Blitar",
            isActive: true,
            isSelected: false,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440045",
            cityName: "Mojokerto",
            isActive: true,
            isSelected: true,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440046",
            cityName: "Pasuruan",
            isActive: true,
            isSelected: false,
          },
          {
            cityId: "550e8400-e29b-41d4-a716-446655440047",
            cityName: "Probolinggo",
            isActive: true,
            isSelected: true,
          },
        ],
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 4,
      itemsPerPage: 10,
    },
  },
  Type: "GET_AREA_BONGKAR",
};

export const noDataResponse = {
  Message: {
    Code: 404,
    Text: "Data area bongkar tidak ditemukan",
  },
  Data: {
    hasData: false,
    totalProvinces: 0,
    unloadingAreas: [],
  },
  Type: "GET_AREA_BONGKAR_ERROR",
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

export const saveSuccessResponse = {
  Message: {
    Code: 201,
    Text: "Berhasil menyimpan area bongkar",
  },
  Data: {
    saved: true,
    totalProvinces: 4,
    totalKota: 15,
    configurationId: "550e8400-e29b-41d4-a716-446655440099",
    transporterId: "550e8400-e29b-41d4-a716-446655440088",
    createdAt: "2024-12-10T08:30:00Z",
    updatedAt: "2024-12-10T08:30:00Z",
  },
  Type: "SAVE_AREA_BONGKAR",
};

export const saveErrorResponse = {
  Message: {
    Code: 401,
    Text: "Unauthorized",
  },
  Data: {
    errors: [
      {
        field: "authorization",
        message: "Token tidak valid atau tidak ditemukan",
        code: "UNAUTHORIZED_ACCESS",
      },
    ],
  },
  Type: "SAVE_AREA_BONGKAR_ERROR",
};

export const noProvinceErrorResponse = {
  Message: {
    Code: 400,
    Text: "Pilih Minimal 1 Data Provinsi",
  },
  Data: {
    errors: [
      {
        field: "areaBongkar",
        message: "Minimal 1 provinsi harus dipilih",
        code: "MINIMUM_PROVINCE_REQUIRED",
      },
    ],
  },
  Type: "SAVE_AREA_BONGKAR_ERROR",
};

export const noCityErrorResponse = {
  Message: {
    Code: 400,
    Text: "Pilih minimal 1 Kota/Kab pada setiap Provinsi terpilih",
  },
  Data: {
    errors: [
      {
        field: "areaBongkar[0].kotaKabupaten",
        message:
          "Minimal 1 kota/kabupaten harus dipilih untuk provinsi DKI Jakarta",
        code: "MINIMUM_CITY_PER_PROVINCE_REQUIRED",
      },
    ],
  },
  Type: "SAVE_AREA_BONGKAR_ERROR",
};

export const searchAreaBongkarSuccessResponse = {
  Message: {
    Code: 200,
    Text: "Hasil pencarian area bongkar ditemukan",
  },
  Data: {
    keyword: "jakarta",
    found: true,
    unloadingAreas: [
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440001",
        provinceName: "DKI Jakarta",
        areaName: "Area Jakarta Raya",
        cityCount: 5,
        isAllCitiesSelected: false,
        displayText: "DKI Jakarta - 5 Kota/Kab",
        highlightedName: "DKI <mark>Jakarta</mark>",
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 1,
      itemsPerPage: 10,
    },
  },
  Type: "SEARCH_AREA_BONGKAR",
};

export const searchAreaBongkarNoDataResponse = {
  Message: {
    Code: 404,
    Text: "Keyword Tidak Ditemukan",
  },
  Data: {
    keyword: "xyz",
    found: false,
    unloadingAreas: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 10,
    },
  },
  Type: "SEARCH_AREA_BONGKAR_ERROR",
};
