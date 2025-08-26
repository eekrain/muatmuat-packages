export const successResponse = {
  Message: {
    Code: 200,
    Text: "Informasi kontak berhasil diambil",
  },
  Data: {
    transporterContacts: {
      companyName: "PT Transportasi Mandiri Sejahtera",
      mainPhone: "0812-3456-7890",
      pics: [
        {
          picId: "pic-001",
          name: "Ahmad Sutanto",
          position: "Operations Manager",
          phoneNumber: "0811-2345-6789",
          email: "ahmad.sutanto@transportasi.com",
          isPrimary: true,
        },
        {
          picId: "pic-002",
          name: "Sari Dewi",
          position: "Fleet Coordinator",
          phoneNumber: "0813-4567-8901",
          email: "sari.dewi@transportasi.com",
          isPrimary: false,
        },
        {
          picId: "pic-003",
          name: "Budi Prasetyo",
          position: "Customer Service",
          phoneNumber: "0814-5678-9012",
          email: "budi.prasetyo@transportasi.com",
          isPrimary: false,
        },
      ],
      emergencyContact: {
        name: "Rudi Hartono",
        position: "Emergency Response Manager",
        phoneNumber: "0815-6789-0123",
      },
    },
    shipperContacts: {
      companyName: "PT Sumber Makmur Industries",
      mainPhone: "0821-9876-5432",
      pics: [
        {
          picId: "shipper-pic-001",
          name: "Lisa Margaretha",
          position: "Logistics Manager",
          phoneNumber: "0822-8765-4321",
          email: "lisa.margaretha@sumbermakmur.com",
          isPrimary: true,
        },
        {
          picId: "shipper-pic-002",
          name: "Andi Wijaya",
          position: "Procurement Officer",
          phoneNumber: "0823-7654-3210",
          email: "andi.wijaya@sumbermakmur.com",
          isPrimary: false,
        },
      ],
      emergencyContact: {
        name: "Indra Kusuma",
        position: "Operations Director",
        phoneNumber: "0824-6543-2109",
      },
    },
  },
  Type: "ORDER_CONTACTS",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Order ID tidak valid atau tidak ditemukan",
  },
  Data: null,
  Type: "ORDER_CONTACTS",
};

export const serverErrorResponse = {
  Message: {
    Code: 500,
    Text: "Terjadi kesalahan pada server",
  },
  Data: null,
  Type: "ORDER_CONTACTS",
};
