// Helper: cari nama kecamatan dari list by id
const findNameById = (list, id) =>
  list?.find((item) => String(item.value) === String(id))?.name || "";

// Mapper utama
const mapZustandToApiPayload = (zustandData) => {
  if (!zustandData) return null;

  const docs = zustandData.documents || {};

  // Helper dokumen
  const firstUrl = (arr) =>
    Array.isArray(arr) && arr.length > 0 ? arr[0]?.url || "" : "";

  const urls = (arr) =>
    Array.isArray(arr) ? arr.map((d) => d?.url).filter(Boolean) : [];

  const mapNamedArray = (arr) =>
    Array.isArray(arr)
      ? arr
          .filter((d) => d?.url)
          .map((d) => ({ name: d.name || "", Url: d.url })) // "Url" per kontrak API
      : [];

  // Filter kontak yang isi minimal (name, position, phone), tambahkan level 1..n
  const filteredContacts = (
    Array.isArray(zustandData.contacts) ? zustandData.contacts : []
  )
    .filter((c) => c?.name?.trim() && c?.position?.trim() && c?.phone?.trim())
    .slice(0, 3) // maksimal 3 PIC sesuai contoh level 1..3
    .map((c, idx) => ({
      name: c.name.trim(),
      position: c.position.trim(),
      phone: c.phone.trim(),
      level: idx + 1, // 1, 2, 3
    }));

  const { locationData = {} } = zustandData;

  const payload = {
    registrantName: zustandData.registrantName || "",
    registrantPosition: zustandData.registrantPosition || "",
    registrantWhatsapp: zustandData.registrantWhatsapp || "",
    registrantEmail: zustandData.registrantEmail || "",
    companyLogo: zustandData.companyLogo || "",
    companyName: zustandData.companyName || "",
    businessEntityType: zustandData.businessEntityType || "",
    companyPhone: zustandData.companyPhone || "",
    companyAddress: zustandData.companyAddress || "",
    locationData: {
      location: locationData.location || "",
      latitude:
        locationData.latitude !== undefined
          ? parseFloat(locationData.latitude)
          : null,
      longitude:
        locationData.longitude !== undefined
          ? parseFloat(locationData.longitude)
          : null,
      district: findNameById(locationData.kecamatanList, locationData.district),
      districtId:
        locationData.district !== undefined
          ? parseInt(locationData.district, 10)
          : null,
      city: locationData.city || "",
      cityId:
        locationData.cityId !== undefined
          ? parseInt(locationData.cityId, 10)
          : null,
      province: locationData.province || "",
      provinceId:
        locationData.provinceId !== undefined
          ? parseInt(locationData.provinceId, 10)
          : null,
      postalCode: locationData.postalCode || "",
      placeId: locationData.placeId || undefined, // opsional → hilangkan kalau kosong
    },
    bankId: zustandData.bankId || "",
    accountNumber: zustandData.accountNumber || "",
    accountName: zustandData.accountName || "",
    nibNumber: zustandData.nibNumber || "",
    npwpNumber: zustandData.npwpNumber || "",
    ktpNumber: zustandData.ktpNumber || "",

    // Struktur documents sesuai API baru:
    documents: {
      // nib: array of string URL
      nib: urls(docs.nib),

      // npwp & ktp: single string URL (ambil file pertama)
      npwp: firstUrl(docs.npwp),
      ktp: firstUrl(docs.ktp),

      // berikut: array of objects { name, Url }
      aktaPendirian: mapNamedArray(docs.aktaPendirian),
      skKemenkumham: mapNamedArray(docs.skKemenkumham),
      aktaPerubahan: mapNamedArray(docs.aktaPerubahan),
      skKemenkumhamPerubahan: mapNamedArray(docs.skKemenkumhamPerubahan),
      sertifikatStandar: mapNamedArray(docs.sertifikatStandar),
    },

    contacts: filteredContacts,
  };

  // Bersihkan key opsional kosong:
  if (!payload.locationData.placeId) delete payload.locationData.placeId;

  return payload;
};

export default mapZustandToApiPayload;
