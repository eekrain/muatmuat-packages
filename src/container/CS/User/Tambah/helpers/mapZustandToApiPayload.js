// Helper function to map Zustand data to the API payload format

const mapZustandToApiPayload = (zustandData) => {
  if (!zustandData) return null;

  // Helper untuk mencari nama dari list berdasarkan value/id
  const findNameById = (list, id) =>
    list?.find((item) => item.value === id)?.name || "";

  // Transformasi dokumen: dari array of objects ke array of URLs
  const mappedDocuments = {};
  for (const key in zustandData.documents) {
    const docArray = zustandData.documents[key];
    if (Array.isArray(docArray) && docArray.length > 0) {
      // Untuk NPWP/KTP yang 'single', ambil URL pertama. Untuk yang lain, ambil semua URL.
      // API contract Anda sedikit ambigu, jadi kita asumsikan 'npwp' & 'ktp' hanya 1 file.
      if (key === "npwp" || key === "ktp") {
        mappedDocuments[key] = docArray[0]?.url;
      } else {
        mappedDocuments[key] = docArray.map((doc) => doc.url);
      }
    } else {
      mappedDocuments[key] = []; // Kirim array kosong jika tidak ada
    }
  }

  // Filter kontak PIC yang kosong
  const filteredContacts = zustandData.contacts.filter(
    (contact) =>
      contact.name?.trim() && contact.position?.trim() && contact.phone?.trim()
  );

  return {
    registrantName: zustandData.registrantName,
    registrantPosition: zustandData.registrantPosition,
    registrantWhatsapp: zustandData.registrantWhatsapp,
    registrantEmail: zustandData.registrantEmail,
    companyLogo: zustandData.companyLogo,
    companyName: zustandData.companyName,
    businessEntityType: zustandData.businessEntityType,
    companyPhone: zustandData.companyPhone,
    companyAddress: zustandData.companyAddress,
    locationData: {
      location: zustandData.locationData.location,
      latitude: parseFloat(zustandData.locationData.latitude),
      longitude: parseFloat(zustandData.locationData.longitude),
      district: findNameById(
        zustandData.locationData.kecamatanList,
        zustandData.locationData.district
      ),
      districtId: parseInt(zustandData.locationData.district),
      city: zustandData.locationData.city,
      cityId: parseInt(zustandData.locationData.cityId),
      province: zustandData.locationData.province,
      provinceId: parseInt(zustandData.locationData.provinceId),
      postalCode: zustandData.locationData.postalCode,
      placeId: zustandData.locationData.placeId,
    },
    bankId: zustandData.bankId,
    accountNumber: zustandData.accountNumber,
    accountName: zustandData.accountName,
    nibNumber: zustandData.nibNumber,
    npwpNumber: zustandData.npwpNumber,
    ktpNumber: zustandData.ktpNumber,
    documents: mappedDocuments,
    contacts: filteredContacts,
  };
};

export default mapZustandToApiPayload;
