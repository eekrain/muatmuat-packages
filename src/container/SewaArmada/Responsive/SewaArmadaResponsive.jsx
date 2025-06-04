import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Package, Plus, Shield, Truck } from "lucide-react";

import { useSewaArmadaStore } from "@/store/forms/sewaArmadaStore";
import { useResponsiveLayoutActions } from "@/store/responsiveLayout";

import WaktuMuatBottomsheet from "./WaktuMuatBottomsheet";

const FormLabel = ({ title, required = true }) => {
  return (
    <div className="flex items-center gap-x-1 font-bold text-neutral-900">
      <span className="text-[14px] leading-[15.4px]">
        {`${title}${required ? "*" : ""}`}
      </span>
      {!required ? (
        <span className="text-[10px] leading-[10px]">{"(Opsional)"}</span>
      ) : null}
    </div>
  );
};

const SewaArmadaResponsive = () => {
  const router = useRouter();

  const { setDefaultScreen } = useResponsiveLayoutActions();
  const { setOrderType } = useSewaArmadaStore();

  useEffect(() => {
    setDefaultScreen({
      header: {
        onClickBackButton: () => {
          router.back();
        },
        onClickChatButton: () => {
          alert("implement redirect chat");
        },
        onClickNotificationButton: () => {
          alert("implement redirect notification");
        },
        onClickMenuButton: () => {
          alert("implement redirect menu");
        },
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setOrderType("instan");
  }, []);

  const [formData, setFormData] = useState({
    waktuMuat: "",
    lokasiMuat: "",
    lokasiBongkar: "",
    informasiMuatan: "",
    jenisCarrier: "",
    jenisTruk: "",
    layananTambahan: "",
  });

  const [bannerIndex, setBannerIndex] = useState(0);

  return (
    <>
      <div className="mt-[62px] min-h-screen w-full bg-neutral-100">
        {/* Banner Section */}
        <div className="h-[144px] w-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
            <div className="flex h-full items-center justify-center">
              <div className="p-4 text-center text-white">
                <h1 className="mb-2 text-xl font-bold">
                  Cara Mudah Cari Barang
                </h1>
                <p className="text-sm">Daftar dan Mulai Sekarang!</p>
              </div>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="bottom-[10px] left-1/2 flex -translate-x-1/2 transform gap-2">
            <div className="h-2 w-8 rounded-full bg-white"></div>
            <div className="h-2 w-2 rounded-full bg-white opacity-50"></div>
            <div className="h-2 w-2 rounded-full bg-white opacity-50"></div>
          </div>
        </div>

        {/* Brand Section */}
        <div className="flex h-[61px] w-full items-center justify-between bg-gradient-to-r from-neutral-300 via-neutral-200 to-neutral-300 px-4 py-3">
          <div className="flex-1">
            <h2 className="text-[16px] font-semibold leading-[17.6px] text-[#461B02]">
              Ayo kirim muatan kamu dengan muatrans!
            </h2>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex h-4 w-20 items-center justify-center rounded bg-gradient-to-r from-blue-600 to-yellow-500 text-xs font-bold text-white">
              muatrans
            </div>
            <p className="text-right text-[10px] font-semibold leading-[10px] text-[#461B02]">
              Cargo Land Transportation Company
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white px-4 py-5">
          <div className="flex flex-col gap-y-6">
            {/* Waktu Muat Field */}
            <div className="flex flex-col gap-y-4">
              <FormLabel title="Waktu Muat" />
              <WaktuMuatBottomsheet />
            </div>

            {/* Lokasi Muat Field */}
            <div className="space-y-4">
              <label className="block text-[14px] font-semibold leading-[15.4px] text-neutral-900">
                Lokasi Muat*
              </label>
              <div className="w-full space-y-3 rounded-md border border-neutral-600 bg-neutral-50 p-3">
                <div className="flex items-center gap-2">
                  <div className="relative h-4 w-4 rounded-full bg-yellow-400">
                    <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-[#461B02]"></div>
                  </div>
                  <input
                    type="text"
                    placeholder="Masukkan Lokasi Muat"
                    className="flex-1 bg-transparent text-[14px] font-semibold text-neutral-600 outline-none placeholder:text-neutral-600"
                    value={formData.lokasiMuat}
                    onChange={(e) =>
                      setFormData({ ...formData, lokasiMuat: e.target.value })
                    }
                  />
                </div>
                <div className="h-px w-full bg-neutral-400"></div>
                <div className="flex cursor-pointer items-center justify-center gap-2">
                  <Plus className="h-5 w-5 text-primary-700" />
                  <span className="text-[14px] font-semibold text-primary-700">
                    Tambah Lokasi Muat
                  </span>
                </div>
              </div>
            </div>

            {/* Lokasi Bongkar Field */}
            <div className="space-y-4">
              <label className="block text-[14px] font-semibold leading-[15.4px] text-neutral-900">
                Lokasi Bongkar*
              </label>
              <div className="w-full space-y-3 rounded-md border border-neutral-600 bg-neutral-50 p-3">
                <div className="flex items-center gap-2">
                  <div className="relative h-4 w-4 rounded-full bg-[#461B02]">
                    <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white"></div>
                  </div>
                  <input
                    type="text"
                    placeholder="Masukkan Lokasi Bongkar"
                    className="flex-1 bg-transparent text-[14px] font-semibold text-neutral-600 outline-none placeholder:text-neutral-600"
                    value={formData.lokasiBongkar}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lokasiBongkar: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="h-px w-full bg-neutral-400"></div>
                <div className="flex cursor-pointer items-center justify-center gap-2">
                  <Plus className="h-5 w-5 text-primary-700" />
                  <span className="text-[14px] font-semibold text-primary-700">
                    Tambah Lokasi Bongkar
                  </span>
                </div>
              </div>
            </div>

            {/* Informasi Muatan Field */}
            <div className="space-y-4">
              <label className="block text-[14px] font-semibold leading-[15.4px] text-neutral-900">
                Informasi Muatan*
              </label>
              <div className="relative">
                <div className="flex h-8 w-full items-center gap-2 rounded-md border border-neutral-600 bg-neutral-50 px-3 py-2">
                  <Package className="h-4 w-4 text-neutral-700" />
                  <input
                    type="text"
                    placeholder="Masukkan Muatan"
                    className="flex-1 bg-transparent text-[14px] font-semibold text-neutral-600 outline-none placeholder:text-neutral-600"
                    value={formData.informasiMuatan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        informasiMuatan: e.target.value,
                      })
                    }
                  />
                  <svg
                    className="h-4 w-4 text-neutral-700"
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
            </div>

            {/* Jenis Armada Field */}
            <div className="space-y-4">
              <label className="block text-[14px] font-semibold leading-[15.4px] text-neutral-900">
                Jenis Armada*
              </label>
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
            </div>

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
            <div className="space-y-4">
              <div className="flex items-center gap-1">
                <span className="text-[14px] font-semibold leading-[15.4px] text-neutral-900">
                  Layanan Tambahan
                </span>
                <span className="text-[10px] font-semibold text-neutral-900">
                  (Opsional)
                </span>
              </div>
              <div className="flex h-8 w-full items-center gap-2 rounded-md border border-neutral-600 bg-neutral-50 px-3 py-2">
                <Package className="h-4 w-4 text-neutral-700" />
                <span className="flex-1 text-[14px] font-semibold text-neutral-600">
                  Pilih Layanan Tambahan
                </span>
                <svg
                  className="h-4 w-4 text-neutral-700"
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
          </div>
        </div>
      </div>
    </>
  );
};

export default SewaArmadaResponsive;
