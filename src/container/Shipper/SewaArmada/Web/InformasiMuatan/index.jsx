import { useEffect, useRef, useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
// Utility for combining classNames
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
import { DimensionInput } from "@/components/Form/DimensionInput";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import { NumberInput } from "@/components/Form/NumberInput";
import { Select } from "@/components/Form/Select";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { useTranslation } from "@/hooks/use-translation";
import { useGetCargoNames } from "@/services/Shipper/sewaarmada/getCargoNames";

import { DropdownSearch } from "./InformasiMuatanDropdown";
import { ModalNamaMuatan } from "./ModalNamaMuatan";

// Define units
const weightUnits = [
  { value: "kg", label: "kg" },
  {
    value: "liter",
    label: "Liter",
  },
  {
    value: "ton",
    label: "Ton",
  },
];

const dimensionUnits = [
  { value: "m", label: "m" },
  { value: "cm", label: "cm" },
];

const defaultInformasiMuatan = {
  namaMuatan: {
    label: "",
    value: null,
  },
  beratMuatan: {
    berat: "",
    unit: "kg",
  },
  dimensiMuatan: {
    panjang: "",
    lebar: "",
    tinggi: "",
    unit: "m",
  },
};
const informasiMuatanSchema = v.object({
  namaMuatan: v.object({
    label: v.pipe(v.string(), v.minLength(1, "Nama muatan harus diisi")),
    value: v.nullable(v.string()),
  }),
  beratMuatan: v.object({
    berat: v.pipe(v.number("Wajib diisi"), v.minValue(1, "Wajib diisi")),
    unit: v.string(),
  }),
  dimensiMuatan: v.object({
    // the value might be empty string or a number, so make sure to transform it to a number
    panjang: v.pipe(
      v.any(),
      v.transform((input) => (input ? Number(input) : 0))
    ),
    lebar: v.pipe(
      v.any(),
      v.transform((input) => (input ? Number(input) : 0))
    ),
    tinggi: v.pipe(
      v.any(),
      v.transform((input) => (input ? Number(input) : 0))
    ),
    unit: v.string(),
  }),
});

export const InformasiMuatanModal = ({
  open,
  onOpenChange = () => {},
  maxInformasiMuatan = 10,
  defaultValues = [],
  onSaveInformasiMuatan,
}) => {
  const { t } = useTranslation();
  const hasInitForm = useRef(false);

  const formMethods = useForm({
    defaultValues: {
      informasiMuatan: [defaultInformasiMuatan],
    },
    resolver: valibotResolver(
      v.object({
        informasiMuatan: v.array(informasiMuatanSchema),
      })
    ),
  });
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "informasiMuatan",
  });
  const [listNamaMuatan, setListNamaMuatan] = useState([]);
  // const [listNamaMuatan, setListNamaMuatan] = useState([
  //   { value: "71b8881a-66ff-454d-a0c6-66b26b84628d", label: "Furniture Kayu" },
  //   {
  //     value: "0c57b52d-7e63-46c8-b779-c5697242b471",
  //     label: "Elektronik Rumah Tangga",
  //   },
  //   {
  //     value: "949c658e-b4d6-4ca2-8d2f-d69bf1594c4f",
  //     label: "Peralatan dan Kebutuhan Kantor",
  //   },
  //   {
  //     value: "38015672-0dab-4523-bda8-867893c95cfb",
  //     label: "Produk Makanan Kemasan",
  //     selected: true,
  //   },
  //   {
  //     value: "bb93259b-eefb-4915-aff0-3d1f5a3ab241",
  //     label: "Produk Minuman Kemasan",
  //   },
  // ]);
  // const { cargoTypeId, cargoCategoryId } = useSewaArmadaStore((state) => ({
  //   cargoTypeId: state.formValues.cargoTypeId,
  //   cargoCategoryId: state.formValues.cargoCategoryId,
  // }));
  const rawData = localStorage.getItem("t-sewa-armada");
  const parsedData = rawData ? JSON.parse(rawData) : null;
  const cargoTypeId = parsedData.state.formValues.cargoTypeId || "";
  const cargoCategoryId = parsedData.state.formValues.cargoCategoryId || "";
  const {
    data: cargoNames,
    isLoading,
    error,
  } = useGetCargoNames({
    cargoTypeId,
    cargoCategoryId,
  });
  // const cargoNames =""
  // const isLoading = false
  const [openModalNamaMuatan, setOpenModalNamaMuatan] = useState(false);

  // Handler for form submit (optional, for demo)
  const onSubmit = (data) => {
    if (data.informasiMuatan.length > 0) {
      onSaveInformasiMuatan(data.informasiMuatan);
      onOpenChange(false);
    }
  };

  const handleAddNew = (newNamaMuatan) => {
    setListNamaMuatan([
      ...listNamaMuatan,
      { value: null, label: newNamaMuatan },
    ]);
    setOpenModalNamaMuatan(false);
  };

  useEffect(() => {
    if (open && !hasInitForm.current) {
      const newForm =
        defaultValues.length > 0
          ? { informasiMuatan: defaultValues }
          : { informasiMuatan: [defaultInformasiMuatan] };
      console.log("🚀 ~ useEffect ~ newForm:", newForm);
      reset(newForm);
      hasInitForm.current = true;
    } else if (!open && hasInitForm.current) {
      hasInitForm.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultValues, defaultInformasiMuatan]);

  return (
    <>
      <Modal open={open} onOpenChange={onOpenChange}>
        <ModalContent type="muatmuat">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative grid w-[830px] gap-4 px-8 py-6">
              <div className="text-center text-base font-bold">
                Informasi Muatan
              </div>

              <div className="rounded-xl border border-neutral-400 pl-4 pt-5">
                <div className="pr-4">
                  <div className="grid h-[36px] grid-cols-[209px_168px_341px] gap-4 border-b border-neutral-400">
                    <Label required>Nama Muatan</Label>
                    <Label
                      required
                      tooltip={
                        <InfoTooltip className="w-[336px]">
                          Masukkan berat keseluruhan atau total dari seluruh
                          muatan yang akan dikirim.
                        </InfoTooltip>
                      }
                    >
                      Berat Muatan
                    </Label>
                    <Label
                      optional
                      tooltip={
                        <InfoTooltip className="w-[336px]">
                          <ul>
                            <li>
                              <b>Panjang :</b> Ukuran terpanjang dari muatan.
                            </li>
                            <li>
                              <b>Lebar :</b> Ukuran terlebar dari muatan.
                            </li>
                            <li>
                              <b>Tinggi :</b> Ukuran tertinggi dari muatan
                            </li>
                          </ul>
                          <p>
                            Pengisian dimensi yang tepat akan membantu dalam
                            pengelolaan dan pengiriman.
                          </p>
                        </InfoTooltip>
                      }
                    >
                      Dimensi Muatan
                    </Label>
                  </div>
                </div>

                <div className="pr-[6px]">
                  <div className="flex max-h-[265px] flex-col gap-5 overflow-y-auto py-5">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid min-h-[32px] grid-cols-[209px_168px_341px] gap-4"
                      >
                        <Controller
                          control={control}
                          name={`informasiMuatan.${index}.namaMuatan`}
                          render={({ field }) => (
                            <DropdownSearch
                              placeholder={"Pilih Muatan"}
                              options={cargoNames || []}
                              value={field.value}
                              onChange={field.onChange}
                              onAddNew={() => setOpenModalNamaMuatan(true)}
                              addNewText="Tambah Nama Muatan"
                              className="w-52"
                              disabled={
                                isLoading || !cargoTypeId || !cargoCategoryId
                              }
                              errorMessage={
                                errors?.informasiMuatan?.[index]?.namaMuatan
                                  ?.label.message
                              }
                            />
                          )}
                        />

                        <div className="flex gap-2">
                          <Controller
                            control={control}
                            name={`informasiMuatan.${index}.beratMuatan.berat`}
                            render={({ field }) => {
                              return (
                                <NumberInput
                                  {...field}
                                  min={0}
                                  stepper={1}
                                  placeholder="0"
                                  errorMessage={
                                    errors?.informasiMuatan?.[index]
                                      ?.beratMuatan?.berat?.message
                                  }
                                  appearance={{
                                    containerClassName: "w-[80px]",
                                    inputClassName: "cursor-pointer ",
                                  }}
                                />
                              );
                            }}
                          />

                          <Controller
                            control={control}
                            name={`informasiMuatan.${index}.beratMuatan.unit`}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={field.onChange}
                                options={weightUnits}
                                placeholder="Pilih Unit"
                                className="w-[80px]"
                              />
                            )}
                          />
                        </div>

                        <div className="flex h-fit gap-4">
                          <div className="flex items-center gap-2">
                            <Controller
                              control={control}
                              name={`informasiMuatan.${index}.dimensiMuatan`}
                              render={({ field }) => {
                                // Reusable function to update dimension values
                                const updateDimensionValue = (
                                  dimension,
                                  value
                                ) => {
                                  const newValue = {
                                    ...field.value,
                                    [dimension]: value,
                                  };
                                  field.onChange(newValue);
                                };
                                return (
                                  <DimensionInput
                                    className="w-[173px]"
                                    manual={{
                                      panjang: {
                                        value: field.value?.panjang || "",
                                        setValue: (value) =>
                                          updateDimensionValue(
                                            "panjang",
                                            value
                                          ),
                                      },
                                      lebar: {
                                        value: field.value?.lebar || "",
                                        setValue: (value) =>
                                          updateDimensionValue("lebar", value),
                                      },
                                      tinggi: {
                                        value: field.value?.tinggi || "",
                                        setValue: (value) =>
                                          updateDimensionValue("tinggi", value),
                                      },
                                    }}
                                  />
                                );
                              }}
                            />

                            <Controller
                              control={control}
                              name={`informasiMuatan.${index}.dimensiMuatan.unit`}
                              render={({ field, fieldState }) => (
                                <Select
                                  value={field.value}
                                  onChange={field.onChange}
                                  options={dimensionUnits}
                                  placeholder="Pilih Unit"
                                  className="w-[80px]"
                                />
                              )}
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            {fields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                              >
                                <IconComponent
                                  src="/icons/min-square24.svg"
                                  width={24}
                                  height={24}
                                />
                              </button>
                            )}
                            {index + 1 === fields.length &&
                              fields.length < maxInformasiMuatan && (
                                <button
                                  type="button"
                                  onClick={() => append(defaultInformasiMuatan)}
                                >
                                  <IconComponent
                                    src="/icons/plus-square24.svg"
                                    width={24}
                                    height={24}
                                  />
                                </button>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Submit button for demo */}
              <div className="mt-4 flex justify-center">
                <Button variant="muatparts-primary" className="w-[112px]">
                  Simpan
                </Button>
              </div>
            </div>
          </form>
        </ModalContent>
      </Modal>

      <ModalNamaMuatan
        open={openModalNamaMuatan}
        onOpenChange={setOpenModalNamaMuatan}
        onSubmit={handleAddNew}
      />
    </>
  );
};

const Label = ({ required, optional, children, tooltip }) => (
  <div className="flex h-[16px] items-center gap-1">
    <div className="h-4 text-xs font-bold leading-[1.2] text-neutral-600">
      {children}
      {required && <span>*</span>}
      {optional && (
        <i className="font-medium text-gray-500">&nbsp;(Opsional)</i>
      )}
    </div>
    <div className="flex-shrink-0">{tooltip}</div>
  </div>
);
