import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true; // Set to false when real API is ready

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Informasi kontak berhasil diambil",
    },
    Data: {
      transporterContacts: {
        companyName: "PT Transportasi Mandiri Sejahtera",
        mainPhone: "+62812-3456-7890",
        pics: [
          {
            picId: "pic-001",
            name: "Ahmad Sutanto",
            position: "Operations Manager",
            phoneNumber: "+62811-2345-6789",
            email: "ahmad.sutanto@transportasi.com",
            isPrimary: true,
          },
          {
            picId: "pic-002",
            name: "Sari Dewi",
            position: "Fleet Coordinator",
            phoneNumber: "+62813-4567-8901",
            email: "sari.dewi@transportasi.com",
            isPrimary: false,
          },
          {
            picId: "pic-003",
            name: "Budi Prasetyo",
            position: "Customer Service",
            phoneNumber: "+62814-5678-9012",
            email: "budi.prasetyo@transportasi.com",
            isPrimary: false,
          },
        ],
        emergencyContact: {
          name: "Rudi Hartono",
          position: "Emergency Response Manager",
          phoneNumber: "+62815-6789-0123",
        },
      },
      shipperContacts: {
        companyName: "PT Sumber Makmur Industries",
        mainPhone: "+62821-9876-5432",
        pics: [
          {
            picId: "shipper-pic-001",
            name: "Lisa Margaretha",
            position: "Logistics Manager",
            phoneNumber: "+62822-8765-4321",
            email: "lisa.margaretha@sumbermakmur.com",
            isPrimary: true,
          },
          {
            picId: "shipper-pic-002",
            name: "Andi Wijaya",
            position: "Procurement Officer",
            phoneNumber: "+62823-7654-3210",
            email: "andi.wijaya@sumbermakmur.com",
            isPrimary: false,
          },
        ],
        emergencyContact: {
          name: "Indra Kusuma",
          position: "Operations Director",
          phoneNumber: "+62824-6543-2109",
        },
      },
    },
    Type: "ORDER_CONTACTS",
  },
};

// Fetcher function
export const getOrderContacts = async (orderId) => {
  let result;
  if (useMockData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(
      `/v1/cs/active-orders/${orderId}/contacts`
    );
  }
  return result.data.Data;
};

// SWR hook for GET request
export const useGetOrderContacts = (orderId) =>
  useSWR(orderId ? `order-contacts/${orderId}` : null, () =>
    getOrderContacts(orderId)
  );

// Transform function to convert API data to HubungiModal format
export const transformContactsForHubungiModal = (apiData) => {
  if (!apiData) return null;

  const { transporterContacts, shipperContacts } = apiData;

  // Transform transporter contacts to the format expected by HubungiModal
  const transformedContacts = {
    pics: [],
    emergencyContact: null,
    companyContact: null,
  };

  // Add transporter PICs (up to 3 positions as expected by HubungiModal)
  if (transporterContacts?.pics) {
    transformedContacts.pics = transporterContacts.pics
      .slice(0, 3)
      .map((pic, index) => ({
        name: pic.name,
        position: pic.position,
        phoneNumber: pic.phoneNumber,
        Level: index + 1,
      }));
  }

  // Fill remaining positions with empty data if needed
  while (transformedContacts.pics.length < 3) {
    transformedContacts.pics.push({
      name: "-",
      position: "-",
      phoneNumber: "",
      Level: transformedContacts.pics.length + 1,
    });
  }

  // Set emergency contact
  if (transporterContacts?.emergencyContact) {
    transformedContacts.emergencyContact = {
      name: transporterContacts.emergencyContact.name,
      position: transporterContacts.emergencyContact.position,
      phoneNumber: transporterContacts.emergencyContact.phoneNumber,
    };
  }

  transformedContacts.companyContact = transporterContacts?.mainPhone || "";
  return transformedContacts;
};
