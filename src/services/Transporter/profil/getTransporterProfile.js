import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;
// Mock API result for development/testing
export const mockAPIResult = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    user: {
      id: "0681f5a7-daf0-4581-b593-9d017c2cfd85",
      fullName: "Friday Andita Rachmad Santoso",
      email: "fridayars@gmail.com",
      phoneNumber: "081357652067",
      position: "CEO",
      profileImage:
        "https://azlogistik.s3.ap-southeast-3.amazonaws.com/uploads/menu%20buyer%2010%20%26%2011_2-1755504739036.webp",
      initials: "FS",
      isEmailVerified: true,
      isPhoneVerified: true,
      lastPasswordChangeAt: "2025-08-18T08:12:19.426Z",
      passwordChangeCount: 1,
    },
    transporter: {
      id: "0681f5a7-daf0-4581-b593-9d017c2cfd85",
      companyName: "SARI AGUNG",
      companyAddress: "Jl. Sulawesi No. 13",
      companyLocation: null,
      businessLicenseNumber: "",
      companyLogo: "https://s3.webp",
      companyPhone: null,
      taxId: null,
      verificationStatus: "VERIFIED",
      isHalalCertified: false,
      halalCertificateNo: null,
      halalExpiryDate: null,
      locationPrecision: "HIGH",
      district: null,
      city: null,
      province: null,
      postalCode: null,
      coordinates: {
        latitude: null,
        longitude: null,
      },
    },
    picContacts: [
      {
        id: "8543241f-54d0-42f2-a9a7-74b187c31579",
        picOrder: 1,
        picName: "Ahmad Budiman",
        picPosition: "Operations Manager",
        phoneNumber: "628064749070",
        isActive: true,
      },
      {
        id: "5d66edce-0fb3-4c10-8a97-f3b4c2b28f6a",
        picOrder: 2,
        picName: "Sari Dewi",
        picPosition: "Customer Service Manager",
        phoneNumber: "628064749071",
        isActive: true,
      },
      {
        id: "86028452-1cb6-407b-9d4f-37aadf5d38c3",
        picOrder: 3,
        picName: "Budi Santoso",
        picPosition: "Technical Support",
        phoneNumber: "628064749072",
        isActive: true,
      },
    ],
    banks: [
      {
        id: "4e9efb66-9be0-419b-b38e-7232915f7245",
        bankName: "Bank Negara Indonesia",
        accountNumber: "1234567890",
        accountHolderName: "PT Sari Agung",
        isActive: true,
      },
    ],
    documents: [],
    displaySettings: {
      hideEmptyFields: true,
      showInitialsForEmptyPhoto: true,
      enableLocationMap: true,
    },
  },
  Type: "/v1/transporter/profile",
};

// Fetcher function
export const getTransporterProfile = async () => {
  let result;
  if (useMockData) {
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get("/v1/transporter/profile");
  }
  const data = result.data.Data;
  return data;
};

// SWR hook for GET request
export const useGetTransporterProfile = () =>
  useSWR("transporter-profile", getTransporterProfile);
