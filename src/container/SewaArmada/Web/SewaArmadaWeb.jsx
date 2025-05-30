"use client";

import Image from "next/image";
import { Fragment, useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import Checkbox from "@/components/Checkbox/Checkbox";
import DatetimePicker from "@/components/DatetimePicker/DatetimePicker";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import Input from "@/components/Input/Input";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import RadioButton from "@/components/Radio/RadioButton";
import TextArea from "@/components/TextArea/TextArea";
import { TimelineField } from "@/components/Timeline/timeline-field";
import Tooltip from "@/components/Tooltip/Tooltip";
import { fakeAddress } from "@/container/Example/Web/mockdata";
import { cn } from "@/lib/cn";
// import SWRHandler from "@/services/useSWRHook";
import { useSewaArmadaStore } from "@/store/forms/sewaArmadaStore";
import { getNowTimezone } from "@/utils/dateTime";

import BannerCarousel from "./BannerCarousel/BannerCarousel";
import FirstTimer from "./FirstTimer/FirstTimer";
import WelcomeCard from "./WelcomeCard/WelcomeCard";

const FormLabel = ({ size = "big", title, required = false }) => (
  <div className={`flex items-center ${size === "big" ? "h-8" : "h-4"}`}>
    <label className="w-[174px] text-[12px] font-medium leading-[14.4px] text-neutral-600">
      {`${title}${required ? "*" : " (Opsional)"}`}
    </label>
  </div>
);

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
  // API Base URL
  const baseUrl = process.env.NEXT_PUBLIC_GLOBAL_API || "";

  // SWR Hooks
  // const { useSWRHook, useSWRMutateHook } = SWRHandler;
  const [openControlled, setOpenControlled] = useState(false);
  const [isModalConfirmationOpen, setIsModalConfirmationOpen] = useState(false);

  // Menggunakan state dari zustand
  const {
    rentalType,
    setRentalType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    // waktuMuat,
    // setWaktuMuat,
    showRangeOption,
    setShowRangeOption,
    lokasi,
    setLokasiMuat,
    setLokasiBongkar,
    tipeMuatan,
    setTipeMuatan,
    jenisMuatan,
    setJenisMuatan,
    deskripsi,
    setDeskripsi,
    useAsuransi,
    setUseAsuransi,
    kirimBuktiFisik,
    setKirimBuktiFisik,
    bantuanTambahan,
    setBantuanTambahan,
    isCompany,
    setIsCompany,
    noDO,
    setNoDO,
    fotoMuatan,
    setFotoMuatan,
    errors,
    validateForm,
  } = useSewaArmadaStore();

  const [timezone, setTimezone] = useState({
    id: "Asia/Jakarta",
    offset: "+07:00",
  });

  // State untuk carousel
  const [isAsuransiModalOpen, setIsAsuransiModalOpen] = useState(false);
  const [isInformasiMuatanModalOpen, setIsInformasiMuatanModalOpen] =
    useState(false);

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
  const [muatValues, setMuatValues] = useState([]);

  const handleAddMuatLocation = () => {
    setMuatValues([
      ...muatValues,
      fakeAddress[Math.floor(Math.random() * fakeAddress.length)],
    ]);
  };

  const handleDeleteMuatLocation = (index) => {
    setMuatValues(muatValues.filter((_, i) => i !== index));
  };

  const [bongkarValues, setBongkarValues] = useState([]);

  const handleAddBongkarLocation = () => {
    setBongkarValues([
      ...bongkarValues,
      fakeAddress[Math.floor(Math.random() * fakeAddress.length)],
    ]);
  };

  const handleDeleteBongkarLocation = (index) => {
    setBongkarValues(bongkarValues.filter((_, i) => i !== index));
  };

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

    if (field === "start") {
      setStartDate(newDate);
    } else {
      setEndDate(newDate);
    }
  };

  // Handler untuk upload foto muatan
  const handleImageUpload = (index, img) => setFotoMuatan(index, img);

  const handleOrderFleet = () => {
    const isValidForm = validateForm();
    if (isValidForm) {
      setIsModalConfirmationOpen(true);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 bg-neutral-50 px-10 py-8">
      {/* Carousel Banner */}
      <BannerCarousel banners={banners} />

      {/* Main Content */}
      {rentalType === "" ? (
        <FirstTimer setRentalType={setRentalType} />
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
                    rentalType === "instan"
                      ? "border-[#FFC217] bg-[#FFF5C6]"
                      : "border-neutral-400 bg-white"
                  )}
                  onClick={() => setRentalType("instan")}
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
                    rentalType === "terjadwal"
                      ? "border-[#FFC217] bg-[#FFF5C6]"
                      : "border-neutral-400 bg-white"
                  )}
                  onClick={() => setRentalType("terjadwal")}
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
                    <div className="flex flex-col gap-y-[14px]">
                      <div className="flex items-center gap-x-2">
                        <DatetimePicker
                          datetimeValue={startDate}
                          onApply={(date) => {
                            handleDateChange("start", date);
                          }}
                          placeholder="Pilih Tanggal & Waktu Muat"
                          // disabled={mode === "edit" && promoStatus === "Aktif"}
                          // status={errors.startDate ? "error" : null}
                          className="w-[271px]"
                          minDate={getNowTimezone(timezone)}
                        />
                        {showRangeOption ? (
                          <>
                            <span className="text-[12px] font-medium leading-[14.4px]">
                              s/d
                            </span>
                            <DatetimePicker
                              datetimeValue={endDate}
                              onApply={(date) => {
                                handleDateChange("end", date);
                              }}
                              placeholder="Pilih Tanggal & Waktu Muat"
                              disabled={!startDate}
                              // status={errors.startDate ? "error" : null}
                              className="w-[271px]"
                              minDate={getNowTimezone(timezone)}
                            />
                          </>
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
                        checked={showRangeOption}
                        onChange={(e) => setShowRangeOption(e.checked)}
                      />
                      <Tooltip
                        classname="!-ml-4 text-[14px] leading-[16.8px]"
                        text="Jika kamu memilih opsi ini, kamu dapat menentukan pukul mulai dan pukul akhir untuk penjemputan muatan. "
                        position="top"
                      >
                        <IconComponent
                          src="/icons/info16.svg"
                          width={16}
                          height={16}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>

                {/* Lokasi Muat */}
                <div className="flex gap-8">
                  <label className="flex w-[174px] items-center text-xs font-medium text-neutral-600">
                    Lokasi Muat*
                  </label>

                  <TimelineField
                    className="flex-1"
                    variant="muat"
                    // Only accept array string address
                    // You need to map the value that will be rendered, in case the state is an array of object
                    values={muatValues.map((value) => value.address)}
                    onAddLocation={handleAddMuatLocation}
                    onDeleteLocation={handleDeleteMuatLocation}
                  />
                </div>

                {/* Lokasi Bongkar */}
                <div className="flex gap-8">
                  <label className="flex w-[174px] items-center text-xs font-medium text-neutral-600">
                    Lokasi Bongkar*
                  </label>
                  <TimelineField
                    className="flex-1"
                    variant="bongkar"
                    // Only accept array string address
                    // You need to map the value that will be rendered, in case the state is an array of object
                    values={bongkarValues.map((value) => value.address)}
                    onAddLocation={handleAddBongkarLocation}
                    onDeleteLocation={handleDeleteBongkarLocation}
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
                          name="tipe-muatan"
                          label="Bahan Mentah"
                          checked={tipeMuatan === "bahan-mentah"}
                          onClick={() => setTipeMuatan("bahan-mentah")}
                          value="bahan-mentah"
                        />
                      </div>
                      <div className="w-[250px]">
                        <RadioButton
                          name="tipe-muatan"
                          label="Barang Jadi"
                          checked={tipeMuatan === "barang-jadi"}
                          onClick={() => setTipeMuatan("barang-jadi")}
                          value="barang-jadi"
                        />
                      </div>
                      <div className="w-[250px]">
                        <RadioButton
                          name="tipe-muatan"
                          label="Barang Setengah Jadi"
                          checked={tipeMuatan === "barang-setengah-jadi"}
                          onClick={() => setTipeMuatan("barang-setengah-jadi")}
                          value="barang-setengah-jadi"
                        />
                      </div>
                      <div className="w-[250px]">
                        <RadioButton
                          name="tipe-muatan"
                          label="Lainnya"
                          checked={tipeMuatan === "lainnya"}
                          onClick={() => setTipeMuatan("lainnya")}
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
                            name="tipe-muatan"
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
                            name="jenis-muatan"
                            label={category.name}
                            checked={jenisMuatan === category.id}
                            onClick={() => setJenisMuatan(category.id)}
                            value={category.id}
                          />
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="w-[250px]">
                          <RadioButton
                            name="jenis-muatan"
                            label="Padat"
                            checked={jenisMuatan === "padat"}
                            onClick={() => setJenisMuatan("padat")}
                            value="padat"
                          />
                        </div>
                        <div className="w-[250px]">
                          <RadioButton
                            name="jenis-muatan"
                            label="Cair"
                            checked={jenisMuatan === "cair"}
                            onClick={() => setJenisMuatan("cair")}
                            value="cair"
                          />
                        </div>
                        <div className="w-[250px]">
                          <RadioButton
                            name="jenis-muatan"
                            label="Curah"
                            checked={jenisMuatan === "curah"}
                            onClick={() => setJenisMuatan("curah")}
                            value="curah"
                          />
                        </div>
                        <div className="w-[250px]">
                          <RadioButton
                            name="jenis-muatan"
                            label="Kendaraan"
                            checked={jenisMuatan === "kendaraan"}
                            onClick={() => setJenisMuatan("kendaraan")}
                            value="kendaraan"
                          />
                        </div>
                        <div className="w-[250px]">
                          <RadioButton
                            name="jenis-muatan"
                            label="Container"
                            checked={jenisMuatan === "container"}
                            onClick={() => setJenisMuatan("container")}
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
                            value={fotoMuatan[key]}
                            isNull={errors.fotoMuatan}
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
                        title: errors.deskripsi,
                      }}
                      resize="none"
                      placeholder={
                        "Lengkapi deskripsi informasi muatan Anda dengan rincian spesifik terkait barang yang dikirim, seperti bahan, penggunaan, atau karakteristik unik lainnya."
                      }
                      value={deskripsi}
                      changeEvent={(e) => setDeskripsi(e.target.value)}
                      status={errors.deskripsi ? "error" : ""}
                      // classInput={"!text-[#1b1b1b]"}
                    />
                  </div>
                </div>

                {/* Jenis Armada */}
                <div className="flex gap-8">
                  <label className="flex w-[174px] items-center text-xs font-medium text-neutral-600">
                    Jenis Armada*
                  </label>
                  <div className="flex flex-1 gap-3.5">
                    <div className="flex h-8 flex-1 cursor-pointer items-center rounded-md border border-neutral-600 bg-neutral-200 px-3">
                      <IconComponent
                        src="/icons/truck-icon.svg"
                        width={16}
                        height={16}
                      />
                      <span className="ml-2 text-xs font-medium text-neutral-600">
                        Pilih Jenis Carrier
                      </span>
                      <IconComponent
                        src="/icons/chevron-down.svg"
                        width={16}
                        height={16}
                        className="ml-auto"
                      />
                    </div>
                    <div className="flex h-8 flex-1 cursor-pointer items-center rounded-md border border-neutral-600 bg-neutral-200 px-3">
                      <IconComponent
                        src="/icons/delivery-truck.svg"
                        width={16}
                        height={16}
                      />
                      <span className="ml-2 text-xs font-medium text-neutral-600">
                        Pilih Jenis Truk
                      </span>
                      <IconComponent
                        src="/icons/chevron-down.svg"
                        width={16}
                        height={16}
                        className="ml-auto"
                      />
                    </div>
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
                          onChange={(e) => setKirimBuktiFisik(e.checked)}
                          label="Kirim Bukti Fisik Penerimaan Barang"
                          checked={kirimBuktiFisik}
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
                          onChange={(e) => setBantuanTambahan(e.checked)}
                          label="Bantuan Tambahan"
                          checked={bantuanTambahan}
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
                      changeEvent={(e) => setNoDO(e.target.value)}
                      value={noDO}
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
                      onChange={(e) => setIsCompany(e.checked)}
                      label="Centang jika kamu adalah suatu perusahaan/badan usaha"
                      checked={isCompany}
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
                      Rp{bantuanTambahan ? "105.000" : "0"}
                    </span>
                  </div>
                </div>
                <Button
                  color="primary"
                  onClick={handleOrderFleet}
                  type="muatparts"
                >
                  Lanjut Pembayaran
                </Button>
              </div>
            </Card>
          </div>
          <Modal
            open={isModalConfirmationOpen}
            onOpenChange={setIsModalConfirmationOpen}
            closeOnOutsideClick={false}
          >
            <ModalContent>
              <ModalHeader size="big" />
              <div className="px-6 py-9">
                <div className="flex w-[406px] max-w-[510px] flex-col items-center justify-center gap-6">
                  {/* Judul Modal */}
                  <h2 className="w-full text-center text-[16px] font-bold leading-[19.2px] text-neutral-900">
                    Informasi
                  </h2>

                  {/* Box Peringatan */}
                  <div className="flex w-full flex-row items-center gap-2.5 rounded-md bg-warning-100 p-6">
                    <div className="flex items-center">
                      <IconComponent
                        src="/icons/warning24.svg"
                        height={24}
                        width={24}
                      />
                    </div>
                    <p className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                      Jika ada kendala pada persiapan atau perjalanan ke lokasi
                      muat, pengiriman mungkin tidak bisa dilanjutkan. Kami akan
                      tetap berusaha memberikan solusi terbaik.
                    </p>
                  </div>

                  {/* Text Konfirmasi */}
                  <p className="w-full text-center text-[14px] font-medium leading-[16.8px] text-neutral-900">
                    Apakah kamu yakin data yang kamu isi sudah benar? <br />
                    Pastikan semua informasi telah diperiksa sebelum
                    melanjutkan.
                  </p>

                  {/* Text Syarat dan Ketentuan */}
                  <p className="w-[320px] text-center text-[12px] font-medium leading-[14.4px] text-neutral-900">
                    *Dengan memesan jasa angkut ini, kamu telah menyetujui{" "}
                    {/* <Link href="/syarat-ketentuan"> */}
                    <span className="text-primary-700">
                      Syarat dan Ketentuan Muatrans
                    </span>
                    {/* </Link> */}
                  </p>

                  {/* Container Tombol */}
                  <div className="flex flex-row justify-center gap-2">
                    <Button
                      color="primary_secondary"
                      onClick={() => setIsModalConfirmationOpen(false)}
                      Class="min-w-[132px] h-8"
                      type="muatparts"
                    >
                      Kembali
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => setIsModalConfirmationOpen(false)}
                      Class="min-w-[151px] h-8"
                      type="muatparts"
                    >
                      Pesan Sekarang
                    </Button>
                  </div>
                </div>
              </div>
            </ModalContent>
          </Modal>
        </>
      )}
    </main>
  );
}
