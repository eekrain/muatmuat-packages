"use client";

import { Fragment } from "react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import DropdownRadioBottomsheeet from "@/components/Dropdown/DropdownRadioBottomsheeet";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import { DimensionInput } from "@/components/Form/DimensionInput";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoBottomsheet } from "@/components/Form/InfoBottomsheet";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import RadioButton from "@/components/Radio/RadioButton";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { cn } from "@/lib/utils";
import { useInformasiMuatanStore } from "@/store/forms/informasiMuatanStore";

const beratMuatanOptions = [
  {
    label: "kg",
    value: "kg",
  },
  {
    label: "Liter",
    value: "liter",
  },
  {
    label: "Ton",
    value: "ton",
  },
];
const dimensiMuatanOptions = [
  {
    label: "m",
    value: "m",
  },
  {
    label: "cm",
    value: "cm",
  },
];

const InformasiMuatanScreen = () => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  const {
    formValues,
    formErrors,
    setField,
    addInformasiMuatan,
    removeInformasiMuatan,
    updateBeratMuatan,
    updateDimensiMuatan,
    validateForm,
  } = useInformasiMuatanStore();

  const handleSaveInformasiMuatan = () => {
    console.log("🚀 ~ handleSaveInformasiMuatan ~ formValues:", formValues);
    if (!validateForm()) {
      console.log("Form has errors", formErrors);
    }
    // Handle form submission, save to sewaArmadaStore here
  };

  return (
    <FormResponsiveLayout
      title={{
        label: "Informasi Muatan",
      }}
    >
      <div className="mb-16 grid grid-cols-1 gap-2">
        {/* Section Tipe Muatan */}
        <FormContainer className="px-4 py-5">
          <FormLabel
            required
            tooltip={
              <InfoBottomsheet title="Tipe Muatan yang Akan Dikirimkan">
                <ul>
                  <li>
                    <b>Bahan Mentah :</b> Material atau komponen yang belum
                    diproses.
                  </li>
                  <li>
                    <b>Barang Setengah Jadi :</b> Produk yang telah mengalami
                    beberapa tahap proses tapi belum selesai.
                  </li>
                  <li>
                    <b>Barang Jadi :</b> Produk akhir yang siap untuk digunakan
                    atau dijual.
                  </li>
                  <li>
                    <b>Lainnya :</b> Bahan / barang yang tidak sesuai dengan
                    jenis diatas, namun tetap memiliki fungsi dalam proses
                    produksi atau distribusi.
                  </li>
                </ul>
                <p>
                  Pemilihan tipe muatan yang tepat akan membantu dalam
                  pengelolaan dan pengiriman.
                </p>
              </InfoBottomsheet>
            }
          >
            Tipe Muatan
          </FormLabel>

          {/* Radio Button Group */}
          <div>
            <div className="flex flex-col gap-y-4">
              <RadioButton
                name="tipeMuatan"
                label="Bahan Mentah"
                checked={formValues.tipeMuatan === "bahan-mentah"}
                onClick={() => setField("tipeMuatan", "bahan-mentah")}
                value="bahan-mentah"
              />
              <RadioButton
                name="tipeMuatan"
                label="Barang Setengah Jadi"
                checked={formValues.tipeMuatan === "barang-setengah-jadi"}
                onClick={() => setField("tipeMuatan", "barang-setengah-jadi")}
                value="barang-setengah-jadi"
              />
              <RadioButton
                name="tipeMuatan"
                label="Barang Jadi"
                checked={formValues.tipeMuatan === "barang-jadi"}
                onClick={() => setField("tipeMuatan", "barang-jadi")}
                value="barang-jadi"
              />
              <RadioButton
                name="tipeMuatan"
                label="Lainnya"
                checked={formValues.tipeMuatan === "lainnya"}
                onClick={() => setField("tipeMuatan", "lainnya")}
                value="lainnya"
              />
            </div>
            {formErrors.tipeMuatan && (
              <span className="mt-3 block text-xs font-medium text-red-500">
                {formErrors.tipeMuatan}
              </span>
            )}
          </div>
        </FormContainer>

        {/* Section Jenis Muatan */}
        <FormContainer className="px-4 py-5">
          <FormLabel
            required
            tooltip={
              <InfoBottomsheet title="Tipe Muatan yang Akan Dikirimkan">
                <ul>
                  <li>
                    <b>Padat:</b> Muatan yang berbentuk solid.
                  </li>
                  <li>
                    <b>Cair:</b> Muatan dalam bentuk cairan, biasanya
                    membutuhkan penanganan khusus.
                  </li>
                  <li>
                    <b>Curah:</b> Muatan yang dikirim secara massal, seperti
                    biji-bijian atau pasir.
                  </li>
                  <li>
                    <b>Kendaraan:</b> Muatan berupa alat transportasi yang perlu
                    diangkut.
                  </li>
                  <li>
                    <b>Container:</b> Muatan yang dikemas dalam suatu container.
                  </li>
                </ul>
                <p>
                  Pemilihan jenis muatan yang tepat akan membantu dalam
                  pengelolaan dan pengiriman.
                </p>
              </InfoBottomsheet>
            }
          >
            Jenis Muatan
          </FormLabel>

          {/* Radio Button Group */}
          <div>
            <div className="flex flex-col gap-y-4">
              <RadioButton
                name="jenisMuatan"
                label="Padat"
                checked={formValues.jenisMuatan === "padat"}
                onClick={() => setField("jenisMuatan", "padat")}
                value="padat"
              />
              <RadioButton
                name="jenisMuatan"
                label="Cair"
                checked={formValues.jenisMuatan === "cair"}
                onClick={() => setField("jenisMuatan", "cair")}
                value="cair"
              />
              <RadioButton
                name="jenisMuatan"
                label="Curah"
                checked={formValues.jenisMuatan === "curah"}
                onClick={() => setField("jenisMuatan", "curah")}
                value="curah"
              />
              <RadioButton
                name="jenisMuatan"
                label="Kendaraan"
                checked={formValues.jenisMuatan === "kendaraan"}
                onClick={() => setField("jenisMuatan", "kendaraan")}
                value="kendaraan"
              />
              <RadioButton
                name="jenisMuatan"
                label="Container"
                checked={formValues.jenisMuatan === "container"}
                onClick={() => setField("jenisMuatan", "container")}
                value="container"
              />
            </div>
            {formErrors.jenisMuatan && (
              <span className="mt-3 block text-xs font-medium text-red-500">
                {formErrors.jenisMuatan}
              </span>
            )}
          </div>
        </FormContainer>

        {/* Section Sertifikasi Halal Logistik */}
        <FormContainer className="px-4 py-5">
          <FormLabel
            required
            tooltip={
              <InfoBottomsheet title="Tipe Muatan yang Akan Dikirimkan">
                <p>
                  Pilih opsi ini jika pengiriman memerlukan pengelolaan rantai
                  pasok yang memastikan produk tetap sesuai prinsip halal, mulai
                  dari transportasi hingga penyimpanan
                </p>
              </InfoBottomsheet>
            }
          >
            Sertifikasi Halal Logistik
          </FormLabel>

          {/* Checkbox Section */}
          <div className="flex gap-1">
            <Checkbox
              checked={formValues.sertifikasiHalal}
              onChange={(e) => setField("sertifikasiHalal", e.checked)}
              label="Centang opsi jika pengiriman memerlukan armada dengan sertifikat halal logistik"
              value="halal_certification"
              className="w-full"
            />
          </div>
        </FormContainer>

        {/* Section Input Data Muatan */}
        <div className="flex flex-col gap-6 bg-white px-4 py-5">
          {formValues.informasiMuatan.map((muatan, index) => {
            const isLastItem = formValues.informasiMuatan.length - 1 === index;
            return (
              <Fragment key={index}>
                {/* Nama Muatan Field */}
                <FormContainer>
                  <FormLabel required>Nama Muatan</FormLabel>
                  <button
                    className={
                      "flex h-8 items-center justify-between rounded-md border border-neutral-600 bg-neutral-50 px-3"
                    }
                    onClick={() =>
                      navigation.push("/CariNamaMuatan", { index })
                    }
                  >
                    <div className="flex items-center gap-x-2">
                      <IconComponent src="/icons/muatan16.svg" />
                      <span
                        className={cn(
                          "text-[14px] font-semibold leading-[15.4px]",
                          !muatan.namaMuatan.label && "text-neutral-600"
                        )}
                      >
                        {muatan.namaMuatan.label || "Pilih Nama Muatan"}
                      </span>
                    </div>
                    <IconComponent src="/icons/chevron-right.svg" />
                  </button>
                </FormContainer>

                {/* Berat Muatan Field */}
                <FormContainer>
                  <FormLabel
                    required
                    tooltip={
                      <InfoBottomsheet title="Tipe Muatan yang Akan Dikirimkan">
                        <p>
                          Pilih opsi ini jika pengiriman memerlukan pengelolaan
                          rantai pasok yang memastikan produk tetap sesuai
                          prinsip halal, mulai dari transportasi hingga
                          penyimpanan
                        </p>
                      </InfoBottomsheet>
                    }
                  >
                    Berat Muatan
                  </FormLabel>

                  <div className="flex gap-2.5">
                    <Input
                      type="text"
                      placeholder="0"
                      className="flex-1"
                      value={muatan.beratMuatan.berat}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        updateBeratMuatan(
                          index,
                          "berat",
                          val ? Number(val) : ""
                        );
                      }}
                      errorMessage={
                        formErrors[`informasiMuatan.${index}.beratMuatan.berat`]
                      }
                    />
                    <DropdownRadioBottomsheeet
                      className={cn(
                        "w-[65px]",
                        formErrors[
                          `informasiMuatan.${index}.beratMuatan.berat`
                        ] && "border-red-500"
                      )}
                      title="Berat Muatan"
                      options={beratMuatanOptions}
                      value={muatan.beratMuatan.unit}
                      onChange={(value) =>
                        updateBeratMuatan(index, "unit", value)
                      }
                    />
                  </div>
                </FormContainer>

                {/* Dimensi Muatan Field */}
                <FormContainer>
                  <FormLabel
                    tooltip={
                      <InfoBottomsheet title="Tipe Muatan yang Akan Dikirimkan">
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
                      </InfoBottomsheet>
                    }
                  >
                    Dimensi Muatan
                  </FormLabel>

                  <div className="flex items-center gap-2.5">
                    {/* Custom Dimension Input */}
                    <div className="relative flex-1">
                      <DimensionInput
                        manual={{
                          lebar: {
                            value: muatan.dimensiMuatan.lebar,
                            setValue: (value) =>
                              updateDimensiMuatan(index, "lebar", value),
                          },
                          tinggi: {
                            value: muatan.dimensiMuatan.tinggi,
                            setValue: (value) =>
                              updateDimensiMuatan(index, "tinggi", value),
                          },
                          panjang: {
                            value: muatan.dimensiMuatan.panjang,
                            setValue: (value) =>
                              updateDimensiMuatan(index, "panjang", value),
                          },
                        }}
                        onChange={(field, value) =>
                          updateDimensiMuatan(index, field, value)
                        }
                      />
                    </div>
                    <DropdownRadioBottomsheeet
                      className="w-[65px]"
                      title="Dimensi Muatan"
                      options={dimensiMuatanOptions}
                      value={muatan.dimensiMuatan.unit}
                      onChange={(value) =>
                        updateDimensiMuatan(index, "unit", value)
                      }
                    />
                  </div>
                </FormContainer>

                {/* Add and Remove Button */}
                <div
                  className={`flex justify-end ${isLastItem ? "" : "border-b border-b-neutral-400 pb-6"}`}
                >
                  <div className="flex items-center gap-x-5">
                    {formValues.informasiMuatan.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInformasiMuatan(index)}
                      >
                        <IconComponent
                          src="/icons/min-square32.svg"
                          height={32}
                          width={32}
                        />
                      </button>
                    )}
                    {isLastItem && (
                      <button type="button" onClick={addInformasiMuatan}>
                        <IconComponent
                          src="/icons/plus-square32.svg"
                          height={32}
                          width={32}
                        />
                      </button>
                    )}
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>

      <ResponsiveFooter className="flex gap-3">
        <Button
          variant="muatparts-primary"
          className="flex-1"
          onClick={handleSaveInformasiMuatan}
          type="button"
        >
          Tambah Nama Muatan
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};

export default InformasiMuatanScreen;
