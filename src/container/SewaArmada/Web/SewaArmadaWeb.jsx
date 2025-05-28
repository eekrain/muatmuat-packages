"use client";

import Image from "next/image";
import { Fragment, useEffect, useState } from "react";

import Card from "@/components/Card/Card";
import Checkbox from "@/components/Checkbox/Checkbox";
import FloatingButton from "@/components/FloatingButton/FloatingButton";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import Input from "@/components/Input/Input";
import RadioButton from "@/components/Radio/RadioButton";
// import SWRHandler from "@/services/useSWRHook";
import { useSewaArmadaStore } from "@/store/sewaArmada";
import toast from "@/store/toast";

import BannerCarousel from "./BannerCarousel/BannerCarousel";
import FirstTimer from "./FirstTimer/FirstTimer";
import WelcomeCard from "./WelcomeCard/WelcomeCard";

export default function SewaArmadaWeb() {
  // API Base URL
  const baseUrl = process.env.NEXT_PUBLIC_GLOBAL_API || "";

  // SWR Hooks
  // const { useSWRHook, useSWRMutateHook } = SWRHandler;
  const { setShowToast, setDataToast } = toast();
  const [openControlled, setOpenControlled] = useState(false);

  // Menggunakan state dari zustand
  const {
    rentalType,
    setRentalType,
    waktuMuat,
    setWaktuMuat,
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
  } = useSewaArmadaStore();

  // State untuk carousel
  const [isAsuransiModalOpen, setIsAsuransiModalOpen] = useState(false);
  const [isInformasiMuatanModalOpen, setIsInformasiMuatanModalOpen] =
    useState(false);

  // State untuk menyimpan data dari API
  const [cargoTypes, setCargoTypes] = useState([]);
  const [cargoCategories, setCargoCategories] = useState([]);
  const [loadingCargoTypes, setLoadingCargoTypes] = useState(false);

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
  //       setShowToast(true);
  //       setDataToast({
  //         type: "error",
  //         message: "Gagal memuat kategori muatan",
  //       });
  //     }
  //   },
  //   [cargoTypes, setShowToast, setDataToast]
  // );

  // useEffect(() => {
  //   if (tipeMuatan) {
  //     fetchCargoCategories(tipeMuatan);
  //   }
  // }, [tipeMuatan, fetchCargoCategories]);

  // Handler untuk upload foto muatan
  const handleImageUpload = async (index) => async (img) => {
    if (!img) {
      setFotoMuatan(index, null);
      return;
    }
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

  // Clean up zustand state saat unmount
  useEffect(() => {
    return () => {
      // Optional: reset form saat keluar dari halaman
      // useArmadaInstanStore.getState().resetForm();
    };
  }, []);

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
            <Card classname="flex-1 p-8 flex flex-col gap-6 shadow-md border-none">
              {/* Service Type Selection */}
              <div className="flex justify-center gap-3">
                {/* Instan Card - Active */}
                <div
                  className={`h-[136px] w-[385px] ${rentalType === "instan" ? "border-[#FFC217] bg-[#FFF5C6]" : "border-neutral-400 bg-white"} flex cursor-pointer flex-col items-center justify-center gap-y-3 rounded-xl border p-6 hover:border-[#FFC217]`}
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
                  className={`h-[136px] w-[385px] ${rentalType === "terjadwal" ? "border-[#FFC217] bg-[#FFF5C6]" : "border-neutral-400 bg-white"} flex cursor-pointer flex-col items-center justify-center gap-y-3 rounded-xl border p-6 hover:border-[#FFC217]`}
                  onClick={() => setRentalType("terjadwal")}
                >
                  <div className="relative h-8 w-8">
                    <Image
                      src="/icons/muattrans-terjadwal32.svg"
                      alt="Instan"
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
                <div className="flex gap-8">
                  <label className="flex w-[174px] items-center text-xs font-medium text-neutral-600">
                    Waktu Muat*
                  </label>
                  <div className="flex flex-col gap-y-[14px]">
                    <div className="flex flex-row items-center">
                      <Input
                        type="text"
                        placeholder="Pilih Tanggal & Waktu Muat"
                        icon={{ left: "/icons/calendar.svg" }}
                        width={{ width: "271px" }}
                        value={waktuMuat}
                        changeEvent={(e) => setWaktuMuat(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-row items-center gap-x-1">
                      <Checkbox
                        label="Dengan Rentang Waktu"
                        value="rentang_waktu"
                        checked={showRangeOption}
                        onChange={(e) => setShowRangeOption(e.checked)}
                      />
                      <IconComponent
                        src="/icons/info16.svg"
                        width={16}
                        height={16}
                      />
                    </div>
                  </div>
                </div>

                {/* Lokasi Muat */}
                <div className="flex gap-8">
                  <label className="flex w-[174px] items-center text-xs font-medium text-neutral-600">
                    Lokasi Muat*
                  </label>
                  <div className="flex flex-1 flex-col gap-3 rounded-md border border-neutral-600 p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FFC217]">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#461B02]"></div>
                      </div>
                      <span className="text-xs font-medium text-neutral-600">
                        Masukkan Lokasi Muat
                      </span>
                    </div>
                    <div className="h-px w-full bg-neutral-400"></div>
                    <div className="flex items-center justify-center gap-2 text-primary-700">
                      <IconComponent
                        src="/icons/plus-square20.svg"
                        width={20}
                        height={20}
                      />
                      <span className="text-xs font-semibold">
                        Tambah Lokasi Muat
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lokasi Bongkar */}
                <div className="flex gap-8">
                  <label className="flex w-[174px] items-center text-xs font-medium text-neutral-600">
                    Lokasi Bongkar*
                  </label>
                  <div className="flex flex-1 flex-col gap-3 rounded-md border border-neutral-600 p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#461B02]">
                        <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                      </div>
                      <span className="text-xs font-medium text-neutral-600">
                        Masukkan Lokasi Bongkar
                      </span>
                    </div>
                    <div className="h-px w-full bg-neutral-400"></div>
                    <div className="flex items-center justify-center gap-2 text-primary-700">
                      <IconComponent
                        src="/icons/plus-square20.svg"
                        width={20}
                        height={20}
                      />
                      <span className="text-xs font-semibold">
                        Tambah Lokasi Bongkar
                      </span>
                    </div>
                  </div>
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
                    {loadingCargoTypes ? (
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
                    )}
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
                            getImage={handleImageUpload(key)}
                            uploadText={
                              key === 0 ? "Foto Utama" : `Foto ${key + 1}`
                            }
                            isMain={key === 0}
                            maxSize={10}
                            className="!size-[124px]"
                            value={fotoMuatan[0]}
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
                  <label className="flex w-[174px] items-center text-xs font-medium text-neutral-600">
                    Deskripsi Muatan*
                  </label>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="relative h-20 w-full rounded-md border border-neutral-600 p-3">
                      <textarea
                        placeholder="Lengkapi deskripsi informasi muatan Anda dengan rincian spesifik terkait barang yang dikirim, seperti bahan, penggunaan, atau karakteristik unik lainnya."
                        className="h-full w-full resize-none text-xs font-medium text-black outline-none"
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                      ></textarea>
                      <span className="absolute bottom-1 right-3 text-xs font-medium text-neutral-600">
                        {deskripsi?.length || 0}/500
                      </span>
                    </div>
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
                        classname="ml-auto"
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
                        classname="ml-auto"
                      />
                    </div>
                  </div>
                </div>

                {/* Asuransi Barang */}
                <div className="flex gap-8">
                  <label className="flex w-[174px] items-center text-xs font-medium text-neutral-600">
                    Asuransi Barang (Opsional)
                  </label>
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
                      classname="icon-gray"
                    />
                  </div>
                </div>

                {/* Layanan Tambahan */}
                <div className="flex h-[44px] w-[782px] flex-row items-start gap-[32px]">
                  {/* Label Bagian */}
                  <div className="flex h-[16px] w-[174px] items-center text-[12px] font-medium leading-[14.4px] text-neutral-600">
                    Layanan Tambahan (Opsional)
                  </div>

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
            <Card classname="w-[338px] bg-white p-5 flex flex-col gap-6 rounded-xl shadow-md py-6 border-none">
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
                  classname="ml-auto"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-black">Total</span>
                <span className="text-base font-bold text-black">
                  Rp{bantuanTambahan ? "105.000" : "0"}
                </span>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Floating Button */}
      <FloatingButton />
    </main>
  );
}
