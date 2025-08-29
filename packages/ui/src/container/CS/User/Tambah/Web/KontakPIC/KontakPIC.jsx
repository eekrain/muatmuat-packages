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

const nameRegex = /^[a-zA-Z\s'.]+$/;
const phonePrefixRegex = /^08/;

const requiredPICSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, "Nama wajib diisi"),
    v.minLength(3, "Nama minimal 3 karakter"),
    v.regex(nameRegex, "Nama tidak valid")
  ),
  position: v.pipe(v.string(), v.minLength(1, "Jabatan wajib diisi")),
  phone: v.pipe(
    v.string(),
    v.minLength(1, "Nomor HP wajib diisi"),
    v.minLength(8, "No. HP PIC minimal 8 digit"),
    v.regex(phonePrefixRegex, "Format No. HP Salah")
  ),
});

const optionalPICSchema = v.object({
  name: v.union([
    v.literal(""),
    v.pipe(
      v.string(),
      v.minLength(3, "Nama minimal 3 karakter"),
      v.regex(nameRegex, "Nama tidak valid")
    ),
  ]),
  position: v.union([v.literal(""), v.string()]),
  phone: v.union([
    v.literal(""),
    v.pipe(
      v.string(),
      v.minLength(8, "No. HP PIC minimal 8 digit"),
      v.regex(phonePrefixRegex, "Format No. HP Salah")
    ),
  ]),
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
    if (isDirty) {
      onFormChange();
    }
  }, [isDirty, onFormChange]);

  const isPIC1Empty = (values) => {
    const pic1 = values?.contacts?.[0] ?? {};
    const empty = (v) => (typeof v === "string" ? v.trim() === "" : v === null);
    return empty(pic1.name) && empty(pic1.position) && empty(pic1.phone);
  };

  const onInvalid = (errors) => {
    const values = watched;
    if (isPIC1Empty(values)) {
      toast.error("Isi semua inputan yang bertanda bintang (*)");
      return;
    }
  };

  const onSubmit = async (data) => {
    let hasError = false;

    const fieldNameMap = {
      name: "Nama",
      position: "Jabatan",
      phone: "No. HP",
    };
    const pic1 = data.contacts[0];
    const pic2 = data.contacts[1];
    const pic3 = data.contacts[2];
    const isPic2PartiallyFilled =
      pic2.name?.trim() || pic2.position?.trim() || pic2.phone?.trim();
    const isPic3PartiallyFilled =
      pic3.name?.trim() || pic3.position?.trim() || pic3.phone?.trim();
    const isPic2Complete =
      pic2.name?.trim() && pic2.position?.trim() && pic2.phone?.trim();

    if (pic1.phone === pic3.phone) {
      hasError = true;
      setError("contacts.0.phone", {
        type: "manual",
        message: "No. HP PIC Tidak Boleh Sama",
      });
    }

    if (pic1.phone === pic2.phone) {
      hasError = true;
      setError("contacts.0.phone", {
        type: "manual",
        message: "No. HP PIC Tidak Boleh Sama",
      });
    }

    if (pic2.phone.length && pic3.phone.length && pic2.phone === pic3.phone) {
      hasError = true;
      setError("contacts.1.phone", {
        type: "manual",
        message: "No. HP PIC Tidak Boleh Sama",
      });
    }

    if (isPic3PartiallyFilled && !isPic2Complete) {
      hasError = true;
      ["name", "position", "phone"].forEach((field) => {
        if (!pic2[field]?.trim()) {
          setError(`contacts.1.${field}`, {
            type: "manual",
            message: `${fieldNameMap[field]} PIC 2 wajib diisi sebelum PIC 3`,
          });
        }
      });

      toast.error("PIC 2 harus diisi terlebih dahulu sebelum PIC 3");
    } else if (isPic2PartiallyFilled && !isPic2Complete) {
      hasError = true;
      ["name", "position", "phone"].forEach((field) => {
        if (!pic2[field]?.trim()) {
          setError(`contacts.1.${field}`, {
            type: "manual",
            message: `${fieldNameMap[field]} PIC 2 wajib diisi`,
          });
        }
      });
    }
    const isPic3Complete =
      pic3.name?.trim() && pic3.position?.trim() && pic3.phone?.trim();
    if (isPic3PartiallyFilled && !isPic3Complete) {
      hasError = true;
      ["name", "position", "phone"].forEach((field) => {
        if (!pic3[field]?.trim()) {
          setError(`contacts.2.${field}`, {
            type: "manual",
            message: `${fieldNameMap[field]} PIC 3 wajib diisi`,
          });
        }
      });
    }
    if (hasError) return;
    console.log("All validations passed. Form data for this section:", data);
    const existingData =
      useTransporterFormStore.getState().getForm(FORM_KEY) || {};
    const updatedData = {
      ...existingData,
      ...data,
    };
    console.log("Saving final merged data to Zustand:", updatedData);
    setForm(FORM_KEY, updatedData);
    if (onSave) {
      onSave();
    }
    reset(data);
    toast.success("Kontak PIC berhasil disimpan!");
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      const latestData = useTransporterFormStore.getState().getForm(FORM_KEY);
      reset(latestData);
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="w-full">
      <Card className="rounded-xl border-none p-8">
        <div className="max-w-[75%]">
          <div>
            <h3 className="mb-6 text-lg font-semibold">Kontak PIC</h3>
            <FormContainer className={"!gap-6"}>
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
        <Button
          type="submit"
          variant="muattrans-primary"
          className="!w-[112px]"
        >
          Simpan
        </Button>
      </div>
    </form>
  );
}

export default KontakPIC;
