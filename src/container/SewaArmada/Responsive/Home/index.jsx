import { useState } from "react";

import { Shield, Truck } from "lucide-react";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import IconComponent from "@/components/IconComponent/IconComponent";
import { TimelineField } from "@/components/Timeline/timeline-field";
import DefaultResponsiveLayout from "@/layout/ResponsiveLayout/DefaultResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { useSewaArmadaStore } from "@/store/forms/sewaArmadaStore";

import { BannerCarousel } from "../../../../components/BannerCarousel/BannerCarousel";
import { ModalFirstTimer } from "./ModalFirstTimer";
import WaktuMuatBottomsheet from "./WaktuMuat/WaktuMuat";

const FormLabelContainer = ({ children }) => {
  return (
    <div className="flex items-center gap-x-1 text-neutral-900">{children}</div>
  );
};

const FormLabelOld = ({ className, title, required = true }) => {
  return (
    <>
      <span className={`text-[14px] leading-[15.4px] ${className}`}>
        {`${title}${required ? "*" : ""}`}
      </span>
      {!required ? (
        <span className="text-[10px] leading-[10px]">{"(Opsional)"}</span>
      ) : null}
    </>
  );
};

const banners = [
  {
    id: 1,
    imageUrl: "/img/truck-banner.png",
    altText: "Promo Muatrans",
    linkUrl: "/promo/1",
  },
  {
    id: 2,
    imageUrl: "/img/truck-banner2.png",
    altText: "Layanan Pengiriman",
    linkUrl: "/services",
  },
  {
    id: 3,
    imageUrl: "/img/truck-banner3.png",
    altText: "Download Aplikasi",
    linkUrl: "/download",
  },
];

