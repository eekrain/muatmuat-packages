"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { XCircle } from "lucide-react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ProvinceSelectionModal,
} from "@/components/Modal";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useGetMasterProvinces } from "@/services/Transporter/pengaturan/getDataAreaMuat";

export default function Page() {
  const router = useRouter();

  // Modal state
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [isAreaMuatModalOpen, setIsAreaMuatModalOpen] = useState(false);
  const [isAreaBongkarModalOpen, setIsAreaBongkarModalOpen] = useState(false);
  const [searchProvince, setSearchProvince] = useState("");

  // Fetch provinces data with search
  const { provinces, isLoading } = useGetMasterProvinces({
    q: searchProvince,
    excludeExisting: false,
  });

  // Handle search provinces
  const handleSearchProvinces = (searchTerm) => {
    setSearchProvince(searchTerm);
  };

  // Handle save provinces dengan context
  const handleSaveProvinces = (
    selectedProvincesData,
    selectedProvinceIds,
    context
  ) => {
    if (context === "area-muat") {
      // Save logic untuk Area Muat
      console.log("Saving Area Muat provinces:", selectedProvincesData);
      console.log("Area Muat province IDs:", selectedProvinceIds);
      // TODO: Call API untuk save area muat
      // await saveAreaMuat(selectedProvinceIds);
    } else if (context === "area-bongkar") {
      // Save logic untuk Area Bongkar
      console.log("Saving Area Bongkar provinces:", selectedProvincesData);
      console.log("Area Bongkar province IDs:", selectedProvinceIds);
      // TODO: Call API untuk save area bongkar
      // await saveAreaBongkar(selectedProvinceIds);
    }
  };

  return (
    <>
      <div className="mx-auto py-6">
        <PageTitle className="mb-6">Pengaturan</PageTitle>

        <Card className="!border-none">
          <CardContent className="p-0">
            {/* Area Muat Section */}
            <div className="border-b border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Area Muat
                    </h3>
                    <BadgeStatus variant="error" className="w-auto">
                      <XCircle size={16} className="mr-2" />
                      Belum Ada Data
                    </BadgeStatus>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Tentukan area kerja kamu agar pekerjaanmu menjadi lebih
                    efektif dan efisien. muatrans hanya menawarkan permintaan
                    jasa angkut dengan lokasi pick up didalam area kerjamu
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <Button
                    variant="muattrans-primary"
                    onClick={() => setIsAreaMuatModalOpen(true)}
                  >
                    Tambah Area Muat
                  </Button>
                </div>
              </div>
            </div>

            {/* Area Bongkar Section */}
            <div className="border-b border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Area Bongkar
                    </h3>
                    <BadgeStatus variant="error" className="w-auto">
                      <XCircle size={16} className="mr-2" />
                      Belum Ada Data
                    </BadgeStatus>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Tentukan area kerja kamu agar pekerjaanmu menjadi lebih
                    efektif dan efisien. muatrans hanya menawarkan permintaan
                    jasa angkut dengan lokasi bongkar didalam area kerjamu
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <Button
                    variant="muattrans-primary"
                    onClick={() => setIsAreaBongkarModalOpen(true)}
                  >
                    Tambah Area Bongkar
                  </Button>
                </div>
              </div>
            </div>

            {/* Muatan Yang Dilayani Section */}
            <div className="border-b border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Muatan Yang Dilayani
                    </h3>
                    <BadgeStatus variant="error" className="w-auto">
                      <XCircle size={16} className="mr-2" />
                      Belum Ada Data
                    </BadgeStatus>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Atur muatan yang kamu layani sekarang untuk mendapatkan
                    muatan yang sesuai dengan kapasitas armada kamu
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <Button
                    variant="muattrans-primary"
                    onClick={() => router.push("/pengaturan/muatan-dilayani")}
                  >
                    Tambah Muatan Dilayani
                  </Button>
                </div>
              </div>
            </div>

            {/* Layanan Halal Logistik Section */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Layanan Halal Logistik
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Tentukan area kerja kamu agar pekerjaanmu menjadi lebih
                    efektif dan efisien. muatrans hanya menawarkan permintaan
                    muat dengan lokasi pick up didalam area kerjamu
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <Button
                    variant="muattrans-primary"
                    onClick={() => router.push("/pengaturan/halal-logistik")}
                  >
                    Daftar Halal Logistik
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Area Muat Province Selection Modal */}
      <ProvinceSelectionModal
        isOpen={isAreaMuatModalOpen}
        onClose={() => setIsAreaMuatModalOpen(false)}
        onSave={handleSaveProvinces}
        title="Pilih Provinsi Area Muat"
        provinces={provinces}
        isLoading={isLoading}
        onSearch={handleSearchProvinces}
        saveContext="area-muat"
      />

      {/* Area Bongkar Province Selection Modal */}
      <ProvinceSelectionModal
        isOpen={isAreaBongkarModalOpen}
        onClose={() => setIsAreaBongkarModalOpen(false)}
        onSave={handleSaveProvinces}
        title="Pilih Provinsi Area Bongkar"
        provinces={provinces}
        isLoading={isLoading}
        onSearch={handleSearchProvinces}
        saveContext="area-bongkar"
      />

      {/* Back Confirmation Modal */}
      <Modal open={isBackModalOpen} onOpenChange={setIsBackModalOpen}>
        <ModalContent type="muatmuat" className="w-[496px]">
          <ModalHeader type="muatmuat" size="small" />
          <div className="flex flex-col items-center gap-y-6 px-6 py-9">
            <p className="text-center text-base font-medium leading-[22.4px] text-neutral-900">
              Apakah Anda yakin ingin keluar? Data yang sudah diisi akan hilang.
            </p>
            <div className="flex items-center gap-x-2">
              <Button
                variant="muattrans-primary-secondary"
                className="h-[44px] w-[120px] text-base"
                onClick={() => {
                  setIsBackModalOpen(false);
                  router.back();
                }}
              >
                Ya
              </Button>
              <Button
                variant="muattrans-primary"
                className="h-[44px] w-[120px] text-base"
                onClick={() => setIsBackModalOpen(false)}
              >
                Tidak
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
