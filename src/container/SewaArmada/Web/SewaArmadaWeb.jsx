"use client";

import Image from "next/image";
import { Fragment, useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import Checkbox from "@/components/Checkbox/Checkbox";
import DatetimePicker from "@/components/DatetimePicker/DatetimePicker";
import FloatingButton from "@/components/FloatingButton/FloatingButton";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import { LocationModalFormWeb } from "@/components/LocationManagement/Web";
import RadioButton from "@/components/Radio/RadioButton";
import TextArea from "@/components/TextArea/TextArea";
import { TimelineField } from "@/components/Timeline/timeline-field";
import { InfoTooltip } from "@/components/Tooltip/Tooltip";
import { cn } from "@/lib/cn";
// import SWRHandler from "@/services/useSWRHook";
import { useSewaArmadaStore } from "@/store/forms/sewaArmadaStore";
import { getNowTimezone } from "@/utils/dateTime";

import { BannerCarousel } from "../common/BannerCarousel";
import FilterModal from "./FilterModal/FilterModal";
import FirstTimer from "./FirstTimer/FirstTimer";
import FleetOrderConfirmationModal from "./FleetOrderConfirmationModal/FleetOrderConfirmationModal";
import { InformasiMuatanModal } from "./InformasiMuatan";
import { InformasiMuatanTable } from "./InformasiMuatan/InformasiMuatanTable";
import SelectedTruck from "./SelectedTruck/SelectedTruck";
import TruckImageModal from "./TruckImageModal/TruckImageModal";
import WelcomeCard from "./WelcomeCard/WelcomeCard";

const FormLabel = ({ size = "big", title, required = false }) => (
  <div className={`flex items-center ${size === "big" ? "h-8" : "h-4"}`}>
    <label className="w-[174px] text-[12px] font-medium leading-[14.4px] text-neutral-600">
      {`${title}${required ? "*" : " (Opsional)"}`}
    </label>
  </div>
);

const defaultModalConfig = {
  open: false,
  formMode: "muat",
  allSelectedLocations: [],
  defaultValues: null,
  onSubmit: () => {},
};

const MODE_MAP = {
  muat: "lokasiMuat",
  bongkar: "lokasiBongkar",
};

export const useModalLocation = () => {
  const [modalConfig, setModalConfig] = useState(defaultModalConfig);
  const updateLokasi = useSewaArmadaStore((state) => state.updateLokasi);

  const handleOpenModalLocation = ({
    formMode,
    allSelectedLocations,
    defaultValues,
    index,
  }) => {
    setModalConfig({
      open: true,
      formMode,
      allSelectedLocations,
      defaultValues,
      onSubmit: (newData) => {
        updateLokasi(MODE_MAP[formMode], index, newData);
      },
      index,
    });
  };
  const handleCloseModalLocation = () => setModalConfig(defaultModalConfig);

  return {
    modalConfig,
    handleOpenModalLocation,
    handleCloseModalLocation,
  };
};

export default function SewaArmadaWeb() {
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

  const carrierData = {
    recommended: [
      {
        id: 1,
        title: "Towing Car",
        src: "/img/recommended1.png",
      },
    ],
    notRecommended: [
      {
        id: 2,
        title: "Flat Bed",
        src: "/img/recommended1.png",
      },
      {
        id: 3,
        title: "Trailer Container",
        src: "/img/recommended1.png",
      },
      {
        id: 4,
        title: "Trailer Reefer",
        src: "/img/recommended2.png",
      },
    ],
  };
  const truckData = {
    recommended: [
      {
        id: 1,
        title: "Colt Diesel Engkel",
        src: "/img/recommended1.png",
        cost: 200000,
        capacity: "2,5 Ton",
        dimension: "5,7 m x 2,2 m x 2,3 m",
      },
    ],
    notRecommended: [
      {
        id: 2,
        title: "Flat Bed",
        src: "/img/recommended1.png",
        cost: 200000,
        capacity: "2,5 Ton",
        dimension: "5,7 m x 2,2 m x 2,3 m",
      },
      {
        id: 3,
        title: "Trailer Container",
        src: "/img/recommended1.png",
        cost: 200000,
        capacity: "2,5 Ton",
        dimension: "5,7 m x 2,2 m x 2,3 m",
      },
      {
        id: 4,
        title: "Trailer Reefer",
        src: "/img/recommended2.png",
        cost: 200000,
        capacity: "2,5 Ton",
        dimension: "5,7 m x 2,2 m x 2,3 m",
      },
    ],
  };
  const armadaData = {
    carrier: carrierData,
    truck: truckData,
  };
  // API Base URL
  const baseUrl = process.env.NEXT_PUBLIC_GLOBAL_API || "";

  // SWR Hooks
  // const { useSWRHook, useSWRMutateHook } = SWRHandler;
  const [openControlled, setOpenControlled] = useState(false);
  const [isModalConfirmationOpen, setIsModalConfirmationOpen] = useState(false);

  // Menggunakan state dari zustand
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

  const { modalConfig, handleOpenModalLocation, handleCloseModalLocation } =
    useModalLocation();
  // console.log("form", formValues);
  const timezone = {
    id: "Asia/Jakarta",
    offset: "+07:00",
  };

  // State untuk carousel
  const [isAsuransiModalOpen, setIsAsuransiModalOpen] = useState(false);

  const informasiMuatan = useSewaArmadaStore(
    (state) => state.formValues.informasiMuatan
  );
  const [isInformasiMuatanModalOpen, setIsInformasiMuatanModalOpen] =
    useState(false);
  const handleSaveInformasiMuatan = (data) => {
    setField("informasiMuatan", data);
  };

  // State untuk jenis armada
  const [isArmadaPopupOpen, setIsArmadaPopupOpen] = useState(false);
  const [type, setType] = useState(""); // carrier or truck
  const [isTruckImageModalOpen, setIsTruckImageModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState("");

  // State untuk menyimpan data dari API
  const [cargoTypes, setCargoTypes] = useState([]);
  const [cargoCategories, setCargoCategories] = useState([]);
  const [loadingCargoTypes, setLoadingCargoTypes] = useState(false);

  // Clean up zustand state saat unmount
  useEffect(() => {
    return () => {
      // Optional: reset form saat keluar dari halaman
      // useArmadaInstanStore.getState().resetForm();
    };
  }, []);

  // API Calls dengan SWR
  // const { data: cargoTypesData, error: cargoTypesError } = useSWRHook(
  //   `${baseUrl}muattrans/v1/order/cargos/types`
  // );
  // const { data: cargoCategoriesData } = useSWRHook(
  //   `${baseUrl}muattrans/v1/order/cargos/categories`
  // );
  // Hooks untuk dependensi data
  // useEffect(() => {
  //   if (cargoTypesData?.Data?.types) {
  //     setCargoTypes(cargoTypesData.Data.types);
  //   }
  // }, [cargoTypesData]);

  // Fetch cargo categories saat tipe muatan berubah
  // const fetchCargoCategories = useCallback(
  //   async (cargoTypeId) => {
  //     if (!cargoTypeId) return;

  //     try {
  //       // Find cargo type in cargoTypes
  //       const selectedCargoType = cargoTypes.find(
  //         (ct) => ct.cargoTypeId === cargoTypeId
  //       );
  //       if (selectedCargoType && selectedCargoType.categories) {
  //         setCargoCategories(selectedCargoType.categories);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching cargo categories:", error);
  //       toast.error("Gagal memuat kategori muatan");
  //     }
  //   },
  //   [cargoTypes, toast, setDataToast]
  // );

  // useEffect(() => {
  //   if (tipeMuatan) {
  //     fetchCargoCategories(tipeMuatan);
  //   }
  // }, [tipeMuatan, fetchCargoCategories]);

  const handleDateChange = (field, value) => {
    const newDate = new Date(value);
    newDate.setSeconds(0, 0);
    setField(field === "start" ? "startDate" : "endDate", newDate);
  };

  // Handler untuk upload foto muatan
  const handleImageUpload = (index, img) => setFotoMuatan(index, img);

  const handleSelectArmada = (value) => {
    if (type === "carrier") {
      setField("jenisCarrier", value);
    }
    if (type === "truck") {
      setField("jenisTruk", value);
    }
  };

  const handleSelectImage = (src) => {
    setSelectedImageSrc(src);
    setIsTruckImageModalOpen(true);
  };

  // console.log("jen", jenisCarrier, jenisTruk);
  const handleValidateFleetOrder = () => {
    const isValidForm = validateForm();
    if (isValidForm) {
      setIsModalConfirmationOpen(true);
    }
  };

  const handleOrderFleet = () => {
    // logic sewa armada
    setIsModalConfirmationOpen(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 bg-neutral-50 px-10 py-8">
      {/* Carousel Banner */}
      <BannerCarousel banners={banners} />

      {/* Main Content */}
      {orderType === "" ? (
        <FirstTimer />
      ) : (
        <>
          {/* Welcome Section */}
          <WelcomeCard />
          <div className="flex w-full max-w-[1200px] gap-4">
            {/* Form Container */}
            <Card className="flex flex-1 flex-col gap-6 border-none p-8 shadow-md">
              {/* Service Type Selection */}
              <div className="flex justify-center gap-3">
                {/* Instan Card - Active */}
                <div
                  className={cn(
                    "flex h-[136px] w-[385px] cursor-pointer flex-col items-center justify-center gap-y-3 rounded-xl border p-6 hover:border-[#FFC217]",
                    orderType === "instan"
                      ? "border-[#FFC217] bg-[#FFF5C6]"
                      : "border-neutral-400 bg-white"
                  )}
                  onClick={() => setOrderType("instan")}
                >
                  <div className="relative h-8 w-8">
                    <Image
                      src="/icons/muattrans-instan.svg"
                      alt="Instan"
                      width={32}
                      height={32}
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-black">Instan</h3>
                  <p className="max-w-[294px] text-center text-xs font-medium text-neutral-600">
                    Pesan jasa angkut untuk penjemputan dan pengiriman segera
                    atau di Hari+1.
                  </p>
                </div>

                {/* Terjadwal Card - Inactive */}
                <div
                  className={cn(
                    "flex h-[136px] w-[385px] cursor-pointer flex-col items-center justify-center gap-y-3 rounded-xl border p-6 hover:border-[#FFC217]",
                    orderType === "terjadwal"
                      ? "border-[#FFC217] bg-[#FFF5C6]"
                      : "border-neutral-400 bg-white"
                  )}
                  onClick={() => setOrderType("terjadwal")}
                >
                  <div className="relative h-8 w-8">
                    <Image
                      src="/icons/muattrans-terjadwal32.svg"
                      alt="Terjadwal"
                      width={32}
                      height={32}
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-black">
                    Terjadwal
                  </h3>
                  <p className="max-w-[294px] text-center text-xs font-medium text-neutral-600">
                    Pesan jasa angkut untuk penjemputan dan pengiriman di Hari+2
                    sampai dengan Hari+30.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-6">
                {/* Waktu Muat */}
                <div className="flex flex-col gap-y-3.5">
                  <div className="flex gap-x-8">
                    <FormLabel title="Waktu Muat" required />
                    <div className="flex flex-col gap-y-3.5">
                      <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-2">
                          <DatetimePicker
                            datetimeValue={formValues.startDate}
                            onApply={(date) => handleDateChange("start", date)}
                            placeholder="Pilih Tanggal & Waktu Muat"
                            status={formErrors.startDate ? "error" : null}
                            className="w-[271px]"
                            minDate={getNowTimezone(timezone)}
                          />
                          {formValues.showRangeOption ? (
                            <>
                              <span className="text-[12px] font-medium leading-[14.4px]">
                                s/d
                              </span>
                              <DatetimePicker
                                datetimeValue={formValues.endDate}
                                onApply={(date) =>
                                  handleDateChange("end", date)
                                }
                                placeholder="Pilih Tanggal & Waktu Muat"
                                disabled={!formValues.startDate}
                                status={formErrors.endDate ? "error" : null}
                                className="w-[271px]"
                                minDate={getNowTimezone(timezone)}
                              />
                            </>
                          ) : null}
                        </div>
                        {formErrors.startDate || formErrors.endDate ? (
                          <div className="flex items-center gap-x-[34px] text-[12px] font-medium leading-[14.4px] text-error-400">
                            <div className="w-[271px]">
                              {formErrors.startDate}
                            </div>
                            <div className="w-[271px]">
                              {formErrors.endDate}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-x-8">
                    <div className="w-[174px]" />
                    <div className="flex flex-row items-center gap-x-1">
                      <Checkbox
                        label="Dengan Rentang Waktu"
                        value="rentang_waktu"
                        checked={formValues.showRangeOption}
                        onChange={(e) => setField("showRangeOption", e.checked)}
                      />
                      <InfoTooltip content="Jika kamu memilih opsi ini, kamu dapat menentukan pukul mulai dan pukul akhir untuk penjemputan muatan.">
                        <IconComponent
                          src="/icons/info16.svg"
                          width={16}
                          height={16}
                        />
                      </InfoTooltip>
                    </div>
                  </div>
                </div>

                {/* Lokasi Muat */}
                <div className="flex gap-8">
                  <label className="flex w-[174px] items-center text-xs font-medium text-neutral-600">
                    Lokasi Muat*
                  </label>
                  <TimelineField
                    variant="muat"
                    className="flex-1"
                    values={
                      formValues.lokasiMuat?.map(
                        (item) => item?.dataLokasi?.location || null
                      ) || []
                    }
                    onAddLocation={() => addLokasi("lokasiMuat", null)}
                    onDeleteLocation={(index) =>
                      removeLokasi("lokasiMuat", index)
                    }
                    onEditLocation={(index) => {
                      handleOpenModalLocation({
                        formMode: "muat",
                        allSelectedLocations: formValues.lokasiMuat,
                        defaultValues: formValues.lokasiMuat[index],
                        index,
                      });
                    }}
                  />
                </div>

                {/* Lokasi Bongkar */}
                <div className="flex gap-8">
                  <label className="flex w-[174px] items-center text-xs font-medium text-neutral-600">
                    Lokasi Bongkar*
                  </label>
                  <TimelineField
                    variant="bongkar"
                    className="flex-1"
                    values={
                      formValues.lokasiBongkar?.map(
                        (item) => item?.dataLokasi?.location || null
                      ) || []
                    }
                    onAddLocation={() => addLokasi("lokasiBongkar", null)}
                    onDeleteLocation={(index) =>
                      removeLokasi("lokasiBongkar", index)
                    }
                    onEditLocation={(index) => {
                      handleOpenModalLocation({
                        formMode: "bongkar",
                        allSelectedLocations: formValues.lokasiBongkar,
                        defaultValues: formValues.lokasiBongkar[index],
                        index,
                      });
                    }}
                  />
                </div>

                {/* Tipe Muatan */}
                <div className="flex gap-8">
                  <div className="flex w-[174px] items-center gap-1">
                    <span className="text-xs font-medium text-neutral-600">
                      Tipe Muatan*
                    </span>
                    <IconComponent
                      src="/icons/info-circle.svg"
                      width={16}
                      height={16}
                    />
                  </div>
                  <div className="flex flex-1 flex-wrap gap-3">
                    <>
                      <div className="w-[250px]">
                        <RadioButton
                          name="tipeMuatan"
                          label="Bahan Mentah"
                          checked={formValues.tipeMuatan === "bahan-mentah"}
                          onClick={() => setField("tipeMuatan", "bahan-mentah")}
                          value="bahan-mentah"
                        />
                      </div>
                      <div className="w-[250px]">
                        <RadioButton
                          name="tipeMuatan"
                          label="Barang Jadi"
                          checked={formValues.tipeMuatan === "barang-jadi"}
                          onClick={() => setField("tipeMuatan", "barang-jadi")}
                          value="barang-jadi"
                        />
                      </div>
                      <div className="w-[250px]">
                        <RadioButton
                          name="tipeMuatan"
                          label="Barang Setengah Jadi"
                          checked={
                            formValues.tipeMuatan === "barang-setengah-jadi"
                          }
                          onClick={() =>
                            setField("tipeMuatan", "barang-setengah-jadi")
                          }
                          value="barang-setengah-jadi"
                        />
                      </div>
                      <div className="w-[250px]">
                        <RadioButton
                          name="tipeMuatan"
                          label="Lainnya"
                          checked={formValues.tipeMuatan === "lainnya"}
                          onClick={() => setField("tipeMuatan", "lainnya")}
                          value="lainnya"
                        />
                      </div>
                    </>
                    {/* {loadingCargoTypes ? (
                      <div className="flex w-full items-center justify-center">
                        <span>Memuat data...</span>
                      </div>
                    ) : (
                      cargoTypes.map((type) => (
                        <div className="w-[250px]" key={type.id}>
                          <RadioButton
                            name="tipeMuatan"
                            label={type.name}
                            checked={tipeMuatan === type.id}
                            onClick={() => setTipeMuatan(type.id)}
                            value={type.id}
                          />
                        </div>
                      ))
                    )} */}
                  </div>
                </div>

                {/* Jenis Muatan */}
                <div className="flex gap-8">
                  <div className="flex w-[174px] items-center gap-1">
                    <span className="text-xs font-medium text-neutral-600">
                      Jenis Muatan*
                    </span>
                    <IconComponent
                      src="/icons/info-circle.svg"
                      width={16}
                      height={16}
                    />
                  </div>
                  <div className="flex flex-1 flex-wrap gap-3">
                    {false ? (
                      [].map((category) => (
                        <div className="w-[250px]" key={category.id}>
                          <RadioButton
                            name="jenisMuatan"
                            label={category.name}
                            checked={formValues.jenisMuatan === category.id}
                            onClick={() => setField("jenisMuatan", category.id)}
                            value={category.id}
                          />
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="w-[250px]">
                          <RadioButton
                            name="jenisMuatan"
                            label="Padat"
                            checked={formValues.jenisMuatan === "padat"}
                            onClick={() => setField("jenisMuatan", "padat")}
                            value="padat"
                          />
                        </div>
                        <div className="w-[250px]">
                          <RadioButton
                            name="jenisMuatan"
                            label="Cair"
                            checked={formValues.jenisMuatan === "cair"}
                            onClick={() => setField("jenisMuatan", "cair")}
                            value="cair"
                          />
                        </div>
                        <div className="w-[250px]">
                          <RadioButton
                            name="jenisMuatan"
                            label="Curah"
                            checked={formValues.jenisMuatan === "curah"}
                            onClick={() => setField("jenisMuatan", "curah")}
                            value="curah"
                          />
                        </div>
                        <div className="w-[250px]">
                          <RadioButton
                            name="jenisMuatan"
                            label="Kendaraan"
                            checked={formValues.jenisMuatan === "kendaraan"}
                            onClick={() => setField("jenisMuatan", "kendaraan")}
                            value="kendaraan"
                          />
                        </div>
                        <div className="w-[250px]">
                          <RadioButton
                            name="jenisMuatan"
                            label="Container"
                            checked={formValues.jenisMuatan === "container"}
                            onClick={() => setField("jenisMuatan", "container")}
                            value="container"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Informasi Muatan */}
                <div className="flex gap-8">
                  <label className="flex w-[174px] items-center text-xs font-medium text-neutral-600">
                    Informasi Muatan*
                  </label>
                  {informasiMuatan.length > 0 ? (
                    <InformasiMuatanTable
                      informasiMuatan={informasiMuatan}
                      onClickUpdate={() => setIsInformasiMuatanModalOpen(true)}
                    />
                  ) : (
                    <div
                      className="flex h-8 flex-1 cursor-pointer items-center rounded-md border border-neutral-600 bg-neutral-200 px-3"
                      onClick={() => setIsInformasiMuatanModalOpen(true)}
                    >
                      <IconComponent
                        src="/icons/lock.svg"
                        width={16}
                        height={16}
                      />
                      <span className="ml-2 text-xs font-medium text-neutral-600">
                        Isi informasi ini setelah mengisi jenis armada
                      </span>
                    </div>
                  )}
                </div>

                {/* Lampiran/Foto Muatan */}
                <div className="flex gap-8">
                  <label className="flex w-[174px] items-center text-xs font-medium text-neutral-600">
                    Lampiran/Foto Muatan*
                  </label>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-4">
                      {[...Array(4)].map((_, key) => (
                        <Fragment key={key}>
                          <ImageUploader
                            getImage={(value) => handleImageUpload(key, value)}
                            uploadText={
                              key === 0 ? "Foto Utama" : `Foto ${key + 1}`
                            }
                            maxSize={10}
                            className="!size-[124px]"
                            value={formValues.fotoMuatan[key]}
                            isNull={formErrors.fotoMuatan}
                          />
                        </Fragment>
                      ))}
                      <p className="w-full text-xs font-medium text-neutral-600">
                        Maksimal unggah 4 foto muatan dengan format
                        .jpg/.jpeg/.png, besar file maks. 10MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Deskripsi Muatan */}
                <div className="flex gap-8">
                  <FormLabel title="Deskripsi Muatan" required />
                  <div className="flex flex-1 flex-col gap-2">
                    <TextArea
                      maxLength={500}
                      hasCharCount
                      supportiveText={{
                        title: formErrors.deskripsi,
                      }}
                      resize="none"
                      placeholder={
                        "Lengkapi deskripsi informasi muatan Anda dengan rincian spesifik terkait barang yang dikirim, seperti bahan, penggunaan, atau karakteristik unik lainnya."
                      }
                      value={formValues.deskripsi}
                      onChange={(e) => setField("deskripsi", e.target.value)}
                      status={formErrors.deskripsi ? "error" : ""}
                    />
                  </div>
                </div>

                {/* Jenis Armada */}
                <div className="flex gap-8">
                  <label className="flex w-[174px] items-center text-[12px] font-medium leading-[14.4px] text-neutral-600">
                    Jenis Armada*
                  </label>
                  <div className="flex flex-1 flex-col gap-y-3.5">
                    <div className="flex items-center gap-x-3.5">
                      <button
                        className="flex h-8 w-full items-center gap-x-2 rounded-md border border-neutral-600 px-3"
                        onClick={() => {
                          setIsArmadaPopupOpen(true);
                          setType("carrier");
                        }}
                      >
                        <IconComponent
                          src="/icons/carrier16.svg"
                          width={16}
                          height={16}
                        />
                        <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                          {formValues.jenisCarrier?.title ||
                            "Pilih Jenis Carrier"}
                        </span>
                        <IconComponent
                          src="/icons/chevron-right.svg"
                          width={16}
                          height={16}
                          className="ml-auto"
                        />
                      </button>
                      <button
                        className={`flex h-8 w-full items-center gap-x-2 rounded-md border border-neutral-600 px-3 ${formValues.jenisCarrier ? "bg-neutral-50" : "cursor-not-allowed bg-neutral-200"}`}
                        disabled={!formValues.jenisCarrier}
                        onClick={() => {
                          setIsArmadaPopupOpen(true);
                          setType("truck");
                        }}
                      >
                        <IconComponent
                          src="/icons/truck16.svg"
                          width={16}
                          height={16}
                        />
                        <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                          {formValues.jenisTruk?.title || "Pilih Jenis Truck"}
                        </span>
                        <IconComponent
                          src="/icons/chevron-right.svg"
                          width={16}
                          height={16}
                          className="ml-auto"
                        />
                      </button>
                    </div>
                    {formValues.jenisTruk ? (
                      <SelectedTruck
                        {...formValues.jenisTruk}
                        onSelectImage={handleSelectImage}
                      />
                    ) : null}
                  </div>
                </div>

                {/* Asuransi Barang */}
                {/* <div className="flex gap-8">
                  <FormLabel title="Asuransi Barang" />
                  <div
                    className="flex h-[32px] flex-1 cursor-pointer items-center justify-between rounded-md border border-neutral-600 bg-white px-3"
                    onClick={() => setIsAsuransiModalOpen(true)}
                  >
                    <div className="flex items-center gap-x-2">
                      <IconComponent
                        src="/icons/shield20.svg"
                        width={20}
                        height={20}
                      />
                      <span className="text-[12px] font-medium leading-[12px] text-neutral-900">
                        Gratis perlindungan hingga Rp10.000.000
                      </span>
                    </div>
                    <IconComponent
                      src="/icons/chevron-right.svg"
                      width={16}
                      height={16}
                      className="icon-gray"
                    />
                  </div>
                </div> */}

                {/* Layanan Tambahan */}
                <div className="flex h-[44px] w-[782px] flex-row items-start gap-[32px]">
                  {/* Label Bagian */}
                  <FormLabel size="small" title="Layanan Tambahan" />

                  {/* Container Opsi Layanan */}
                  <div className="flex-grow-1 flex h-[44px] w-[576px] flex-col gap-[12px]">
                    {/* Opsi Layanan 1 - Kirim Bukti Fisik */}
                    <div className="flex h-[16px] w-full flex-row items-center justify-between gap-[4px]">
                      {/* Container Checkbox dan Label */}
                      <div className="flex h-[16px] flex-row items-center gap-[4px]">
                        <Checkbox
                          onChange={(e) =>
                            setField("kirimBuktiFisik", e.checked)
                          }
                          label="Kirim Bukti Fisik Penerimaan Barang"
                          checked={formValues.kirimBuktiFisik}
                          value="kirim_bukti_fisik"
                        />
                        <IconComponent
                          src="/icons/info16.svg"
                          width={16}
                          height={16}
                        />
                      </div>

                      {/* Harga Opsi 1 */}
                      <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                        Rp-
                      </span>
                    </div>

                    {/* Opsi Layanan 2 - Bantuan Tambahan */}
                    <div className="flex h-[16px] w-full flex-row items-center justify-between gap-[4px]">
                      {/* Container Checkbox dan Label */}
                      <div className="flex h-[16px] flex-row items-center gap-[4px]">
                        <Checkbox
                          onChange={(e) =>
                            setField("bantuanTambahan", e.checked)
                          }
                          label="Bantuan Tambahan"
                          checked={formValues.bantuanTambahan}
                          value="bantuan_tambahan"
                        />
                        <IconComponent
                          src="/icons/info16.svg"
                          width={16}
                          height={16}
                        />
                      </div>

                      {/* Harga Opsi 2 */}
                      <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                        Rp105.000
                      </span>
                    </div>
                  </div>
                </div>

                {/* No. Delivery Order */}
                <div className="flex gap-8">
                  <label className="flex w-[174px] items-center pt-2 text-xs font-medium text-neutral-600">
                    No. Delivery Order (DO) (Opsional)
                  </label>
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Masukkan No. Delivery Order (DO)"
                      onChange={(e) => setField("noDO", e.target.value)}
                      value={formValues.noDO}
                    />
                  </div>
                </div>

                {/* Tipe Pemesan */}
                <div className="flex gap-8">
                  <label className="flex w-[174px] items-center text-xs font-medium text-neutral-600">
                    Tipe Pemesan (Opsional)
                  </label>
                  <div className="flex h-[16px] flex-row items-center gap-[4px]">
                    <Checkbox
                      onChange={(e) => setField("isCompany", e.checked)}
                      label="Centang jika kamu adalah suatu perusahaan/badan usaha"
                      checked={formValues.isCompany}
                      value="is_company"
                    />
                    <IconComponent
                      src="/icons/info16.svg"
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Summary Panel */}
            <Card className="flex w-[338px] flex-col gap-6 rounded-xl border-none bg-white p-5 py-6 shadow-md">
              <h3 className="text-base font-bold text-black">
                Ringkasan Transaksi
              </h3>

              <div className="flex h-10 items-center gap-2 rounded-md border border-primary-700 bg-primary-50 px-3">
                <div className="relative h-6 w-6">
                  <Image
                    src="/icons/voucher24.svg"
                    alt="Voucher"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs font-medium text-black">
                  Makin hemat pakai voucher
                </span>
                <IconComponent
                  src="/icons/chevron-right.svg"
                  width={16}
                  height={16}
                  className="ml-auto"
                />
              </div>

              <div className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-black">
                      Total
                    </span>
                    <span className="text-base font-bold text-black">
                      Rp{formValues.bantuanTambahan ? "105.000" : "0"}
                    </span>
                  </div>
                </div>
                <Button
                  color="primary"
                  onClick={handleValidateFleetOrder}
                  type="muatparts"
                >
                  Lanjut Pembayaran
                </Button>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Floating Button */}
      <FloatingButton />

      <FleetOrderConfirmationModal
        isOpen={isModalConfirmationOpen}
        setIsOpen={setIsModalConfirmationOpen}
        onOrderFleet={handleOrderFleet}
      />

      <FilterModal
        data={armadaData[type] || armadaData.carrier}
        isOpen={isArmadaPopupOpen}
        setIsOpen={setIsArmadaPopupOpen}
        onSelectArmada={handleSelectArmada}
        type={type}
      />

      <TruckImageModal
        isOpen={isTruckImageModalOpen}
        setIsOpen={setIsTruckImageModalOpen}
        src={selectedImageSrc}
      />

      <LocationModalFormWeb
        {...modalConfig}
        onOpenChange={handleCloseModalLocation}
      />

      <InformasiMuatanModal
        open={isInformasiMuatanModalOpen}
        onOpenChange={setIsInformasiMuatanModalOpen}
        maxInformasiMuatan={5}
        onSaveInformasiMuatan={handleSaveInformasiMuatan}
        defaultValues={informasiMuatan}
      />
    </main>
  );
}
