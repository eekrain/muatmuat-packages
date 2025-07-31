"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";

const kontakPICSchema = v.object({
  contacts: v.tuple([
    v.object({
      name: v.pipe(v.string(), v.minLength(1, "Nama wajib diisi")),
      position: v.pipe(v.string(), v.minLength(1, "Jabatan wajib diisi")),
      phone: v.pipe(
        v.string(),
        v.minLength(1, "Nomor HP wajib diisi"),
        v.regex(/^08[0-9]{8,11}$/, "Format nomor HP tidak valid")
      ),
    }),
    v.optional(
      v.object({
        name: v.optional(v.string()),
        position: v.optional(v.string()),
        phone: v.optional(
          v.pipe(
            v.string(),
            v.regex(/^08[0-9]{8,11}$/, "Format nomor HP tidak valid")
          )
        ),
      })
    ),
    v.optional(
      v.object({
        name: v.optional(v.string()),
        position: v.optional(v.string()),
        phone: v.optional(
          v.pipe(
            v.string(),
            v.regex(/^08[0-9]{8,11}$/, "Format nomor HP tidak valid")
          )
        ),
      })
    ),
  ]),
});

function KontakPIC() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: valibotResolver(kontakPICSchema),
    defaultValues: {
      contacts: [
        { name: "", position: "", phone: "" }, // PIC 1 (required)
        { name: "", position: "", phone: "" }, // PIC 2 (optional)
        { name: "", position: "", phone: "" }, // PIC 3 (optional)
      ],
    },
  });

  const onSubmit = (data) => {
    // Handle form submission here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h3 className="mb-6 text-lg font-semibold">Kontak PIC</h3>
        <FormContainer>
          {/* PIC 1 */}
          <FormLabel required>Nama PIC 1</FormLabel>
          <Input
            type="text"
            placeholder="Nama PIC 1"
            {...register("contacts.0.name")}
            className={
              errors.contacts?.[0]?.name
                ? "border-error-500"
                : "border-neutral-600"
            }
          />
          {errors.contacts?.[0]?.name && (
            <p className="mt-1 text-sm text-error-500">
              {errors.contacts[0].name.message}
            </p>
          )}

          <FormLabel required>Jabatan PIC 1</FormLabel>
          <Input
            type="text"
            placeholder="Jabatan PIC 1"
            {...register("contacts.0.position")}
            className={
              errors.contacts?.[0]?.position
                ? "border-error-500"
                : "border-neutral-600"
            }
          />
          {errors.contacts?.[0]?.position && (
            <p className="mt-1 text-sm text-error-500">
              {errors.contacts[0].position.message}
            </p>
          )}

          <FormLabel required>No. HP PIC 1</FormLabel>
          <Input
            type="text"
            placeholder="Contoh : 08xxxxxxxxxx"
            {...register("contacts.0.phone")}
            className={
              errors.contacts?.[0]?.phone
                ? "border-error-500"
                : "border-neutral-600"
            }
          />
          {errors.contacts?.[0]?.phone && (
            <p className="mt-1 text-sm text-error-500">
              {errors.contacts[0].phone.message}
            </p>
          )}

          {/* PIC 2 */}
          <FormLabel>Nama PIC 2</FormLabel>
          <Input
            type="text"
            placeholder="Nama PIC 2"
            {...register("contacts.1.name")}
            className={
              errors.contacts?.[1]?.name
                ? "border-error-500"
                : "border-neutral-600"
            }
          />
          {errors.contacts?.[1]?.name && (
            <p className="mt-1 text-sm text-error-500">
              {errors.contacts[1].name.message}
            </p>
          )}

          <FormLabel>Jabatan PIC 2</FormLabel>
          <Input
            type="text"
            placeholder="Jabatan PIC 2"
            {...register("contacts.1.position")}
            className={
              errors.contacts?.[1]?.position
                ? "border-error-500"
                : "border-neutral-600"
            }
          />
          {errors.contacts?.[1]?.position && (
            <p className="mt-1 text-sm text-error-500">
              {errors.contacts[1].position.message}
            </p>
          )}

          <FormLabel>No. HP PIC 2</FormLabel>
          <Input
            type="text"
            placeholder="Contoh : 08xxxxxxxxxx"
            {...register("contacts.1.phone")}
            className={
              errors.contacts?.[1]?.phone
                ? "border-error-500"
                : "border-neutral-600"
            }
          />
          {errors.contacts?.[1]?.phone && (
            <p className="mt-1 text-sm text-error-500">
              {errors.contacts[1].phone.message}
            </p>
          )}

          {/* PIC 3 */}
          <FormLabel>Nama PIC 3</FormLabel>
          <Input
            type="text"
            placeholder="Nama PIC 3"
            {...register("contacts.2.name")}
            className={
              errors.contacts?.[2]?.name
                ? "border-error-500"
                : "border-neutral-600"
            }
          />
          {errors.contacts?.[2]?.name && (
            <p className="mt-1 text-sm text-error-500">
              {errors.contacts[2].name.message}
            </p>
          )}

          <FormLabel>Jabatan PIC 3</FormLabel>
          <Input
            type="text"
            placeholder="Jabatan PIC 3"
            {...register("contacts.2.position")}
            className={
              errors.contacts?.[2]?.position
                ? "border-error-500"
                : "border-neutral-600"
            }
          />
          {errors.contacts?.[2]?.position && (
            <p className="mt-1 text-sm text-error-500">
              {errors.contacts[2].position.message}
            </p>
          )}

          <FormLabel>No. HP PIC 3</FormLabel>
          <Input
            type="text"
            placeholder="Contoh : 08xxxxxxxxxx"
            {...register("contacts.2.phone")}
            className={
              errors.contacts?.[2]?.phone
                ? "border-error-500"
                : "border-neutral-600"
            }
          />
          {errors.contacts?.[2]?.phone && (
            <p className="mt-1 text-sm text-error-500">
              {errors.contacts[2].phone.message}
            </p>
          )}
        </FormContainer>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit" variant="muattrans-primary" className="px-8">
          Simpan Data
        </Button>
      </div>
    </form>
  );
}

export default KontakPIC;
