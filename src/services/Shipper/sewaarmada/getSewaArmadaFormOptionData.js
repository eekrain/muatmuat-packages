import { useSWRHook } from "@/hooks/use-swr";
import { fetcherPayment } from "@/lib/axios";

const cargoTypesDummyData = [
  {
    id: "f483709a-de4c-4541-b29e-6f4d9a912331",
    name: "Barang Mentah",
    description: "Material atau komponen yang belum diproses.",
  },
  {
    id: "f483709a-de4c-4541-b29e-6f4d9a912332",
    name: "Barang Setengah Jadi",
    description:
      "Produk yang telah mengalami beberapa tahap proses tapi belum selesai.",
  },
  {
    id: "f483709a-de4c-4541-b29e-6f4d9a912333",
    name: "Barang Jadi",
    description: "Produk akhir yang siap untuk digunakan atau dijual.",
  },
  {
    id: "f483709a-de4c-4541-b29e-6f4d9a912334",
    name: "Lainnya",
    description:
      "Bahan / barang yang tidak sesuai dengan jenis diatas, namun tetap memiliki fungsi dalam proses produksi atau distribusi.",
  },
];

const cargoCategoriesDummyData = [
  {
    id: "f483709a-de4c-4541-b29e-6f4d9a912331",
    name: "Padat",
    description: "Muatan yang berbentuk solid.",
  },
  {
    id: "f483709a-de4c-4541-b29e-6f4d9a912332",
    name: "Cair",
    description:
      "Muatan dalam bentuk cairan, biasanya membutuhkan penanganan khusus.",
  },
  {
    id: "f483709a-de4c-4541-b29e-6f4d9a912333",
    name: "Curah",
    description:
      "Muatan yang dikirim secara massal, seperti biji-bijian atau pasir.",
  },
  {
    id: "f483709a-de4c-4541-b29e-6f4d9a912334",
    name: "Kendaraan",
    description: "Muatan berupa alat transportasi yang perlu diangkut.",
  },
  {
    id: "f483709a-de4c-4541-b29e-6f4d9a912335",
    name: "Container",
    description: "Muatan yang dikemas dalam suatu container.",
  },
];

const additionalServicesDummyData = [
  {
    additionalServiceId: "b98a7cc7-54cf-4816-ba77-bb0b410caef0",
    name: "Kirim Bukti Fisik Penerimaan Barang",
    description: "Deskripsi Kirim Bukti Fisik Penerimaan Barang",
    price: 0,
    withShipping: true,
  },
  {
    additionalServiceId: "66b24c35-8950-4fd3-8ee1-ae14e0cae7c6",
    name: "Bantuan Tambahan",
    description: "Deskripsi Bantuan Tambahan",
    price: 100000,
    withShipping: false,
  },
  {
    additionalServiceId: "96a515fe-ee8c-4456-8af2-249bb0b3250b",
    name: "Troli",
    description: "Deskripsi Troli",
    price: 100000,
    withShipping: false,
  },
];

