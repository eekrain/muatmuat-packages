"use client";

import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";

import Button from "@/components/Button/Button";
import DropdownRadioBottomsheeet from "@/components/Dropdown/DropdownRadioBottomsheeet";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import Checkbox from "@/components/Form/Checkbox";
import { DimensionInput } from "@/components/Form/DimensionInput";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoBottomsheet } from "@/components/Form/InfoBottomsheet";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import RadioButton from "@/components/Radio/RadioButton";

import { useTranslation } from "@/hooks/use-translation";

import { OrderTypeEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { compareArraysByNameOnly } from "@/lib/utils/array";

import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useInformasiMuatanStore } from "@/store/Shipper/forms/informasiMuatanStore";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

import { JenisTrukBottomSheet } from "./JenisTrukBottomSheet";

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

const InformasiMuatanScreen = ({
  cargoTypes,
  cargoCategories,
  trucks,
  onFetchTrucks,
}) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const navigation = useResponsiveNavigation();
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
  const { setField: setSewaArmadaField } = useSewaArmadaActions();
  const orderType = useSewaArmadaStore((state) => state.orderType);
  const informasiMuatan = useSewaArmadaStore(
    (state) => state.formValues.informasiMuatan
  );
  const truckTypeId = useSewaArmadaStore(
    (state) => state.formValues.truckTypeId
  );

  const [openJenisTrukBottomSheet, setOpenJenisTrukBottomSheet] =
    useState(false);
  const [selectedTruck, setSelectedTruck] = useState(true);

  const handleSaveInformasiMuatan = async () => {
    console.log("🚀 ~ handleSaveInformasiMuatan ~ formValues:", formValues);
    if (!validateForm()) {
      console.log("Form has errors", formErrors);
      return;
    }

    if (
      truckTypeId &&
      JSON.stringify(informasiMuatan) !==
        JSON.stringify(formValues.informasiMuatan) &&
      !isEditPage
    ) {
      if (
        compareArraysByNameOnly(informasiMuatan, formValues.informasiMuatan)
      ) {
        await onFetchTrucks({
          informasiMuatan: formValues.informasiMuatan,
        });
        setOpenJenisTrukBottomSheet(true);
        return;
      } else {
        setSewaArmadaField("carrierId", null);
        setSewaArmadaField("truckTypeId", null);
      }
    }
    Object.entries(formValues).forEach(([key, value]) => {
      setSewaArmadaField(key, value);
    });
    navigation.popTo("/");
    // Handle form submission, save to sewaArmadaStore here
  };

  return (
    <FormResponsiveLayout
      title={{
        label: t(
          "InformasiMuatanScreen.titleInformasiMuatan",
          {},
          "Informasi Muatan"
        ),
      }}
    >
      <div className="mb-16 grid grid-cols-1 gap-2">
        {/* Section Tipe Muatan */}
        <FormContainer className="px-4 py-5">
          <FormLabel
            required
            tooltip={
              <InfoBottomsheet
                title={t(
                  "InformasiMuatanScreen.titleCargoTypeToBeShipped",
                  {},
                  "Tipe Muatan yang Akan Dikirimkan"
                )}
                render={t(
                  "InformasiMuatanScreen.infoBottomsheetCargoTypeDescription",
                  {},
                  "<ul><li><b>Bahan Mentah :</b> Material atau komponen yang belum diproses.</li><li><b>Barang Setengah Jadi :</b> Produk yang telah mengalami beberapa tahap proses tapi belum selesai.</li><li><b>Barang Jadi :</b> Produk akhir yang siap untuk digunakan atau dijual.</li><li><b>Lainnya :</b> Bahan / barang yang tidak sesuai dengan jenis diatas, namun tetap memiliki fungsi dalam proses produksi atau distribusi.</li></ul><p><center>Pemilihan tipe muatan yang tepat akan membantu dalam pengelolaan dan pengiriman.</center></p>"
                )}
              />
            }
          >
            {t("InformasiMuatanScreen.labelCargoType", {}, "Tipe Muatan")}
          </FormLabel>

          {/* Radio Button Group */}
          <div>
            <div className="flex flex-col gap-y-4">
              {cargoTypes.map((cargoType, key) => (
                <Fragment key={key}>
                  <RadioButton
                    name="cargoTypeId"
                    label={cargoType.name}
                    checked={formValues.cargoTypeId === cargoType.id}
                    onClick={({ value }) => setField("cargoTypeId", value)}
                    value={cargoType.id}
                  />
                </Fragment>
              ))}
            </div>
            {formErrors?.cargoTypeId && (
              <span className="mt-3 block text-xs font-medium text-red-500">
                {formErrors.cargoTypeId}
              </span>
            )}
          </div>
        </FormContainer>

        {/* Section Jenis Muatan */}
        <FormContainer className="px-4 py-5">
          <FormLabel
            required
            tooltip={
              <InfoBottomsheet
                title={t(
                  "InformasiMuatanScreen.titleCargoCategoryInformation",
                  {},
                  "Informasi Jenis Muatan"
                )}
                render={t(
                  "InformasiMuatanScreen.infoBottomsheetCargoCategoryDescription",
                  {},
                  "<ul><li><b>Padat:</b> Muatan yang berbentuk solid.</li><li><b>Cair:</b> Muatan dalam bentuk cairan, biasanya membutuhkan penanganan khusus.</li><li><b>Curah:</b> Muatan yang dikirim secara massal, seperti biji-bijian atau pasir.</li><li><b>Kendaraan:</b> Muatan berupa alat transportasi yang perlu diangkut.</li><li><b>Container:</b> Muatan yang dikemas dalam suatu container.</li></ul><p><center>Pemilihan jenis muatan yang tepat akan membantu dalam pengelolaan dan pengiriman.</center></p>"
                )}
              />
            }
          >
            {t("InformasiMuatanScreen.labelCargoCategory", {}, "Jenis Muatan")}
          </FormLabel>

          {/* Radio Button Group */}
          <div>
            <div className="flex flex-col gap-y-4">
              {cargoCategories.map((cargoCategory, key) => (
                <Fragment key={key}>
                  <RadioButton
                    name="cargoCategoryId"
                    label={cargoCategory.name}
                    checked={formValues.cargoCategoryId === cargoCategory.id}
                    onClick={({ value }) => setField("cargoCategoryId", value)}
                    value={cargoCategory.id}
                  />
                </Fragment>
              ))}
            </div>
            {formErrors?.cargoCategoryId && (
              <span className="mt-3 block text-xs font-medium text-red-500">
                {formErrors.cargoCategoryId}
              </span>
            )}
          </div>
        </FormContainer>

        {/* Section Sertifikasi Halal Logistik */}
        <FormContainer className="px-4 py-5">
          <FormLabel
            required
            tooltip={
              <InfoBottomsheet
                title={t(
                  "InformasiMuatanScreen.titleHalalLogisticsCertification",
                  {},
                  "Sertifikasi Halal Logistik"
                )}
                render={t(
                  "InformasiMuatanScreen.infoBottomsheetHalalLogisticsDescription",
                  {},
                  "<p>Pilih opsi ini jika pengiriman memerlukan pengelolaan rantai pasok yang memastikan produk tetap sesuai prinsip halal, mulai dari transportasi hingga penyimpanan</p>"
                )}
              />
            }
          >
            {t(
              "InformasiMuatanScreen.labelHalalLogisticsCertification",
              {},
              "Sertifikasi Halal Logistik"
            )}
          </FormLabel>

          {/* Checkbox Section */}
          <div className="flex gap-1">
            <Checkbox
              checked={formValues.isHalalLogistics}
              onChange={(e) => setField("isHalalLogistics", e.checked)}
              label={t(
                "InformasiMuatanScreen.labelHalalLogisticsCheckbox",
                {},
                "Centang opsi jika pengiriman memerlukan armada dengan sertifikat halal logistik"
              )}
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
                  <FormLabel required>
                    {t(
                      "InformasiMuatanScreen.labelCargoName",
                      {},
                      "Nama Muatan"
                    )}
                  </FormLabel>
                  <div className="flex w-full flex-col">
                    <button
                      className={cn(
                        "flex h-8 items-center justify-between rounded-md border border-neutral-600 bg-neutral-50 px-3",
                        formErrors[`informasiMuatan.${index}.namaMuatan`] &&
                          "border-error-400"
                      )}
                      onClick={() =>
                        navigation.push("/CariNamaMuatan", {
                          index,
                          cargoTypeId: formValues.cargoTypeId,
                          cargoCategoryId: formValues.cargoCategoryId,
                        })
                      }
                    >
                      <div className="flex items-center gap-x-2">
                        <IconComponent src="/icons/muatan16.svg" />
                        <span
                          className={cn(
                            "text-sm font-semibold leading-[15.4px]",
                            !muatan.namaMuatan.label && "text-neutral-600"
                          )}
                        >
                          {muatan.namaMuatan.label ||
                            t(
                              "InformasiMuatanScreen.placeholderSelectCargoName",
                              {},
                              "Pilih Nama Muatan"
                            )}
                        </span>
                      </div>
                      <IconComponent src="/icons/chevron-right.svg" />
                    </button>
                    {formErrors[`informasiMuatan.${index}.namaMuatan`] && (
                      <span className="mt-3 text-xs font-medium leading-[13.2px] text-error-400">
                        {t(
                          "InformasiMuatanScreen.messageErrorCargoMustBeSelected",
                          {},
                          "Muatan wajib dipilih"
                        )}
                      </span>
                    )}
                  </div>
                </FormContainer>

                {/* Berat Muatan Field */}
                <FormContainer>
                  <FormLabel
                    required
                    tooltip={
                      <InfoBottomsheet
                        // 25. 18 - Web - LB - 0033
                        title="Berat Muatan"
                        render="<p>Masukkan berat keseluruhan atau total dari seluruh muatan yang akan dikirim.</p>"
                      />
                    }
                  >
                    {t(
                      "InformasiMuatanScreen.labelCargoWeight",
                      {},
                      "Berat Muatan"
                    )}
                  </FormLabel>

                  <div className="flex gap-2.5">
                    <Input
                      type="text"
                      placeholder="0"
                      className="flex-1"
                      maxLength={6}
                      value={muatan.beratMuatan.berat}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        // Limit to 6 digits
                        if (val.length <= 6) {
                          updateBeratMuatan(
                            index,
                            "berat",
                            val ? Number(val) : ""
                          );
                        }
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
                      title={t(
                        "InformasiMuatanScreen.titleCargoWeight",
                        {},
                        "Berat Muatan"
                      )}
                      options={beratMuatanOptions}
                      value={muatan.beratMuatan.unit}
                      onChange={(value) =>
                        updateBeratMuatan(index, "unit", value)
                      }
                      saveLabel={t(
                        "InformasiMuatanScreen.buttonApply",
                        {},
                        "Terapkan"
                      )}
                    />
                  </div>
                </FormContainer>

                {/* Dimensi Muatan Field */}
                <FormContainer>
                  <FormLabel
                    optional
                    tooltip={
                      <InfoBottomsheet
                        title={t(
                          "InformasiMuatanScreen.titleCargoTypeToBeShipped",
                          {},
                          "Tipe Muatan yang Akan Dikirimkan"
                        )}
                        render={t(
                          "InformasiMuatanScreen.infoBottomsheetCargoDimensions",
                          {},
                          "<ul><li><b>Panjang :</b> Ukuran terpanjang dari muatan.</li><li><b>Lebar :</b> Ukuran terlebar dari muatan.</li><li><b>Tinggi :</b> Ukuran tertinggi dari muatan</li></ul><p>Pengisian dimensi yang tepat akan membantu dalam pengelolaan dan pengiriman.</p>"
                        )}
                      />
                    }
                  >
                    {t(
                      "InformasiMuatanScreen.labelCargoDimensions",
                      {},
                      "Dimensi Muatan"
                    )}
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
                        appearance={{
                          inputClassName:
                            "font-semibold text-sm leading-[15.4px] text-neutral-900",
                        }}
                      />
                    </div>
                    <DropdownRadioBottomsheeet
                      className="w-[65px]"
                      title={t(
                        "InformasiMuatanScreen.titleCargoDimensions",
                        {},
                        "Dimensi Muatan"
                      )}
                      options={dimensiMuatanOptions}
                      value={muatan.dimensiMuatan.unit}
                      onChange={(value) =>
                        updateDimensiMuatan(index, "unit", value)
                      }
                      saveLabel={t(
                        "InformasiMuatanScreen.buttonApply",
                        {},
                        "Terapkan"
                      )}
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

      <JenisTrukBottomSheet
        open={openJenisTrukBottomSheet}
        onOpenChange={setOpenJenisTrukBottomSheet}
        trucks={trucks}
        onSelectTruck={(truck) => {
          setSewaArmadaField("truckTypeId", truck.truckTypeId);
          setSewaArmadaField(
            "truckCount",
            orderType === OrderTypeEnum.INSTANT ? 1 : truck.unit
          );
          setOpenJenisTrukBottomSheet(false);
          toast.success(
            t(
              "InformasiMuatanScreen.messageSuccessCargoAndFleetInfoUpdated",
              {},
              "Informasi muatan dan jenis armada telah berhasil diubah"
            )
          );
          Object.entries(formValues).forEach(([key, value]) => {
            setSewaArmadaField(key, value);
          });
          navigation.pop();
        }}
      />

      <ResponsiveFooter className="flex gap-3">
        <Button
          variant="muatparts-primary"
          className="flex-1"
          onClick={handleSaveInformasiMuatan}
          type="button"
        >
          {t("InformasiMuatanScreen.buttonSave", {}, "Simpan")}
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};

export default InformasiMuatanScreen;
