// Mapper terbaru: dari data Zustand (local storage) -> payload API baru
const mapZustandToApiPayloadV2 = (zustandData) => {
  if (!zustandData) return null;

  // --- Helpers ---
  const toFloat = (v) =>
    v === null || v === undefined || v === "" ? null : parseFloat(v);
  const toInt = (v) =>
    v === null || v === undefined || v === "" ? null : parseInt(v, 10);
  const safeStr = (v) => (typeof v === "string" ? v.trim() : v);

  const findNameById = (list, id) =>
    list?.find((item) => String(item.value) === String(id))?.name || "";

  // Pastikan semua key dokumen ada, walau kosong
  const DOCUMENT_KEYS = [
    "nib",
    "npwp",
    "ktp",
    "aktaPendirian",
    "skKemenkumham",
    "aktaPerubahan", // opsional
    "skKemenkumhamPerubahan", // opsional
    "sertifikatStandar", // opsional
  ];

  // Label default dokumen bila tidak ada 'name' di local storage
  const DEFAULT_DOC_LABEL = {
    nib: "NIB",
    npwp: "NPWP",
    ktp: "KTP",
    aktaPendirian: "Akta Pendirian",
    skKemenkumham: "SK Kemenkumham",
    aktaPerubahan: "Akta Perubahan",
    skKemenkumhamPerubahan: "SK Kemenkumham Perubahan",
    sertifikatStandar: "Sertifikat Standar",
  };

  const normalizeDocuments = (docs) => {
    const out = {};
    DOCUMENT_KEYS.forEach((key) => {
      const arr = Array.isArray(docs?.[key]) ? docs[key] : [];
      out[key] = arr
        .filter((d) => d?.url) // hanya yang ada URL
        .map((d) => ({
          name: safeStr(d.name) || DEFAULT_DOC_LABEL[key] || "Dokumen",
          url: d.url,
        }));
    });
    return out;
  };

  // Filter PIC kosong, lalu beri level berurutan mulai 1
  const filteredContacts = (
    Array.isArray(zustandData.contacts) ? zustandData.contacts : []
  )
    .filter(
      (c) => safeStr(c?.name) && safeStr(c?.position) && safeStr(c?.phone)
    )
    .map((c, idx) => ({
      name: safeStr(c.name),
      position: safeStr(c.position),
      phone: safeStr(c.phone),
      level: idx + 1, // PIC 1 mandatory (kalau ada), sisanya opsional
    }));

  // Ambil district name dari daftar kecamatan
  const districtName = findNameById(
    zustandData.locationData?.kecamatanList,
    zustandData.locationData?.district
  );

  // --- Build payload sesuai API baru ---
  const payload = {
    registrantName: safeStr(zustandData.registrantName),
    registrantPosition: safeStr(zustandData.registrantPosition),
    registrantWhatsapp: safeStr(zustandData.registrantWhatsapp),
    registrantEmail: safeStr(zustandData.registrantEmail),

    companyLogo: safeStr(zustandData.companyLogo),
    companyName: safeStr(zustandData.companyName),
    businessEntityType: safeStr(zustandData.businessEntityType),

    companyPhone: safeStr(zustandData.companyPhone),
    companyAddress: safeStr(zustandData.companyAddress),

    locationData: {
      locationDetail: safeStr(zustandData.companyAddress),
      location: safeStr(zustandData.locationData?.location),
      latitude: toFloat(zustandData.locationData?.latitude),
      longitude: toFloat(zustandData.locationData?.longitude),

      // API minta name + id
      district: districtName,
      districtId: toInt(zustandData.locationData?.district),

      city: safeStr(zustandData.locationData?.city),
      cityId: toInt(zustandData.locationData?.cityId),

      province: safeStr(zustandData.locationData?.province),
      provinceId: toInt(zustandData.locationData?.provinceId),

      postalCode: safeStr(zustandData.locationData?.postalCode),
      // placeId opsional: hanya kirim jika ada
      ...(zustandData.locationData?.placeId
        ? { placeId: safeStr(zustandData.locationData.placeId) }
        : {}),
    },

    bankId: safeStr(zustandData.bankId),
    accountNumber: safeStr(zustandData.accountNumber),
    accountName: safeStr(zustandData.accountName),

    nibNumber: safeStr(zustandData.nibNumber),
    npwpNumber: safeStr(zustandData.npwpNumber),
    ktpNumber: safeStr(zustandData.ktpNumber),

    documents: normalizeDocuments(zustandData.documents),

    contacts: filteredContacts,
  };

  return payload;
};

export default mapZustandToApiPayloadV2;
