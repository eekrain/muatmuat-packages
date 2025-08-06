"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CheckCircle, ChevronDown, XCircle } from "lucide-react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import { TagBubble } from "@/components/Badge/TagBubble";
import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";
import { InputSearch } from "@/components/InputSearch/InputSearch";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ProvinceSelectionModal,
} from "@/components/Modal";
import PageTitle from "@/components/PageTitle/PageTitle";
import VoucherSearchEmpty from "@/components/Voucher/VoucherSearchEmpty";
import { useGetMasterProvinces } from "@/services/Transporter/pengaturan/getDataAreaMuat";
import {
  useGetAreaBongkarData,
  useGetAreaMuatData,
  useGetMuatanDilayaniData,
} from "@/services/Transporter/pengaturan/getDataPengaturan";

export default function Page() {
  const router = useRouter();

  // Modal state
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [isAreaMuatModalOpen, setIsAreaMuatModalOpen] = useState(false);
  const [isAreaBongkarModalOpen, setIsAreaBongkarModalOpen] = useState(false);
  const [isViewAreaMuatModalOpen, setIsViewAreaMuatModalOpen] = useState(false);
  const [isViewAreaBongkarModalOpen, setIsViewAreaBongkarModalOpen] =
    useState(false);
  const [searchProvince, setSearchProvince] = useState("");
  const [viewModalSearch, setViewModalSearch] = useState("");
  const [viewBongkarModalSearch, setViewBongkarModalSearch] = useState("");

  // Fetch area muat data from API
  const {
    provinces: areaMuatProvinces,
    totalProvinces,
    isLoading,
  } = useGetAreaMuatData({
    q: searchProvince,
  });

  // Fetch area bongkar data from API
  const {
    provinces: areaBongkarProvinces,
    totalProvinces: totalBongkarProvinces,
    isLoading: isLoadingBongkar,
  } = useGetAreaBongkarData({
    q: searchProvince,
  });

  // Fetch provinces data with search
  const { provinces: provincesData, isLoading: isLoadingProvinces } =
    useGetMasterProvinces({
      q: searchProvince,
      excludeExisting: false,
    });

  const { muatan, isLoading: isLoadingMuatan } = useGetMuatanDilayaniData();

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

  // Render Area Muat section based on data state
  const renderAreaMuatSection = () => {
    const hasData = areaMuatProvinces && areaMuatProvinces.length > 0;
    const areaMuatData = {
      provinces: areaMuatProvinces || [],
      totalProvinces: totalProvinces || 0,
    };

    return (
      <div className="border-b border-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-lg font-semibold text-neutral-900">
                Area Muat
              </h3>
              {hasData ? (
                <BadgeStatus variant="success" className="w-auto">
                  <CheckCircle size={16} className="mr-2" />
                  Data Tersimpan
                </BadgeStatus>
              ) : (
                <BadgeStatus variant="error" className="w-auto">
                  <XCircle size={16} className="mr-2" />
                  Belum Ada Data
                </BadgeStatus>
              )}
            </div>
            <p className="text-sm text-neutral-600">
              Tentukan area kerja kamu agar pekerjaanmu menjadi lebih efektif
              dan efisien. muatrans hanya menawarkan permintaan jasa angkut
              dengan lokasi pick up didalam area kerjamu
            </p>
          </div>

          <div className="ml-4 flex-shrink-0">
            <Button
              variant="muattrans-primary"
              onClick={() => {
                if (!hasData) {
                  setIsAreaMuatModalOpen(true);
                } else {
                  router.push("/pengaturan/area-muat");
                }
              }}
            >
              {hasData ? "Atur Area Muat" : "Tambah Area Muat"}
            </Button>
          </div>
        </div>
        {/* Display selected provinces when data exists */}
        {hasData && areaMuatData.provinces.length > 0 && (
          <div className="mt-4">
            <Collapsible defaultOpen={false}>
              <div className="rounded-lg border">
                <CollapsibleTrigger className="!flex !w-full cursor-pointer !items-center !justify-between border-b border-neutral-200 bg-[#F8F8FB] !px-4 !py-3 !text-left hover:no-underline">
                  <span className="text-sm font-medium text-[#7B7B7B]">
                    {areaMuatData.totalProvinces} Provinsi
                  </span>
                  <ChevronDown
                    size={16}
                    className="text-neutral-600 transition-transform duration-200 data-[state=open]:rotate-180"
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t border-neutral-200 bg-white px-3 pb-3 pt-3">
                    <div className="flex flex-wrap items-center gap-1">
                      {areaMuatData.provinces.slice(0, 7).map((province) => (
                        <TagBubble key={province.id} className="me-1 px-2">
                          {province.name} -{" "}
                          {typeof province.cityCount === "number"
                            ? `${province.cityCount} Kota/Kab`
                            : province.cityCount}
                        </TagBubble>
                      ))}
                      {areaMuatData.provinces.length > 7 && (
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setViewModalSearch("");
                            setIsViewAreaMuatModalOpen(true);
                          }}
                        >
                          <TagBubble className="!bg-primary-700 !text-white hover:!bg-white hover:!text-primary-700">
                            +{areaMuatData.provinces.length - 7}
                          </TagBubble>
                        </div>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>
        )}
      </div>
    );
  };

  // Render Area Bongkar section based on data state
  const renderAreaBongkarSection = () => {
    const hasData = areaBongkarProvinces && areaBongkarProvinces.length > 0;
    const areaBongkarData = {
      provinces: areaBongkarProvinces || [],
      totalProvinces: totalBongkarProvinces || 0,
    };

    return (
      <div className="border-b border-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-lg font-semibold text-neutral-900">
                Area Bongkar
              </h3>
              {hasData ? (
                <BadgeStatus variant="success" className="w-auto">
                  <CheckCircle size={16} className="mr-2" />
                  Data Tersimpan
                </BadgeStatus>
              ) : (
                <BadgeStatus variant="error" className="w-auto">
                  <XCircle size={16} className="mr-2" />
                  Belum Ada Data
                </BadgeStatus>
              )}
            </div>
            <p className="text-sm text-neutral-600">
              Tentukan area kerja kamu agar pekerjaanmu menjadi lebih efektif
              dan efisien. muatrans hanya menawarkan permintaan jasa angkut
              dengan lokasi bongkar didalam area kerjamu
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <Button
              variant="muattrans-primary"
              onClick={() => {
                if (!hasData) {
                  setIsAreaBongkarModalOpen(true);
                } else {
                  router.push("/pengaturan/area-bongkar");
                }
              }}
            >
              {hasData ? "Atur Area Bongkar" : "Tambah Area Bongkar"}
            </Button>
          </div>
        </div>
        {/* Display selected provinces when data exists */}
        {hasData && areaBongkarData.provinces.length > 0 && (
          <div className="mt-4">
            <Collapsible defaultOpen={false}>
              <div className="rounded-lg border">
                <CollapsibleTrigger className="!flex !w-full cursor-pointer !items-center !justify-between border-b border-neutral-200 bg-[#F8F8FB] !px-4 !py-3 !text-left hover:no-underline">
                  <span className="text-sm font-medium text-[#7B7B7B]">
                    {areaBongkarData.totalProvinces} Provinsi
                  </span>
                  <ChevronDown
                    size={16}
                    className="text-neutral-600 transition-transform duration-200 data-[state=open]:rotate-180"
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t border-neutral-200 bg-white px-3 pb-3 pt-3">
                    <div className="flex flex-wrap items-center gap-1">
                      {areaBongkarData.provinces.slice(0, 7).map((province) => (
                        <TagBubble key={province.id} className="me-1 px-2">
                          {province.name} -{" "}
                          {typeof province.cityCount === "number"
                            ? `${province.cityCount} Kota/Kab`
                            : province.cityCount}
                        </TagBubble>
                      ))}
                      {areaBongkarData.provinces.length > 7 && (
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setViewBongkarModalSearch("");
                            setIsViewAreaBongkarModalOpen(true);
                          }}
                        >
                          <TagBubble className="!bg-primary-700 !text-white hover:!bg-white hover:!text-primary-700">
                            +{areaBongkarData.provinces.length - 7}
                          </TagBubble>
                        </div>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="mx-auto py-6">
        <PageTitle withBack={false} className="mb-6">
          Pengaturan
        </PageTitle>

        <Card className="!border-none">
          <CardContent className="p-0">
            {/* Area Muat Section */}
            {renderAreaMuatSection()}

            {/* Area Bongkar Section */}
            {renderAreaBongkarSection()}

            {/* Muatan Yang Dilayani Section */}
            <div className="border-b border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Muatan Yang Dilayani
                    </h3>
                    {isLoadingMuatan ? (
                      <span className="text-sm text-neutral-500">
                        Memuat...
                      </span>
                    ) : muatan.length === 0 ? (
                      <BadgeStatus variant="error" className="w-auto">
                        <XCircle size={16} className="mr-2" />
                        Belum Ada Data
                      </BadgeStatus>
                    ) : (
                      <BadgeStatus variant="success" className="w-auto">
                        <CheckCircle size={16} className="mr-2" />
                        {muatan.length} Data Tersedia
                      </BadgeStatus>
                    )}
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
        provinces={provincesData}
        isLoading={isLoadingProvinces}
        onSearch={handleSearchProvinces}
        saveContext="area-muat"
      />

      {/* Area Bongkar Province Selection Modal */}
      <ProvinceSelectionModal
        isOpen={isAreaBongkarModalOpen}
        onClose={() => setIsAreaBongkarModalOpen(false)}
        onSave={handleSaveProvinces}
        title="Pilih Provinsi Area Bongkar"
        provinces={provincesData}
        isLoading={isLoadingProvinces}
        onSearch={handleSearchProvinces}
        saveContext="area-bongkar"
      />

      {/* View Area Muat Modal */}
      <Modal
        open={isViewAreaMuatModalOpen}
        onOpenChange={(open) => {
          setIsViewAreaMuatModalOpen(open);
          if (!open) {
            setViewModalSearch("");
          }
        }}
      >
        <ModalContent type="muatmuat" className="h-[397px] w-[544px]">
          <div className="flex flex-col px-5 py-4">
            <h2 className="mb-4 text-center text-lg font-bold leading-[21.6px]">
              Lihat Area Muat
            </h2>
            <div className="h-[320px] rounded-xl border border-neutral-400 p-4">
              {/* Search Bar */}
              <div className="mb-4">
                <InputSearch
                  placeholder="Cari Area Muat"
                  searchValue={viewModalSearch}
                  setSearchValue={setViewModalSearch}
                  options={[]}
                  onSelectValue={() => {}}
                  hideDropdown={true}
                />
              </div>

              {/* Province Count - Only show when no search */}
              {!viewModalSearch && (
                <div className="mb-2">
                  <span className="text-sm font-medium text-neutral-900">
                    {areaMuatProvinces ? areaMuatProvinces.length : 0} Provinsi
                  </span>
                </div>
              )}

              {/* Province Tags */}
              <div
                className={`flex max-h-[210px] flex-wrap gap-2 ${
                  (viewModalSearch &&
                    (areaMuatProvinces || []).filter((province) =>
                      province.name
                        .toLowerCase()
                        .includes(viewModalSearch.toLowerCase())
                    ).length > 0) ||
                  (!viewModalSearch && (areaMuatProvinces || []).length > 0)
                    ? "overflow-y-auto"
                    : ""
                }`}
              >
                {viewModalSearch &&
                (areaMuatProvinces || []).filter((province) =>
                  province.name
                    .toLowerCase()
                    .includes(viewModalSearch.toLowerCase())
                ).length === 0 ? (
                  <div className="flex w-full items-center justify-center">
                    <VoucherSearchEmpty />
                  </div>
                ) : (
                  (areaMuatProvinces || [])
                    .filter((province) =>
                      province.name
                        .toLowerCase()
                        .includes(viewModalSearch.toLowerCase())
                    )
                    .map((province) => (
                      <TagBubble key={province.id}>
                        {province.name} -{" "}
                        {typeof province.cityCount === "number"
                          ? `${province.cityCount} Kota/Kab`
                          : province.cityCount}
                      </TagBubble>
                    ))
                )}
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* View Area Bongkar Modal */}
      <Modal
        open={isViewAreaBongkarModalOpen}
        onOpenChange={(open) => {
          setIsViewAreaBongkarModalOpen(open);
          if (!open) {
            setViewBongkarModalSearch("");
          }
        }}
      >
        <ModalContent type="muatmuat" className="h-[397px] w-[544px]">
          <div className="flex flex-col px-5 py-4">
            <h2 className="mb-4 text-center text-lg font-bold leading-[21.6px]">
              Lihat Area Bongkar
            </h2>
            <div className="h-[320px] rounded-xl border border-neutral-400 p-4">
              {/* Search Bar */}
              <div className="mb-4">
                <InputSearch
                  placeholder="Cari Area Bongkar"
                  searchValue={viewBongkarModalSearch}
                  setSearchValue={setViewBongkarModalSearch}
                  options={[]}
                  onSelectValue={() => {}}
                  hideDropdown={true}
                />
              </div>

              {/* Province Count - Only show when no search */}
              {!viewBongkarModalSearch && (
                <div className="mb-2">
                  <span className="text-sm font-medium text-neutral-900">
                    {areaBongkarProvinces ? areaBongkarProvinces.length : 0}{" "}
                    Provinsi
                  </span>
                </div>
              )}

              {/* Province Tags */}
              <div
                className={`flex max-h-[210px] flex-wrap gap-2 ${
                  (viewBongkarModalSearch &&
                    (areaBongkarProvinces || []).filter((province) =>
                      province.name
                        .toLowerCase()
                        .includes(viewBongkarModalSearch.toLowerCase())
                    ).length > 0) ||
                  (!viewBongkarModalSearch &&
                    (areaBongkarProvinces || []).length > 0)
                    ? "overflow-y-auto"
                    : ""
                }`}
              >
                {viewBongkarModalSearch &&
                (areaBongkarProvinces || []).filter((province) =>
                  province.name
                    .toLowerCase()
                    .includes(viewBongkarModalSearch.toLowerCase())
                ).length === 0 ? (
                  <div className="flex w-full items-center justify-center">
                    <VoucherSearchEmpty />
                  </div>
                ) : (
                  (areaBongkarProvinces || [])
                    .filter((province) =>
                      province.name
                        .toLowerCase()
                        .includes(viewBongkarModalSearch.toLowerCase())
                    )
                    .map((province) => (
                      <TagBubble key={province.id}>
                        {province.name} -{" "}
                        {typeof province.cityCount === "number"
                          ? `${province.cityCount} Kota/Kab`
                          : province.cityCount}
                      </TagBubble>
                    ))
                )}
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>

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