const paymentMethodsDummyData = [
  {
    channel: "VA",
    category: "Transfer Virtual Account",
    icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1739244169458.webp",
    methods: [
      {
        id: "874df675-a424-4e41-a2b4-07b8c05b6c2f",
        name: "Permata Virtual Account",
        code: "permata",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736740165999.webp",
        paymentType: "permata",
        fee: "4000.00",
        feeUnit: "currency",
        additionalFee: "0.00",
        subsidy: "3000.00",
      },
      {
        id: "83351a03-b112-4320-b7df-a59d0cd91876",
        name: "BRI Virtual Account",
        code: "bri",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736740241479.webp",
        paymentType: "bank_transfer",
        fee: "4000.00",
        feeUnit: "currency",
        additionalFee: "0.00",
        subsidy: "3000.00",
      },
      {
        id: "d2aa95f5-6b8e-4272-b922-624234c443a3",
        name: "BCA Virtual Account",
        code: "bca",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736740281046.webp",
        paymentType: "bank_transfer",
        fee: "4000.00",
        feeUnit: "currency",
        additionalFee: "0.00",
        subsidy: "3000.00",
      },
      {
        id: "9cb40c45-4145-45df-9b29-39db93978650",
        name: "Mandiri Virtual Account",
        code: "mandiri",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736740259536.webp",
        paymentType: "echannel",
        fee: "4000.00",
        feeUnit: "currency",
        additionalFee: "0.00",
        subsidy: "3000.00",
      },
      {
        id: "06ee2880-ddb9-4add-860a-51de97b17a31",
        name: "BNI Virtual Account",
        code: "bni",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736740223222.webp",
        paymentType: "bank_transfer",
        fee: "4000.00",
        feeUnit: "currency",
        additionalFee: "0.00",
        subsidy: "3000.00",
      },
    ],
  },
  {
    channel: "CREDIT_CARD",
    category: "Kartu Kredit",
    icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1739244052489.webp",
    methods: [
      {
        id: "e558c153-a618-4d14-ab8b-b6210e1b3c3a",
        name: "Credit Card",
        code: "credit_card",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1739244052489.webp",
        paymentType: "credit_card",
        fee: "2.90",
        feeUnit: "percentage",
        additionalFee: "2000.00",
        subsidy: "0.00",
      },
    ],
  },
  {
    channel: "QRIS",
    category: "QRIS",
    icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1739244052489.webp",
    methods: [
      {
        id: "82f6d054-b81e-4fb7-9af1-0cfb98757e19",
        name: "QRIS",
        code: "qris",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1739245433414.webp",
        paymentType: "qris",
        fee: "0.70",
        feeUnit: "percentage",
        additionalFee: "0.00",
        subsidy: "0.00",
      },
    ],
  },
];

const settingsTimeDummyData = {
  instantOrder: {
    minHoursFromNow: 2,
    maxDaysFromNow: 1,
  },
  scheduledOrder: {
    minDaysFromNow: 2,
    maxDaysFromNow: 30,
  },
  loadingTime: {
    minRangeHours: 1,
    maxRangeHours: 8,
  },
  waitingTime: {
    toleranceHours: 12,
    hourlyRate: 100000,
  },
  location: {
    maxPickup: 2,
    maxDropoff: 2,
  },
  currentServerTime: "2025-07-21 15:11:48",
};

const useGetSewaArmadaFormOptionData = () => {
  // Fetch cargo types using SWR
  const { data: cargoTypesData } = useSWRHook("v1/orders/cargos/types");
  // Fetch cargo categories using SWR
  const { data: cargoCategoriesData } = useSWRHook(
    "v1/orders/cargos/categories"
  );
  // Fetch layanan tambahan dari API
  const { data: additionalServicesData } = useSWRHook(
    "v1/orders/additional-services"
  );
  // Fetch payment methods using SWR
  const { data: paymentMethodsData } = useSWRHook(
    "v1/payment/methods",
    fetcherPayment
  );
  const { data: settingsTimeData } = useSWRHook("v1/orders/settings/time");

  // Toogle use dummy data
  const useDummyData_cargoTypes = false;
  const useDummyData_cargoCategories = false;
  const useDummyData_additionalServices = false;
  const useDummyData_paymentMethods = false;
  const useDummyData_settingsTime = false;

  // Extract cargo types from response
  const cargoTypes = useDummyData_cargoTypes
    ? cargoTypesDummyData
    : cargoTypesData?.Data?.types || [];
  // Extract cargo categories from response
  const cargoCategories = useDummyData_cargoCategories
    ? cargoCategoriesDummyData
    : cargoCategoriesData?.Data?.categories || [];
  const additionalServicesOptions = useDummyData_additionalServices
    ? additionalServicesDummyData
    : additionalServicesData?.Data.services || [];
  // Use the API data directly or fall back to an empty array
  const paymentMethods = useDummyData_paymentMethods
    ? paymentMethodsDummyData
    : paymentMethodsData?.Data || [];
  const settingsTime = useDummyData_settingsTime
    ? settingsTimeDummyData
    : settingsTimeData?.Data || null;

  return {
    cargoTypes,
    cargoCategories,
    additionalServicesOptions,
    paymentMethods,
    settingsTime,
  };
};

export default useGetSewaArmadaFormOptionData;
