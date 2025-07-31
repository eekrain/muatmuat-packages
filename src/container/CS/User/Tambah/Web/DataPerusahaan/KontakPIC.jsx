import { valibotResolver } from "@hookform/resolvers/valibot";
import { useFieldArray, useForm } from "react-hook-form";
import * as v from "valibot";

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
          v.optional(
            v.pipe(
              v.string(),
              v.regex(/^08[0-9]{8,11}$/, "Format nomor HP tidak valid")
            )
          )
        ),
      })
    ),
    v.optional(
      v.object({
        name: v.optional(v.string()),
        position: v.optional(v.string()),
        phone: v.optional(
          v.optional(
            v.pipe(
              v.string(),
              v.regex(/^08[0-9]{8,11}$/, "Format nomor HP tidak valid")
            )
          )
        ),
      })
    ),
  ]),
});

export default function KontakPIC() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: valibotResolver(kontakPICSchema),
    defaultValues: {
      contacts: [{ name: "", position: "", phone: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  });

  console.log(register, handleSubmit, errors, fields, append, remove);
  return (
    <div>
      <p>Kontak PIC</p>
    </div>
  );
}
