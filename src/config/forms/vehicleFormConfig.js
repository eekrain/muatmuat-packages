import * as v from "valibot";

import { normalizePayloadTambahArmadaMassal } from "@/lib/normalizers/transporter/tambah-armada-massal/normalizePayloadTambahArmadaMassal";
import { toast } from "@/lib/toast";

// Default values for vehicle form
export const defaultInformasiArmada = {
  informasi_armada: {
    images: {
      image_armada_depan: null,
      image_armada_kiri: null,
      image_armada_kanan: null,
      image_armada_belakang: null,
    },
  },
  licensePlate: "",
  jenis_truk: "",
  jenis_carrier: "",
  merek_kendaraan_name: "",
  merek_kendaraan_id: "",
  tipe_kendaraan_name: "",
  tipe_kendaraan_id: "",
  tahun_registrasi_kendaraan: "",
  dimensi_carrier: {
    panjang: "",
    lebar: "",
    tinggi: "",
    unit: "m",
  },
  nomor_rangka: "",
  masa_berlaku_stnk: "",
  foto_stnk: null,
  foto_pajak_kendaraan: null,
  nomor_kir: "",
  masa_berlaku_kir: "",
  foto_buku_kir: null,
  estimasi_tanggal_pemasangan_gps: {
    mulai: "",
    selesai: "",
  },
};

// Vehicle validation schema
export const informasiArmadaSchema = v.object({
  informasi_armada: v.object({
    images: v.object({
      image_armada_depan: v.pipe(
        v.any(),
        v.check(
          (val) => val !== null && val !== "",
          "Foto armada depan wajib diisi"
        )
      ),
      image_armada_kiri: v.optional(v.any()),
      image_armada_kanan: v.optional(v.any()),
      image_armada_belakang: v.optional(v.any()),
    }),
  }),
  licensePlate: v.pipe(v.string(), v.minLength(1, "Nomor plat wajib diisi")),
  jenis_truk: v.pipe(v.string(), v.minLength(1, "Jenis truk wajib diisi")),
  jenis_carrier: v.pipe(
    v.string(),
    v.minLength(1, "Jenis carrier wajib diisi")
  ),
  merek_kendaraan_id: v.pipe(
    v.string(),
    v.minLength(1, "Merek kendaraan wajib diisi")
  ),
  tipe_kendaraan_id: v.pipe(
    v.string(),
    v.minLength(1, "Tipe kendaraan wajib diisi")
  ),
  tahun_registrasi_kendaraan: v.pipe(
    v.string(),
    v.minLength(1, "Tahun registrasi kendaraan wajib diisi")
  ),
  nomor_rangka: v.pipe(v.string(), v.minLength(1, "Nomor rangka wajib diisi")),
  masa_berlaku_stnk: v.pipe(
    v.date(),
    v.minLength(1, "Masa berlaku STNK wajib diisi")
  ),
  foto_stnk: v.pipe(
    v.any(),
    v.check((val) => val !== null && val !== "", "Foto STNK wajib diisi")
  ),
  foto_pajak_kendaraan: v.pipe(
    v.any(),
    v.check(
      (val) => val !== null && val !== "",
      "Foto pajak kendaraan wajib diisi"
    )
  ),
  nomor_kir: v.pipe(v.string(), v.minLength(1, "Nomor KIR wajib diisi")),
  masa_berlaku_kir: v.pipe(
    v.date(),
    v.minLength(1, "Masa berlaku KIR wajib diisi")
  ),
  foto_buku_kir: v.pipe(
    v.any(),
    v.check((val) => val !== null && val !== "", "Foto buku KIR wajib diisi")
  ),
  estimasi_tanggal_pemasangan_gps: v.object({
    mulai: v.pipe(
      v.date(),
      v.minLength(1, "Estimasi tanggal mulai pemasangan GPS wajib diisi")
    ),
    selesai: v.pipe(
      v.date(),
      v.minLength(1, "Estimasi tanggal selesai pemasangan GPS wajib diisi")
    ),
  }),
});

// Form schema with field array
export const vehicleFormSchema = v.object({
  informasiMuatan: v.array(informasiArmadaSchema),
});

// Default form values
export const vehicleDefaultValues = {
  informasiMuatan: [defaultInformasiArmada],
};

// Custom cell value change handler for vehicle form
export const handleVehicleCellValueChange = (
  rowIndex,
  fieldPath,
  value,
  setValue,
  trigger,
  errors,
  fieldArrayName = "informasiMuatan"
) => {
  if (fieldPath === "merek_kendaraan") {
    setValue(`${fieldArrayName}.${rowIndex}.merek_kendaraan_id`, value.id);
    setValue(`${fieldArrayName}.${rowIndex}.merek_kendaraan_name`, value.name);
    setValue(`${fieldArrayName}.${rowIndex}.tipe_kendaraan`, "");
  } else if (fieldPath === "jenis_truk") {
    setValue(`${fieldArrayName}.${rowIndex}.jenis_truk`, value);
    setValue(`${fieldArrayName}.${rowIndex}.jenis_carrier`, "");
  } else if (fieldPath === "tipe_kendaraan") {
    setValue(`${fieldArrayName}.${rowIndex}.tipe_kendaraan_id`, value.id);
    setValue(`${fieldArrayName}.${rowIndex}.tipe_kendaraan_name`, value.name);
  }
  setValue(`${fieldArrayName}.${rowIndex}.${fieldPath}`, value);

  // Clear specific field error when user fills it
  if (errors[fieldArrayName]?.[rowIndex]) {
    setTimeout(() => {
      trigger(`${fieldArrayName}.${rowIndex}.${fieldPath}`);
    }, 0);
  }
};

