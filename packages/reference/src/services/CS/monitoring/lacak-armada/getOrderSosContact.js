import useSWR from "swr";

import { fetcherMuatransCS } from "@/lib/fetcherBasicAuth";

const useMockData = true;

const apiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Contact information retrieved successfully",
    },
    Data: {
      transporter: {
        entityType: "TRANSPORTER", // dipake buat nge log percobaan contact
        entityId: "uuid-transporter", // dipake buat nge log percobaan contact

        phoneCall: {
          pics: [
            {
              name: "Ardian Eka", // [dbm_mt_transporter.picName] (PIC 1 - existing)
              position: "Manager", // [dbm_mt_transporter.picPosition] (PIC 1 - existing)
              phoneNumber: "081234567890", // [dbm_mt_transporter.picPhone] (PIC 1 - existing),
              Level: 1,
            },
            {
              name: "Jane Smith", // [dbm_mt_transporter.picName2]
              position: "Supervisor", // [dbm_mt_transporter.picPosition2]
              phoneNumber: "081234567890", // [dbm_mt_transporter.picPhone2],
              Level: 2,
            },
            {
              name: "Bob Wilson", // [dbm_mt_transporter.picName3]
              position: "Coordinator", // [dbm_mt_transporter.picPosition3]
              phoneNumber: "081234567890", // [dbm_mt_transporter.picPhone3],
              Level: 3,
            },
          ],
          emergencyContact: {
            name: "John Doe", // [dbm_mt_user.fullName]
            position: "Registrant", // Default value
            phoneNumber: "081234567890", // [dbm_mt_user.phoneNumber]
          },
          companyContact: "081234567890",
        },
      },
      driver: {
        entityType: "DRIVER", // dipake buat nge log percobaan contact
        entityId: "uuid-driver", // dipake buat nge log percobaan contact

        phoneCall: {
          pics: [
            {
              name: "John Doe", // [dbm_mt_transporter.picName] (PIC 1 - existing)
              position: "Manager", // [dbm_mt_transporter.picPosition] (PIC 1 - existing)
              phoneNumber: "081234567890", // [dbm_mt_transporter.picPhone] (PIC 1 - existing),
              Level: 1,
            },
            {
              name: "Jane Smith", // [dbm_mt_transporter.picName2]
              position: "Supervisor", // [dbm_mt_transporter.picPosition2]
              phoneNumber: "081234567890", // [dbm_mt_transporter.picPhone2],
              Level: 2,
            },
            {
              name: "Bob Wilson", // [dbm_mt_transporter.picName3]
              position: "Coordinator", // [dbm_mt_transporter.picPosition3]
              phoneNumber: "081234567890", // [dbm_mt_transporter.picPhone3],
              Level: 3,
            },
          ],
          emergencyContact: {
            name: "John Doe", // [dbm_mt_user.fullName]
            position: "Registrant", // Default value
            phoneNumber: "081234567890", // [dbm_mt_user.phoneNumber]
          },
          companyContact: "081234567890",
        },
      },
    },
    Type: "CONTACT_INFORMATION",
  },
};

export const getOrderSosContact = async (vehicleId) => {
  if (useMockData) {
    const result = apiResult;
    return result.data.Data;
  }

  const result = await fetcherMuatransCS.get(
    `v1/cs/orders/contacts/${vehicleId}`
  );
  return result?.data?.Data || {};
};

export const useGetOrderSosContact = (vehicleId) =>
  useSWR(vehicleId ? ["get-order-sos-contact", vehicleId] : null, () =>
    getOrderSosContact(vehicleId)
  );
