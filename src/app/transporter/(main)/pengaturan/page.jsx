"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { XCircle } from "lucide-react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import PageTitle from "@/components/PageTitle/PageTitle";

export default function Page() {
  const router = useRouter();

  // Form state to track if any data has been filled
  const [formData, setFormData] = useState({
    areaMuat: "",
    areaBongkar: "",
    muatanDilayani: "",
    halalLogistik: false,
  });

  // Modal state
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);

  // Check if any form data has been filled
  const hasFormData = Object.values(formData).some(
    (value) => value !== "" && value !== false
  );

  // Handle back navigation
  const handleBack = () => {
    if (hasFormData) {
      setIsBackModalOpen(true);
    } else {
      router.back();
    }
  };

  // Handle form data changes
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
                    onClick={() => handleFormChange("areaMuat", "filled")}
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
                    onClick={() => handleFormChange("areaBongkar", "filled")}
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
                    muatan yang sesuai
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <Button
                    variant="muattrans-primary"
                    onClick={() => handleFormChange("muatanDilayani", "filled")}
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
                  <h3 className="mb-2 text-lg font-semibold text-neutral-900">
                    Layanan Halal Logistik
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Tentukan area kerja kamu agar pekerjaanmu menjadi lebih
                    efektif dan efisien. muatrans hanya menawarkan permintaan
                    muat dengan lokasi pick up didalam area kerjamu
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <Button
                    variant="muattrans-primary"
                    onClick={() => handleFormChange("halalLogistik", true)}
                  >
                    Daftar Halal Logistik
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
