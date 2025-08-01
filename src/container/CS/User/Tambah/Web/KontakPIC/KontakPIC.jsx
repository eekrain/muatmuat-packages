"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import { toast } from "@/lib/toast";

const phoneRegex = /^08[0-9]{8,11}$/;

const kontakPICSchema = v.object({
  contacts: v.tuple([
    v.object({
      name: v.pipe(v.string(), v.minLength(1, "Nama wajib diisi")),
      position: v.pipe(v.string(), v.minLength(1, "Jabatan wajib diisi")),
      phone: v.pipe(
        v.string(),
        v.minLength(1, "Nomor HP wajib diisi"),
        v.regex(phoneRegex, "Format nomor HP tidak valid")
      ),
    }),
    v.optional(
      v.object({
        name: v.optional(v.string()),
        position: v.optional(v.string()),
        phone: v.optional(
          v.string([v.regex(phoneRegex, "Format nomor HP tidak valid")])
        ),
      })
    ),
    v.optional(
      v.object({
        name: v.optional(v.string()),
        position: v.optional(v.string()),
        phone: v.optional(
          v.string([v.regex(phoneRegex, "Format nomor HP tidak valid")])
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
    watch,
  } = useForm({
    resolver: valibotResolver(kontakPICSchema),
    defaultValues: {
      contacts: [
        { name: "", position: "", phone: "", level: 1 },
        { name: "", position: "", phone: "", level: 2 },
        { name: "", position: "", phone: "", level: 3 },
      ],
    },
  });

  const watched = watch();

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  const onInvalid = () => {
    const pic1 = watched.contacts?.[0];

    const isAllEmpty =
      !pic1?.name?.trim() && !pic1?.position?.trim() && !pic1?.phone?.trim();

    if (isAllEmpty) {
      toast.error("Wajib diisi semua");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="w-full">
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
        <Button variant="muattrans-primary-secondary">Sebelumnya</Button>
        <Button type="submit" variant="muattrans-primary">
          Simpan
        </Button>
      </div>
    </form>
  );
}

export default KontakPIC;
