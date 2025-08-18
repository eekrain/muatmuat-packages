export const normalizePayloadTambahArmadaMassal = (array) => {
  return {
    fleets: array.informasiMuatan.map((item) => {
      // Helper function to convert image data to photo objects
      const convertPhotos = (images) => {
        const photos = [];

        if (images?.image_armada_depan) {
          photos.push({
            photoType: "FRONT",
            photoUrl:
              typeof images.image_armada_depan === "string"
                ? images.image_armada_depan
                : images.image_armada_depan.url || "",
            photoName:
              typeof images.image_armada_depan === "string"
                ? "FRONT.jpg"
                : images.image_armada_depan.name || "FRONT.jpg",
          });
        }

        if (images?.image_armada_belakang) {
          photos.push({
            photoType: "BACK",
            photoUrl:
              typeof images.image_armada_belakang === "string"
                ? images.image_armada_belakang
                : images.image_armada_belakang.url || "",
            photoName:
              typeof images.image_armada_belakang === "string"
                ? "BACK.jpg"
                : images.image_armada_belakang.name || "BACK.jpg",
          });
        }

        if (images?.image_armada_kiri) {
          photos.push({
            photoType: "LEFT",
            photoUrl:
              typeof images.image_armada_kiri === "string"
                ? images.image_armada_kiri
                : images.image_armada_kiri.url || "",
            photoName:
              typeof images.image_armada_kiri === "string"
                ? "LEFT.jpg"
                : images.image_armada_kiri.name || "LEFT.jpg",
          });
        }

        if (images?.image_armada_kanan) {
          photos.push({
            photoType: "RIGHT",
            photoUrl:
              typeof images.image_armada_kanan === "string"
                ? images.image_armada_kanan
                : images.image_armada_kanan.url || "",
            photoName:
              typeof images.image_armada_kanan === "string"
                ? "RIGHT.jpg"
                : images.image_armada_kanan.name || "RIGHT.jpg",
          });
        }

        return photos;
      };

      // Helper function to convert document files to document objects
      const convertDocuments = (item) => {
        const documents = [];

        if (item.foto_stnk) {
          documents.push({
            documentType: "STNK",
            documentUrl:
              typeof item.foto_stnk === "string"
                ? item.foto_stnk
                : item.foto_stnk.documentUrl || "",
            documentName:
              typeof item.foto_stnk === "string"
                ? "STNK.pdf"
                : item.foto_stnk.name || "STNK.pdf",
          });
        }

        if (item.foto_pajak_kendaraan) {
          documents.push({
            documentType: "VEHICLE_TAX",
            documentUrl:
              typeof item.foto_pajak_kendaraan === "string"
                ? item.foto_pajak_kendaraan
                : item.foto_pajak_kendaraan.documentUrl || "",
            documentName:
              typeof item.foto_pajak_kendaraan === "string"
                ? "TAX.pdf"
                : item.foto_pajak_kendaraan.name || "TAX.pdf",
          });
        }

        if (item.foto_buku_kir) {
          documents.push({
            documentType: "KIR",
            documentUrl:
              typeof item.foto_buku_kir === "string"
                ? item.foto_buku_kir
                : item.foto_buku_kir.documentUrl || "",
            documentName:
              typeof item.foto_buku_kir === "string"
                ? "KIR.pdf"
                : item.foto_buku_kir.name || "KIR.pdf",
          });
        }

        return documents;
      };

      // Helper function to format date to YYYY-MM-DD
      const formatDate = (dateValue) => {
        if (!dateValue) return "";

        try {
          const date = new Date(dateValue);
          return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
        } catch {
          return "";
        }
      };

      // Helper function to validate and transform vehicle brand/type IDs
      const validateIdField = (value) => {
        if (!value) return null;

        // Check if value is an ISO string (date format)
        const isoDateRegex =
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
        if (isoDateRegex.test(value)) {
          return null;
        }

        // Check if value is a UUID format
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(value) || typeof value === "string") {
          return value;
        }

        return null;
      };

      return {
        licensePlate: item.licensePlate || "",
        truckTypeId: item.jenis_truk || "",
        carrierTypeId: item.jenis_carrier || "",
        vehicleBrandId: item.merek_kendaraan_id || null,
        vehicleBrandName: item.merek_kendaraan_name || "", // You might need to store this separately
        vehicleTypeId: item.tipe_kendaraan_id || null,
        vehicleTypeName: item.tipe_kendaraan_name || "", // You might need to store this separately
        registrationYear: item.tahun_registrasi_kendaraan
          ? parseInt(item.tahun_registrasi_kendaraan)
          : null,
        carrierLength: item.dimensi_carrier?.panjang
          ? parseFloat(item.dimensi_carrier.panjang)
          : null,
        carrierWidth: item.dimensi_carrier?.lebar
          ? parseFloat(item.dimensi_carrier.lebar)
          : null,
        carrierHeight: item.dimensi_carrier?.tinggi
          ? parseFloat(item.dimensi_carrier.tinggi)
          : null,
        carrierDimensionUnit: item.dimensi_carrier?.unit || "m",
        chassisNumber: item.nomor_rangka || "",
        stnkExpiryDate: formatDate(item.masa_berlaku_stnk),
        kirNumber: item.nomor_kir || "",
        kirExpiryDate: formatDate(item.masa_berlaku_kir),
        gpsInstallationEstimateStartDate: formatDate(
          item.estimasi_tanggal_pemasangan_gps?.mulai
        ),
        gpsInstallationEstimateEndDate: formatDate(
          item.estimasi_tanggal_pemasangan_gps?.selesai
        ),
        photos: convertPhotos(item.informasi_armada?.images),
        documents: convertDocuments(item),
      };
    }),
  };
};
