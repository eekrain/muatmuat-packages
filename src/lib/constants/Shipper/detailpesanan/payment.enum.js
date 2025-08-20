export const PaymentMethodEnum = {
  VA_BCA: "va_bca",
  VA_BNI: "va_bni",
  VA_BRI: "va_bri",
  VA_BSI: "va_bsi",
  VA_CIMB: "va_cimb",
  VA_MANDIRI: "va_mandiri",
  VA_PERMATA: "va_permata",
};

export const PaymentMethodTitle = {
  va_bca: "BCA Virtual Account",
  va_bni: "BNI Virtual Account",
  va_bri: "BRI Virtual Account",
  va_bsi: "BSI Virtual Account",
  va_cimb: "CIMB Virtual Account",
  va_mandiri: "Mandiri Virtual Account",
  va_permata: "Permata Virtual Account",
};

export const PaymentInstructionEnum = {
  ATM: "atm",
  INTERNET_BANKING: "internetBanking",
  MOBILE_BANKING: "mobileBanking",
  BANK_OFFICE: "bankOffice",
};

export const PaymentInstructionTitle = {
  [PaymentInstructionEnum.ATM]: "ATM",
  [PaymentInstructionEnum.INTERNET_BANKING]: "Internet Banking",
  [PaymentInstructionEnum.MOBILE_BANKING]: "Mobile Banking",
  [PaymentInstructionEnum.BANK_OFFICE]: "Bank Office",
};

export const PaymentMethodIconFromMethod = {
  va_bca: "/icons/payment/va_bca.svg",
  va_bni: "/icons/payment/va_bni.svg",
  va_bri: "/icons/payment/va_bri.svg",
  va_bsi: "/icons/payment/va_bsi.svg",
  va_cimb: "/icons/payment/va_cimb.svg",
  va_mandiri: "/icons/payment/va_mandiri.svg",
  va_permata: "/icons/payment/va_permata.svg",
};

export const PaymentMethodIconFromTitle = {
  "Permata Virtual Account": "/icons/payment/va_permata.svg",
  "BRI Virtual Account": "/icons/payment/va_bri.svg",
  "BCA Virtual Account": "/icons/payment/va_bca.svg",
  "Mandiri Virtual Account": "/icons/payment/va_mandiri.svg",
  "BNI Virtual Account": "/icons/payment/va_bni.svg",
};
