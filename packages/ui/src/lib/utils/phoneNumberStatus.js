export const PhoneNumberStatus = {
  VERIFIED: "VERIFIED",
  NOT_VERIFIED: "NOT_VERIFIED",
};

export const PHONE_NUMBER_STATUS_CONFIG = {
  [PhoneNumberStatus.VERIFIED]: {
    icon: "check16.svg",
    label: "Terverifikasi",
    color: "text-success-400",
  },
  [PhoneNumberStatus.NOT_VERIFIED]: {
    icon: "x-circle.svg",
    label: "Belum Terverifikasi",
    color: "text-error-400",
  },
};

export const getPhoneNumberStatus = (status) => {
  const config = PHONE_NUMBER_STATUS_CONFIG[status];
  if (!config) {
    return {
      icon: "x-circle.svg",
      label: status,
      color: "neutral",
    };
  }
  return config;
};
