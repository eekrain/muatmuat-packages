"use client";

import { useEffect } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import { toast } from "@/lib/toast";
import { useTransporterFormStore } from "@/store/CS/forms/registerTransporter";

const phoneRegex = /^08[0-9]{8,11}$/;

// Schema PIC wajib (PIC 1)
const requiredPICSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Nama wajib diisi")),
  position: v.pipe(v.string(), v.minLength(1, "Jabatan wajib diisi")),
  phone: v.pipe(
    v.string(),
    v.minLength(1, "Nomor HP wajib diisi"),
    v.regex(phoneRegex, "Format nomor HP tidak valid")
  ),
});

// Schema PIC opsional (PIC 2 & 3)
const optionalPICSchema = v.object({
  name: v.optional(v.string()),
  position: v.optional(v.string()),
  phone: v.optional(
    v.string([v.regex(phoneRegex, "Format nomor HP tidak valid")])
  ),
});

const kontakPICSchema = v.object({
  contacts: v.tuple([requiredPICSchema, optionalPICSchema, optionalPICSchema]),
});

function KontakPIC({ onSave, onFormChange, setActiveIdx }) {
  const FORM_KEY = "newTransporterRegistration";
  const setForm = useTransporterFormStore((state) => state.setForm);
  const initialData = useTransporterFormStore((state) =>
    state.getForm(FORM_KEY)
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitSuccessful },
    watch,
    reset,
    setError,
    trigger,
  } = useForm({
    resolver: valibotResolver(kontakPICSchema),
    defaultValues: initialData?.contacts
      ? initialData
      : {
          contacts: [
            { name: "", position: "", phone: "", level: 1 },
            { name: "", position: "", phone: "", level: 2 },
            { name: "", position: "", phone: "", level: 3 },
          ],
        },
  });

  const watched = watch();

  useEffect(() => {
    // Hanya panggil onFormChange jika form MENJADI dirty (berubah dari bersih ke kotor).
    // Jangan lakukan apa-apa jika form berubah dari kotor kembali ke bersih (setelah save).
    if (isDirty) {
      onFormChange();
    }
  }, [isDirty, onFormChange]);

  const onSubmit = async (data) => {
    // --- Logika validasi kustom Anda dimulai di sini (TIDAK PERLU DIUBAH) ---
    let hasError = false;
    let toastShown = false;

    const validPIC1 = await trigger([
      "contacts.0.name",
      "contacts.0.position",
      "contacts.0.phone",
    ]);
    if (!validPIC1) {
      if (!toastShown) {
        toast.error("Isi semua inputan yang bertanda bintang (*)");
        toastShown = true;
      }
      hasError = true;
    }

    const pic2 = data.contacts[1];
    const pic3 = data.contacts[2];
    const pic2Filled = Object.values(pic2).some((v) => v?.trim());
    const pic3Filled = Object.values(pic3).some((v) => v?.trim());

    if (pic2Filled || pic3Filled) {
      ["name", "position", "phone"].forEach((field) => {
        if (!pic2[field]?.trim()) {
          setError(`contacts.1.${field}`, {
            type: "manual",
            message: "Wajib diisi",
          });
          hasError = true;
        }
      });
    }

    if (pic3Filled) {
      ["name", "position", "phone"].forEach((field) => {
        if (!pic3[field]?.trim()) {
          setError(`contacts.2.${field}`, {
            type: "manual",
            message: "Wajib diisi",
          });
          hasError = true;
        }
      });
    }
    // --- Logika validasi kustom Anda berakhir di sini ---

    // Jika ada error dari validasi kustom, hentikan proses.
    if (hasError) return;

    // --- Jika semua validasi lolos, lanjutkan untuk menyimpan ---
    console.log("All validations passed. Form data for this section:", data);

    // 1. Ambil data lengkap yang ada saat ini dari store
    const existingData =
      useTransporterFormStore.getState().getForm(FORM_KEY) || {};

    // 2. Gabungkan data lama dengan data baru dari section ini
    const updatedData = {
      ...existingData,
      ...data,
    };

    // 3. Simpan data yang sudah lengkap kembali ke store
    console.log("Saving final merged data to Zustand:", updatedData);
    setForm(FORM_KEY, updatedData);
    if (onSave) {
      onSave();
    }

    reset(data);

    toast.success("Pendaftaran berhasil disimpan!");

    // Di sini Anda bisa memicu pengiriman data ke backend atau navigasi ke halaman sukses
    // Contoh: sendDataToApi(updatedData);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      const latestData = useTransporterFormStore.getState().getForm(FORM_KEY);
      reset(latestData);
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <Card className="rounded-xl border-none p-6">
        <div className="max-w-[75%]">
          <div>
            <h3 className="mb-6 text-lg font-semibold">Kontak PIC</h3>
            <FormContainer>
              {/* PIC 1 */}
              <FormLabel required>Nama PIC 1</FormLabel>
              <Input
                type="text"
                placeholder="Nama PIC 1"
                {...register("contacts.0.name")}
                errorMessage={errors.contacts?.[0]?.name?.message}
              />

              <FormLabel required>Jabatan PIC 1</FormLabel>
              <Input
                type="text"
                placeholder="Jabatan PIC 1"
                {...register("contacts.0.position")}
                errorMessage={errors.contacts?.[0]?.position?.message}
              />

              <FormLabel required>No. HP PIC 1</FormLabel>
              <Input
                type="number"
                placeholder="Contoh : 08xxxxxxxxxx"
                {...register("contacts.0.phone")}
                errorMessage={errors.contacts?.[0]?.phone?.message}
              />

              {/* PIC 2 */}
              <FormLabel>Nama PIC 2</FormLabel>
              <Input
                type="text"
                placeholder="Nama PIC 2"
                {...register("contacts.1.name")}
                errorMessage={errors.contacts?.[1]?.name?.message}
              />

              <FormLabel>Jabatan PIC 2</FormLabel>
              <Input
                type="text"
                placeholder="Jabatan PIC 2"
                {...register("contacts.1.position")}
                errorMessage={errors.contacts?.[1]?.position?.message}
              />

              <FormLabel>No. HP PIC 2</FormLabel>
              <Input
                type="number"
                placeholder="Contoh : 08xxxxxxxxxx"
                {...register("contacts.1.phone")}
                errorMessage={errors.contacts?.[1]?.phone?.message}
              />

              {/* PIC 3 */}
              <FormLabel>Nama PIC 3</FormLabel>
              <Input
                type="text"
                placeholder="Nama PIC 3"
                {...register("contacts.2.name")}
                errorMessage={errors.contacts?.[2]?.name?.message}
              />

              <FormLabel>Jabatan PIC 3</FormLabel>
              <Input
                type="text"
                placeholder="Jabatan PIC 3"
                {...register("contacts.2.position")}
                errorMessage={errors.contacts?.[2]?.position?.message}
              />

              <FormLabel>No. HP PIC 3</FormLabel>
              <Input
                type="number"
                placeholder="Contoh : 08xxxxxxxxxx"
                {...register("contacts.2.phone")}
                errorMessage={errors.contacts?.[2]?.phone?.message}
              />
            </FormContainer>
          </div>
        </div>
      </Card>
      <div className="mt-6 flex items-end justify-end gap-3">
        <Button
          variant="muattrans-primary-secondary"
          onClick={() => setActiveIdx(1)}
        >
          Sebelumnya
        </Button>
        <Button type="submit" variant="muattrans-primary">
          Simpan
        </Button>
      </div>
    </form>
  );
}

export default KontakPIC;
