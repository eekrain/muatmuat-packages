"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <Card className={"rounded-xl border-none p-6"}>
        <div className="max-w-[70%]">
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
                type="text"
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
                type="text"
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
                type="text"
                placeholder="Contoh : 08xxxxxxxxxx"
                {...register("contacts.2.phone")}
                errorMessage={errors.contacts?.[2]?.phone?.message}
              />
            </FormContainer>
          </div>
        </div>
      </Card>
      <div className="mt-6 flex items-end justify-end gap-3">
        <Button variant="muattrans-primary-secondary">Sebelumnya</Button>
        <Button type="submit" variant="muattrans-primary">
          Simpan
        </Button>
      </div>
    </form>
  );
}

export default KontakPIC;
