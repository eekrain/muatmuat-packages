// Mock data and fetcher for Get Shipper Contact Information
import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const IS_MOCK = true;

const apiResultShipperContact = {
  Message: {
    Code: 200,
    Text: "Successfully retrieved shipper contact information",
  },
  Data: {
    shipper: {
      id: "shipper-uuid-1",
      name: "PT Shipper ABC",
      logo: "https://cdn.example.com/logo.jpg",
    },
    primaryContact: {
      phone: "+628123456789",
      email: "shipper@example.com",
      whatsapp: "+628123456789",
      isPreferred: true,
    },
    picContacts: [
      {
        name: "John Doe",
        phone: "+628111111111",
        position: "Logistics Manager",
        whatsapp: "+628111111111",
        isPreferred: true,
      },
      {
        name: "Jane Smith",
        phone: "+628222222222",
        position: "Operations Head",
        whatsapp: "+628222222222",
        isPreferred: false,
      },
    ],
    emergencyContact: {
      name: "Emergency Person",
      phone: "+628999999999",
      whatsapp: "+628999999999",
      relationship: "Emergency Contact",
    },
    preferredMethod: "whatsapp",
    contactOptions: [
      {
        type: "whatsapp",
        label: "WhatsApp",
        number: "+628111111111",
        isAvailable: true,
        deepLink: "https://wa.me/628111111111",
      },
      {
        type: "phone",
        label: "Telepon",
        number: "+628111111111",
        isAvailable: true,
        action: "call",
      },
      {
        type: "email",
        label: "Email",
        address: "shipper@example.com",
        isAvailable: true,
        action: "mailto",
      },
    ],
  },
  Type: "SHIPPER_CONTACT",
};

export const fetcherShipperContact = async (shipperId, params = {}) => {
  if (IS_MOCK) {
    // Deep clone to avoid mutation
    const result = JSON.parse(JSON.stringify(apiResultShipperContact));
    // Example filter by shipperId
    if (params.shipperId && result.Data.shipper.id !== params.shipperId) {
      return null;
    }
    // Example search by name
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      if (!result.Data.shipper.name.toLowerCase().includes(searchLower)) {
        return null;
      }
    }
    return result.Data;
  }

  // Real API
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append("search", params.search);
  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `/v1/cs/transport-request/shippers/${shipperId}/contacts?${queryString}`
    : `/v1/cs/transport-request/shippers/${shipperId}/contacts`;

  const result = await fetcherMuatrans.get(endpoint);
  return result?.data?.Data || {};
};

export const useGetShipperContact = (shipperId, params = {}) => {
  const cacheKey = shipperId
    ? `shipper-contact-${shipperId}-${JSON.stringify(params)}`
    : "shipper-contact";
  return useSWR(cacheKey, () => fetcherShipperContact(shipperId, params));
};