// Validation function for vehicle form
export const validateVehicleForm = (data) => {
  const emptyFields = [];

  data.informasiMuatan.forEach((item, index) => {
    const fieldLabels = {
      "informasi_armada.images.image_armada_depan": "Foto armada depan",
      licensePlate: "Nomor plat",
      jenis_truk: "Jenis truk",
      jenis_carrier: "Jenis carrier",
      merek_kendaraan_id: "Merek kendaraan",
      tipe_kendaraan_id: "Tipe kendaraan",
      tahun_registrasi_kendaraan: "Tahun registrasi kendaraan",
      nomor_rangka: "Nomor rangka",
      masa_berlaku_stnk: "Masa berlaku STNK",
      foto_stnk: "Foto STNK",
      foto_pajak_kendaraan: "Foto pajak kendaraan",
      nomor_kir: "Nomor KIR",
      masa_berlaku_kir: "Masa berlaku KIR",
      foto_buku_kir: "Foto buku KIR",
      "estimasi_tanggal_pemasangan_gps.mulai":
        "Estimasi tanggal mulai pemasangan GPS",
      "estimasi_tanggal_pemasangan_gps.selesai":
        "Estimasi tanggal selesai pemasangan GPS",
    };

    // Check required fields
    if (!item.informasi_armada?.images?.image_armada_depan) {
      emptyFields.push(
        `${fieldLabels["informasi_armada.images.image_armada_depan"]} (Armada ${index + 1})`
      );
    }
    if (!item.licensePlate) {
      emptyFields.push(`${fieldLabels["licensePlate"]} (Armada ${index + 1})`);
    }
    if (!item.jenis_truk) {
      emptyFields.push(`${fieldLabels["jenis_truk"]} (Armada ${index + 1})`);
    }
    if (!item.jenis_carrier) {
      emptyFields.push(`${fieldLabels["jenis_carrier"]} (Armada ${index + 1})`);
    }
    if (!item.merek_kendaraan_id) {
      emptyFields.push(
        `${fieldLabels["merek_kendaraan_id"]} (Armada ${index + 1})`
      );
    }
    if (!item.tipe_kendaraan_id) {
      emptyFields.push(
        `${fieldLabels["tipe_kendaraan_id"]} (Armada ${index + 1})`
      );
    }
    if (!item.tahun_registrasi_kendaraan) {
      emptyFields.push(
        `${fieldLabels["tahun_registrasi_kendaraan"]} (Armada ${index + 1})`
      );
    }
    if (!item.nomor_rangka) {
      emptyFields.push(`${fieldLabels["nomor_rangka"]} (Armada ${index + 1})`);
    }
    if (!item.masa_berlaku_stnk) {
      emptyFields.push(
        `${fieldLabels["masa_berlaku_stnk"]} (Armada ${index + 1})`
      );
    }
    if (!item.foto_stnk) {
      emptyFields.push(`${fieldLabels["foto_stnk"]} (Armada ${index + 1})`);
    }
    if (!item.foto_pajak_kendaraan) {
      emptyFields.push(
        `${fieldLabels["foto_pajak_kendaraan"]} (Armada ${index + 1})`
      );
    }
    if (!item.nomor_kir) {
      emptyFields.push(`${fieldLabels["nomor_kir"]} (Armada ${index + 1})`);
    }
    if (!item.masa_berlaku_kir) {
      emptyFields.push(
        `${fieldLabels["masa_berlaku_kir"]} (Armada ${index + 1})`
      );
    }
    if (!item.foto_buku_kir) {
      emptyFields.push(`${fieldLabels["foto_buku_kir"]} (Armada ${index + 1})`);
    }
    if (!item.estimasi_tanggal_pemasangan_gps?.mulai) {
      emptyFields.push(
        `${fieldLabels["estimasi_tanggal_pemasangan_gps.mulai"]} (Armada ${index + 1})`
      );
    }
    if (!item.estimasi_tanggal_pemasangan_gps?.selesai) {
      emptyFields.push(
        `${fieldLabels["estimasi_tanggal_pemasangan_gps.selesai"]} (Armada ${index + 1})`
      );
    }
  });

  if (emptyFields.length === 1) {
    toast.error(`${emptyFields[0]} wajib diisi`);
  } else if (emptyFields.length > 1) {
    toast.error("Field Belum Diisi");
  }

  return emptyFields.length === 0;
};

// Submit handler for vehicle form
export const handleVehicleSubmit = (value) => {
  const payload = normalizePayloadTambahArmadaMassal(value);
  // TODO: Implement API call with the payload
  void payload; // Temporarily silence unused variable warning
  toast.success("Data armada berhasil disimpan");
};

// Save as draft handler for vehicle form
export const handleVehicleSaveAsDraft = (value) => {
  const payload = normalizePayloadTambahArmadaMassal(value);
  // TODO: Implement API call for saving as draft
  void payload; // Temporarily silence unused variable warning
  toast.success("Berhasil tambah sebagai draft");
};