export const SewaArmadaHome = () => {
  const navigation = useResponsiveNavigation();
  const {
    formValues,
    formErrors,
    setField,
    setFotoMuatan,
    addLokasi,
    removeLokasi,
    validateForm,
    orderType,
    setOrderType,
    updateLokasi,
  } = useSewaArmadaStore();

  const [formData, setFormData] = useState({
    waktuMuat: "",
    lokasiMuat: "",
    lokasiBongkar: "",
    informasiMuatan: "",
    jenisCarrier: "",
    jenisTruk: "",
    layananTambahan: "",
  });

  const handleAddLocation = () => {
    navigation.push("/PencarianLokasi");
  };

  const handleEditInformasiMuatan = () => {
    navigation.push("/InformasiMuatan");
  };

  const handleAddInformasiMuatan = () => {
    navigation.push("/InformasiMuatan");
  };

  const handleEditLayananTambahan = () => {
    navigation.push("/LayananTambahan");
  };

  return (
    <DefaultResponsiveLayout mode="default">
      <div className="w-full bg-neutral-100">
        <BannerCarousel banners={banners} showControls={false} />

        {/* Brand Section */}
        <div className="my-2 flex h-[61px] w-full items-center justify-between gap-[29px] bg-white px-4 py-3">
          <div className="flex-1">
            <h2 className="text-[16px] font-semibold leading-[17.6px] text-[#461B02]">
              Ayo kirim muatan kamu dengan muatrans!
            </h2>
          </div>
          <div className="flex w-[123px] flex-col items-end gap-1">
            <img
              src="/icons/muattrans.svg"
              alt="muatrans"
              className="h-4 w-20"
            />
            {/* <div className="flex h-4 w-20 items-center justify-center rounded bg-gradient-to-r from-blue-600 to-yellow-500 text-xs font-bold text-white">
              muatrans
            </div> */}
            <p className="text-right text-[10px] font-semibold leading-[10px] text-[#461B02]">
              Cargo Land Transportation Company
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex flex-col gap-y-6 bg-white px-4 py-5">
          {/* Waktu Muat Field */}
          <FormContainer>
            <FormLabel required>Waktu Muat</FormLabel>
            <WaktuMuatBottomsheet />
          </FormContainer>

          {/* Lokasi Muat Field */}
          <FormContainer>
            <FormLabel required>Lokasi Muat</FormLabel>
            <TimelineField
              variant="muat"
              className="flex-1"
              values={
                formValues.lokasiMuat?.map(
                  (item) => item?.dataLokasi?.location || null
                ) || []
              }
              onAddLocation={() => addLokasi("lokasiMuat", null)}
              onDeleteLocation={(index) => removeLokasi("lokasiMuat", index)}
              onEditLocation={(index) => {
                navigation.push("/PencarianLokasi", {
                  config: {
                    formMode: "muat",
                    allSelectedLocations: formValues.lokasiMuat,
                    defaultValues: formValues.lokasiMuat[index],
                    index,
                  },
                });
              }}
            />
          </FormContainer>
          {/* Lokasi Bongkar Field */}
          <FormContainer>
            <FormLabel required>Lokasi Bongkar</FormLabel>
            <TimelineField
              variant="bongkar"
              className="flex-1"
              values={
                formValues.lokasiBongkar?.map(
                  (item) => item?.dataLokasi?.location || null
                ) || []
              }
              onAddLocation={() => addLokasi("lokasiBongkar", null)}
              onDeleteLocation={(index) => removeLokasi("lokasiBongkar", index)}
              onEditLocation={(index) => {
                navigation.push("/PencarianLokasi", {
                  config: {
                    formMode: "bongkar",
                    allSelectedLocations: formValues.lokasiBongkar,
                    defaultValues: formValues.lokasiBongkar[index],
                    index,
                  },
                });
              }}
            />
          </FormContainer>

          {/* Informasi Muatan Field */}
          <FormContainer>
            <FormLabel required>Informasi Muatan</FormLabel>
            <button
              className={
                "flex h-8 items-center justify-between rounded-md border border-neutral-600 bg-neutral-50 px-3"
              }
              onClick={handleEditInformasiMuatan}
            >
              <div className="flex items-center gap-x-2">
                <IconComponent src="/icons/muatan16.svg" />
                <span className="text-[14px] font-semibold leading-[15.4px] text-neutral-600">
                  Masukkan Muatan
                </span>
              </div>
              <IconComponent src="/icons/chevron-right.svg" />
            </button>
          </FormContainer>

          {/* Jenis Armada Field */}
          <FormContainer>
            <FormLabel required>Jenis Armada</FormLabel>
            <div className="space-y-2">
              {/* Pilih Jenis Carrier */}
              <div className="flex h-8 w-full items-center gap-2 rounded-md border border-neutral-600 bg-neutral-200 px-3 py-2">
                <Truck className="h-4 w-4 text-neutral-600" />
                <span className="flex-1 text-[14px] font-semibold text-neutral-600">
                  Pilih Jenis Carrier
                </span>
                <svg
                  className="h-4 w-4 text-neutral-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Pilih Jenis Truk */}
              <div className="flex h-8 w-full items-center gap-2 rounded-md border border-neutral-600 bg-neutral-200 px-3 py-2">
                <Truck className="h-4 w-4 text-neutral-600" />
                <span className="flex-1 text-[14px] font-semibold text-neutral-600">
                  Pilih Jenis Truk
                </span>
                <svg
                  className="h-4 w-4 text-neutral-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </FormContainer>

          {/* Asuransi Barang Field */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-[14px] font-semibold leading-[15.4px] text-neutral-900">
                  Asuransi Barang
                </span>
                <span className="text-[10px] font-semibold text-neutral-900">
                  (Opsional)
                </span>
              </div>
              <span className="cursor-pointer text-[12px] font-semibold text-primary-700">
                Ubah Asuransi
              </span>
            </div>
            <div className="flex h-8 w-full items-center gap-2 rounded-md border border-neutral-600 bg-neutral-50 px-3 py-2">
              <Shield className="h-4 w-4 text-neutral-700" />
              <span className="flex-1 text-[14px] font-semibold text-neutral-900">
                Gratis perlindungan hingga Rp10.000.000
              </span>
            </div>
          </div>

          {/* Layanan Tambahan Field */}
          <div className="flex flex-col gap-y-4">
            <FormLabelContainer>
              <FormLabelOld
                className="font-semibold"
                title="Layanan Tambahan"
                required={false}
              />
            </FormLabelContainer>
            <button
              className={
                "flex h-8 items-center justify-between rounded-md border border-neutral-600 bg-neutral-50 px-3"
              }
              onClick={handleEditLayananTambahan}
            >
              <div className="flex items-center gap-x-2">
                <IconComponent src="/icons/muatan16.svg" />
                <span className="text-[14px] font-semibold leading-[15.4px] text-neutral-600">
                  Layanan Tambahan
                </span>
              </div>
              <IconComponent src="/icons/chevron-right.svg" />
            </button>
          </div>
        </div>
      </div>

      <ModalFirstTimer />
    </DefaultResponsiveLayout>
  );
};
