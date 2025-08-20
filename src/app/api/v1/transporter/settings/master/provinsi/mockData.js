export const masterProvinsiData = [
  {
    provinceId: 11,
    provinceName: "ACEH",
    alphabetGroup: "A",
    isSelected: false,
  },
  {
    provinceId: 51,
    provinceName: "BALI",
    alphabetGroup: "B",
    isSelected: false,
  },
  {
    provinceId: 36,
    provinceName: "BANTEN",
    alphabetGroup: "B",
    isSelected: false,
  },
  {
    provinceId: 17,
    provinceName: "BENGKULU",
    alphabetGroup: "B",
    isSelected: false,
  },
  {
    provinceId: 34,
    provinceName: "DAERAH ISTIMEWA YOGYAKARTA",
    alphabetGroup: "D",
    isSelected: false,
  },
  {
    provinceId: 31,
    provinceName: "DKI JAKARTA",
    alphabetGroup: "D",
    isSelected: false,
  },
  {
    provinceId: 75,
    provinceName: "GORONTALO",
    alphabetGroup: "G",
    isSelected: false,
  },
  {
    provinceId: 15,
    provinceName: "JAMBI",
    alphabetGroup: "J",
    isSelected: false,
  },
  {
    provinceId: 32,
    provinceName: "JAWA BARAT",
    alphabetGroup: "J",
    isSelected: false,
  },
  {
    provinceId: 33,
    provinceName: "JAWA TENGAH",
    alphabetGroup: "J",
    isSelected: false,
  },
  {
    provinceId: 35,
    provinceName: "JAWA TIMUR",
    alphabetGroup: "J",
    isSelected: false,
  },
  {
    provinceId: 61,
    provinceName: "KALIMANTAN BARAT",
    alphabetGroup: "K",
    isSelected: false,
  },
  {
    provinceId: 63,
    provinceName: "KALIMANTAN SELATAN",
    alphabetGroup: "K",
    isSelected: false,
  },
  {
    provinceId: 62,
    provinceName: "KALIMANTAN TENGAH",
    alphabetGroup: "K",
    isSelected: false,
  },
  {
    provinceId: 64,
    provinceName: "KALIMANTAN TIMUR",
    alphabetGroup: "K",
    isSelected: false,
  },
  {
    provinceId: 65,
    provinceName: "KALIMANTAN UTARA",
    alphabetGroup: "K",
    isSelected: false,
  },
  {
    provinceId: 19,
    provinceName: "KEPULAUAN BANGKA BELITUNG",
    alphabetGroup: "K",
    isSelected: false,
  },
  {
    provinceId: 21,
    provinceName: "KEPULAUAN RIAU",
    alphabetGroup: "K",
    isSelected: false,
  },
  {
    provinceId: 18,
    provinceName: "LAMPUNG",
    alphabetGroup: "L",
    isSelected: false,
  },
  {
    provinceId: 81,
    provinceName: "MALUKU",
    alphabetGroup: "M",
    isSelected: false,
  },
  {
    provinceId: 82,
    provinceName: "MALUKU UTARA",
    alphabetGroup: "M",
    isSelected: false,
  },
  {
    provinceId: 52,
    provinceName: "NUSA TENGGARA BARAT",
    alphabetGroup: "N",
    isSelected: false,
  },
  {
    provinceId: 53,
    provinceName: "NUSA TENGGARA TIMUR",
    alphabetGroup: "N",
    isSelected: false,
  },
  {
    provinceId: 91,
    provinceName: "PAPUA",
    alphabetGroup: "P",
    isSelected: false,
  },
  {
    provinceId: 92,
    provinceName: "PAPUA BARAT",
    alphabetGroup: "P",
    isSelected: false,
  },
  {
    provinceId: 14,
    provinceName: "RIAU",
    alphabetGroup: "R",
    isSelected: false,
  },
  {
    provinceId: 76,
    provinceName: "SULAWESI BARAT",
    alphabetGroup: "S",
    isSelected: false,
  },
  {
    provinceId: 73,
    provinceName: "SULAWESI SELATAN",
    alphabetGroup: "S",
    isSelected: false,
  },
  {
    provinceId: 72,
    provinceName: "SULAWESI TENGAH",
    alphabetGroup: "S",
    isSelected: false,
  },
  {
    provinceId: 74,
    provinceName: "SULAWESI TENGGARA",
    alphabetGroup: "S",
    isSelected: false,
  },
  {
    provinceId: 71,
    provinceName: "SULAWESI UTARA",
    alphabetGroup: "S",
    isSelected: false,
  },
  {
    provinceId: 13,
    provinceName: "SUMATERA BARAT",
    alphabetGroup: "S",
    isSelected: false,
  },
  {
    provinceId: 16,
    provinceName: "SUMATERA SELATAN",
    alphabetGroup: "S",
    isSelected: false,
  },
  {
    provinceId: 12,
    provinceName: "SUMATERA UTARA",
    alphabetGroup: "S",
    isSelected: false,
  },
];

export const provinceNameMapping = {
  11: "ACEH",
  51: "BALI",
  36: "BANTEN",
  17: "BENGKULU",
  34: "DAERAH ISTIMEWA YOGYAKARTA",
  31: "DKI JAKARTA",
  75: "GORONTALO",
  15: "JAMBI",
  32: "JAWA BARAT",
  33: "JAWA TENGAH",
  35: "JAWA TIMUR",
  61: "KALIMANTAN BARAT",
  63: "KALIMANTAN SELATAN",
  62: "KALIMANTAN TENGAH",
  64: "KALIMANTAN TIMUR",
  65: "KALIMANTAN UTARA",
  19: "KEPULAUAN BANGKA BELITUNG",
  21: "KEPULAUAN RIAU",
  18: "LAMPUNG",
  81: "MALUKU",
  82: "MALUKU UTARA",
  52: "NUSA TENGGARA BARAT",
  53: "NUSA TENGGARA TIMUR",
  91: "PAPUA",
  92: "PAPUA BARAT",
  14: "RIAU",
  76: "SULAWESI BARAT",
  73: "SULAWESI SELATAN",
  72: "SULAWESI TENGAH",
  74: "SULAWESI TENGGARA",
  71: "SULAWESI UTARA",
  13: "SUMATERA BARAT",
  16: "SUMATERA SELATAN",
  12: "SUMATERA UTARA",
};

export function createMasterProvinsiSuccessResponse(
  provinsiData,
  pagination = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 34,
    itemsPerPage: 50,
  },
  searchParams = "search=&page=1&limit=50&excludeSelected=false"
) {
  const grouping = {};
  provinsiData.forEach((provinsi) => {
    const group = provinsi.alphabetGroup;
    grouping[group] = (grouping[group] || 0) + 1;
  });

  return {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: {
      provinsi: provinsiData,
      pagination,
      grouping,
    },
    Type: `/v1/transporter/settings/master/provinsi?${searchParams}`,
  };
}

export function createMasterProvinsiNoDataResponse(
  pagination = {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
  },
  searchParams = "search=&page=1&limit=10&excludeSelected=false"
) {
  return {
    Message: {
      Code: 404,
      Text: "Data provinsi tidak ditemukan",
    },
    Data: {
      provinsi: [],
      pagination,
      grouping: {},
    },
    Type: `/v1/transporter/settings/master/provinsi?${searchParams}`,
  };
}

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
