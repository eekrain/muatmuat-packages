const useMockData = true;

export const mockShipperContact = {
  Message: {
    Code: 200,
    Text: "Successfully retrieved shipper contact information",
  },
  Data: {
    shipper: {
      id: "uuid",
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
        name: "Indra Ganteng",
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

export const getShipperContact = async (id) => {
  let result;
  if (useMockData) {
    result = mockShipperContact;
  } else {
    // Ganti dengan fetcherMuatrans jika sudah ada
    // result = await fetcherMuatrans.get(`/v1/cs/transport-request/shippers/${id}/contacts`);
    result = {};
  }
  return {
    data: result?.Data || {},
    message: result?.Message || {},
    type: result?.Type,
    raw: result,
    success: result?.Message?.Code === 200,
  };
};
