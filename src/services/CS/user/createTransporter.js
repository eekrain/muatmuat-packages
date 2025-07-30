import useSWRMutation from "swr/mutation";

const apiResultPostTransporter = {
  data: {
    Message: {
      Code: 201,
      Text: "Transporter successfully created",
    },
    Data: {
      transporter: {
        id: "550e8400-e29b-41d4-a716-446655440010",
        name: "",
        phoneNumber: "",
        profileImage: "",
        transporterStatus: "PENDING",
        verificationStatus: "NOT_VERIFIED",
        fleet: null,
        createdAt: new Date().toISOString(),
        warningDocumentExpired: false,
        pendingUpdateTransporter: false,
      },
    },
    Type: "CREATE_TRANSPORTER",
  },
};

export const fetcherPostTransporter = async (_, { arg }) => {
  // Body structure based on Untitled-1.json:
  const requestBody = {
    transporterId: arg.transporterId || "uuid-transporter",
    registrantName: arg.registrantName,
    registrantPosition: arg.registrantPosition,
    registrantWhatsapp: arg.registrantWhatsapp,
    registrantEmail: arg.registrantEmail,
    companyName: arg.companyName,
    businessEntityType: arg.businessEntityType,
    companyPhone: arg.companyPhone,
    companyAddress: arg.companyAddress,
    addressType: arg.addressType || "HEAD_OFFICE",
    locationData: {
      latitude: arg.locationData?.latitude,
      longitude: arg.locationData?.longitude,
      district: arg.locationData?.district,
      city: arg.locationData?.city,
      province: arg.locationData?.province,
      postalCode: arg.locationData?.postalCode,
      placeId: arg.locationData?.placeId,
    },
    bankId: arg.bankId,
    accountNumber: arg.accountNumber,
    accountName: arg.accountName,
    nibNumber: arg.nibNumber,
    npwpNumber: arg.npwpNumber,
    ktpNumber: arg.ktpNumber,
    companyRegistrationNumber: arg.companyRegistrationNumber,
    documents: {
      nib: arg.documents?.nib || [],
      npwp: arg.documents?.npwp,
      ktp: arg.documents?.ktp,
      companyProfile: arg.documents?.companyProfile || [],
      siup: arg.documents?.siup || [],
      tdp: arg.documents?.tdp || [],
      certificateStandard: arg.documents?.certificateStandard || [],
    },
    contacts: arg.contacts || [],
  };

  // When API is ready, uncomment and use:
  // const result = await fetcherMuatrans.post("v1/transporters", requestBody);
  // return result?.data?.Data || {};

  console.log("Request body:", requestBody);

  // Mock implementation - simulate API response
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockResponse = {
    ...apiResultPostTransporter.data.Data,
    transporter: {
      ...apiResultPostTransporter.data.Data.transporter,
      id: `550e8400-e29b-41d4-a716-${Date.now()}`,
      name: arg.registrantName,
      phoneNumber: arg.registrantWhatsapp,
      profileImage: "",
      createdAt: new Date().toISOString(),
    },
  };

  return mockResponse;
};

export const usePostTransporter = () => {
  return useSWRMutation("v1/transporters", fetcherPostTransporter, {
    throwOnError: false,
    revalidate: false,
  });
};

// Example usage in component:
// import { usePostTransporter } from "@/services/CS/user/createTransporter";
//
// const { trigger, isMutating } = usePostTransporter();
//
// const handleSubmit = async (data) => {
//   // Pass the transporter data object directly
//   const transporterData = {
//     registrantName: data.registrantName,
//     registrantPosition: data.registrantPosition,
//     registrantWhatsapp: data.registrantWhatsapp,
//     registrantEmail: data.registrantEmail,
//     companyName: data.companyName,
//     businessEntityType: data.businessEntityType,
//     companyPhone: data.companyPhone,
//     companyAddress: data.companyAddress,
//     locationData: data.locationData,
//     bankId: data.bankId,
//     accountNumber: data.accountNumber,
//     accountName: data.accountName,
//     nibNumber: data.nibNumber,
//     npwpNumber: data.npwpNumber,
//     ktpNumber: data.ktpNumber,
//     companyRegistrationNumber: data.companyRegistrationNumber,
//     documents: data.documents,
//     contacts: data.contacts
//   };
//
//   try {
//     const result = await trigger(transporterData);
//     // Handle success
//   } catch (error) {
//     // Handle error
//   }
// };
