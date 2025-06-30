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
  [PaymentMethodEnum.VA_BCA]: "BCA Virtual Account",
  [PaymentMethodEnum.VA_BNI]: "BNI Virtual Account",
  [PaymentMethodEnum.VA_BRI]: "BRI Virtual Account",
  [PaymentMethodEnum.VA_BSI]: "BSI Virtual Account",
  [PaymentMethodEnum.VA_CIMB]: "CIMB Virtual Account",
  [PaymentMethodEnum.VA_MANDIRI]: "Mandiri Virtual Account",
  [PaymentMethodEnum.VA_PERMATA]: "Permata Virtual Account",
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
  [PaymentMethodEnum.VA_BCA]: "/icons/payment/va_bca.svg",
  [PaymentMethodEnum.VA_BNI]: "/icons/payment/va_bni.svg",
  [PaymentMethodEnum.VA_BRI]: "/icons/payment/va_bri.svg",
  [PaymentMethodEnum.VA_BSI]: "/icons/payment/va_bsi.svg",
  [PaymentMethodEnum.VA_CIMB]: "/icons/payment/va_cimb.svg",
  [PaymentMethodEnum.VA_MANDIRI]: "/icons/payment/va_mandiri.svg",
  [PaymentMethodEnum.VA_PERMATA]: "/icons/payment/va_permata.svg",
};

export const PaymentMethodIconFromTitle = {
  "Permata Virtual Account": "/icons/payment/va_permata.svg",
  "BRI Virtual Account": "/icons/payment/va_bri.svg",
  "BCA Virtual Account": "/icons/payment/va_bca.svg",
  "Mandiri Virtual Account": "/icons/payment/va_mandiri.svg",
  "BNI Virtual Account": "/icons/payment/va_bni.svg",
};
