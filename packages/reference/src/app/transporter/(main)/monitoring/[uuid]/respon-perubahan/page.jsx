"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import Search from "@/components/Search/Search";
import SearchNotFound from "@/components/SearchNotFound/SearchNotFound";
import SelectResponPerubahan from "@/components/Select/SelectResponPerubahan";

import AturResponMassalModal from "@/container/Shared/OrderModal/AturResponMassalModal";
import RespondChangeModal from "@/container/Shared/OrderModal/RespondChangeModal";
import TerimaDanUbahArmadaModal from "@/container/Shared/OrderModal/TerimaDanUbahArmadaModal";
import ImageArmada from "@/container/Shared/OrderModal/components/ImageArmada";

import { useTranslation } from "@/hooks/use-translation";

import { toast } from "@/lib/toast";

import {
  TRACKING_STATUS,
  getTrackingStatusBadgeWithTranslation,
} from "@/utils/Transporter/trackingStatus";

// Create validation schema for all armada responses
const createFormSchema = (armadaList, t) => {
  const responseSchema = {};
  armadaList.forEach((armada) => {
    responseSchema[`armada_${armada.id}`] = v.pipe(
      v.string(),
      v.minLength(
        1,
        t(
          "ResponPerubahanPage.responseRequired",
          { plateNumber: armada.plateNumber },
          `Respon untuk ${armada.plateNumber} wajib dipilih`
        )
      )
    );
  });

  return v.object(responseSchema);
};

const ResponPerubahanPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [bulkResponse, setBulkResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [isArmadaModalOpen, setIsArmadaModalOpen] = useState(false);
  const [currentArmadaId, setCurrentArmadaId] = useState(null);
  const [selectedReplacementArmada, setSelectedReplacementArmada] = useState(
    {}
  );
  const [isMassalModalOpen, setIsMassalModalOpen] = useState(false);
  const [massalModalConfig, setMassalModalConfig] = useState({
    title: t("ResponPerubahanPage.acceptChange", {}, "Terima Perubahan"),
    responseType: "accept",
  });
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  // Mock data for demonstration
  const armadaList = [
    {
      id: 1,
      plateNumber: "AE 1111 LBA",
      driverName: "Noel Gallagher",
      status: TRACKING_STATUS.SCHEDULED_FLEET,
      response: "",
      truckImage: "/img/mock-armada/one.png",
    },
    {
      id: 2,
      plateNumber: "AE 2222 LBA",
      driverName: "Yoel Gallagher",
      status: TRACKING_STATUS.MENUJU_KE_LOKASI_MUAT,
      response: "",
      truckImage: "/img/mock-armada/two.png",
    },
    {
      id: 3,
      plateNumber: "AE 3333 LBA",
      driverName: "Gamma Gallagher",
      status: TRACKING_STATUS.MENUJU_KE_LOKASI_MUAT,
      response: "",
      truckImage: "/img/mock-armada/three.png",
    },
    {
      id: 4,
      plateNumber: "AE 4444 LBA",
      driverName: "Sam Gallagher",
      status: TRACKING_STATUS.TIBA_DI_LOKASI_MUAT,
      response: "",
      truckImage: "/img/mock-armada/one.png",
    },
    {
      id: 5,
      plateNumber: "AE 5555 LBA",
      driverName: "Muklason",
      status: TRACKING_STATUS.ANTRI_DI_LOKASI_MUAT,
      response: "",
      truckImage: "/img/mock-armada/two.png",
    },
    {
      id: 6,
      plateNumber: "AE 6666 LBA",
      driverName: "Hadi Agus James",
      status: TRACKING_STATUS.ANTRI_DI_LOKASI_MUAT,
      response: "",
      truckImage: "/img/mock-armada/three.png",
    },
  ];

  const responseOptions = [
    {
      value: "accept",
      label: t("ResponPerubahanPage.acceptChange", {}, "Terima Perubahan"),
    },
    {
      value: "change",
      label: t(
        "ResponPerubahanPage.acceptChangeAndReplace",
        {},
        "Terima Perubahan & Ubah Armada"
      ),
    },
    {
      value: "reject",
      label: t(
        "ResponPerubahanPage.rejectChangeAndCancel",
        {},
        "Tolak Perubahan & Batalkan Armada"
      ),
    },
  ];

  // Initialize form with validation
  const formSchema = createFormSchema(armadaList, t);
  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({
    resolver: valibotResolver(formSchema),
    defaultValues: armadaList.reduce((acc, armada) => {
      acc[`armada_${armada.id}`] = "";
      return acc;
    }, {}),
  });

  const formValues = watch();

  const filteredArmada = armadaList.filter(
    (armada) =>
      armada.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      armada.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIndividualResponse = (armadaId, value) => {
    if (value === "change") {
      // Open armada selection modal for "Terima Perubahan & Ubah Armada"
      setCurrentArmadaId(armadaId);
      setIsArmadaModalOpen(true);
    } else {
      setValue(`armada_${armadaId}`, value);
      trigger(`armada_${armadaId}`);
    }
  };

  const handleBulkResponse = (value) => {
    setBulkResponse(value);
    if (value === "change") {
      // Open modal for bulk change armada selection
      setMassalModalConfig({
        title: t(
          "ResponPerubahanPage.acceptChangeAndReplace",
          {},
          "Terima Perubahan & Ubah Armada"
        ),
        responseType: "change",
      });
      setIsMassalModalOpen(true);
    } else if (value === "accept") {
      // Open modal for bulk accept
      setMassalModalConfig({
        title: t("ResponPerubahanPage.acceptChange", {}, "Terima Perubahan"),
        responseType: "accept",
      });
      setIsMassalModalOpen(true);
    } else if (value === "reject") {
      // Open modal for bulk reject
      setMassalModalConfig({
        title: t(
          "ResponPerubahanPage.rejectChangeAndCancel",
          {},
          "Tolak Perubahan & Batalkan Armada"
        ),
        responseType: "reject",
      });
      setIsMassalModalOpen(true);
    }
  };

  const handleSaveAsDraft = async () => {
    setIsLoading(true);
    try {
      // Save as draft without validation
      const responses = armadaList.map((armada) => ({
        armadaId: armada.id,
        plateNumber: armada.plateNumber,
        response: formValues[`armada_${armada.id}`] || "",
      }));

      console.log("Saving as draft", responses);
      // TODO: Implement save as draft API call

      toast.success(
        t(
          "ResponPerubahanPage.draftSavedSuccess",
          {},
          "Respon berhasil disimpan sebagai draf"
        )
      );
    } catch (error) {
      toast.error(
        t(
          "ResponPerubahanPage.draftSaveError",
          {},
          "Gagal menyimpan draf. Silakan coba lagi."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Check if any response is filled
  const hasAnyResponse = armadaList.some(
    (armada) =>
      formValues[`armada_${armada.id}`] &&
      formValues[`armada_${armada.id}`] !== ""
  );

  const handleArmadaSave = (selectedArmada) => {
    console.log("Selected armada for replacement:", selectedArmada);
    // Store the selected replacement armada
    setSelectedReplacementArmada((prev) => ({
      ...prev,
      [currentArmadaId]: selectedArmada,
    }));
    // Set the response value for the current armada
    setValue(`armada_${currentArmadaId}`, "change");
    trigger(`armada_${currentArmadaId}`);
    // Reset current armada ID
    setCurrentArmadaId(null);
  };

  const handleNavigationAttempt = (url) => {
    // Check if any response has been filled
    if (hasAnyResponse) {
      setPendingNavigation(url);
      setIsConfirmationModalOpen(true);
    } else {
      router.push(url);
    }
  };

  const handleConfirmNavigation = () => {
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
    setIsConfirmationModalOpen(false);
    setPendingNavigation(null);
  };

  const handleMassalSave = (
    selectedArmadaList,
    responseType,
    replacementArmadaData
  ) => {
    console.log("Bulk response:", selectedArmadaList, responseType);
    console.log("Replacement armada data:", replacementArmadaData);

    // First, clear all responses of the same type and their replacement armada
    armadaList.forEach((armada) => {
      if (formValues[`armada_${armada.id}`] === responseType) {
        setValue(`armada_${armada.id}`, "");
        // Also clear replacement armada for unselected items
        if (!selectedArmadaList.find((selected) => selected.id === armada.id)) {
          setSelectedReplacementArmada((prev) => {
            const newState = { ...prev };
            delete newState[armada.id];
            return newState;
          });
        }
      }
    });

    // Then apply the response only to the selected armada
    selectedArmadaList.forEach((armada) => {
      setValue(`armada_${armada.id}`, responseType);

      // If it's a change response and we have replacement armada, store it
      if (
        responseType === "change" &&
        replacementArmadaData &&
        replacementArmadaData[armada.id]
      ) {
        setSelectedReplacementArmada((prev) => ({
          ...prev,
          [armada.id]: replacementArmadaData[armada.id],
        }));
      }
    });

    // Reset bulk response dropdown
    setBulkResponse("");
    // Don't trigger validation here - let user submit when ready
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Convert form data to response format
      const responses = armadaList.map((armada) => ({
        armadaId: armada.id,
        plateNumber: armada.plateNumber,
        response: data[`armada_${armada.id}`],
      }));

      console.log("Submitting responses", responses);
      // TODO: Implement submit response API call

      toast.success(
        t(
          "ResponPerubahanPage.responseSubmitSuccess",
          {},
          "Respon perubahan berhasil dikirim"
        )
      );
      // Optionally navigate back or reset form
    } catch (error) {
      toast.error(
        t(
          "ResponPerubahanPage.responseSubmitError",
          {},
          "Gagal mengirim respon. Silakan coba lagi."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitResponse = handleSubmit(onSubmit, (errors) => {
    // Show appropriate toast based on validation errors
    const errorCount = Object.keys(errors).length;
    const totalArmada = armadaList.length;

    if (errorCount === totalArmada) {
      // All responses are missing
      toast.error(
        t(
          "ResponPerubahanPage.allResponsesRequired",
          {},
          "Respon perubahan wajib diisi"
        )
      );
    } else {
      // Some responses are missing
      toast.error(
        t(
          "ResponPerubahanPage.allResponsesRequiredComplete",
          {},
          "Respon perubahan wajib terisi semua"
        )
      );
    }

    console.log("Validation errors:", errors);
  });

  const breadcrumbData = [
    {
      name: t("ResponPerubahanPage.monitoring", {}, "Monitoring"),
      href: "/monitoring",
    },
    {
      name: t(
        "ResponPerubahanPage.activeOrderList",
        {},
        "Daftar Pesanan Aktif"
      ),
      href: "/monitoring",
    },
    { name: t("ResponPerubahanPage.responseChange", {}, "Respon Perubahan") },
  ];

  return (
    <div className="mx-auto flex h-full max-w-[1200px] flex-col pb-20 pt-6">
      {/* Header */}
      <div className="">
        <div className="flex flex-col gap-4">
          <BreadCrumb data={breadcrumbData} />

          <div className="flex items-center justify-between">
            <PageTitle withBack className="mb-0">
              {t("ResponPerubahanPage.responseChange", {}, "Respon Perubahan")}
            </PageTitle>

            <div className="flex items-center gap-3">
              <Button
                variant="muattrans-primary-secondary"
                onClick={() => setIsChangeModalOpen(true)}
                className="h-10 px-4"
              >
                {t("ResponPerubahanPage.viewChanges", {}, "Lihat Perubahan")}
              </Button>
              <Button
                variant="muattrans-primary-secondary"
                onClick={() =>
                  handleNavigationAttempt(
                    `/transporter/monitoring/${params.uuid}/detail-pesanan`
                  )
                }
                className="h-10 px-4"
              >
                {t("ResponPerubahanPage.orderDetails", {}, "Detail Pesanan")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="my-4">
        <div className="flex items-start gap-2 rounded-lg bg-secondary-100 px-6 py-4 text-xs font-medium">
          <IconComponent
            src="/icons/warning24.svg"
            className="h-5 w-5 shrink-0 text-warning-900"
          />
          <div className="flex-1">
            <p className="mb-3 pt-0.5">
              {t("ResponPerubahanPage.notification", {}, "Pemberitahuan")}:
            </p>
            <ul className="mt-1 list-disc pl-5">
              <li>
                {t(
                  "ResponPerubahanPage.notificationMessage1",
                  {},
                  "Terdapat perubahan pesanan dari shipper, mohon pelajari perubahannya dan segera beri respon."
                )}
              </li>
              <li>
                {t(
                  "ResponPerubahanPage.notificationMessage2",
                  {},
                  "Jika kamu melakukan penolakan pada satu armada atau lebih, maka akan ada penyesuaian pendapatan."
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="rounded-xl bg-white shadow-muat">
          {/* Search and Bulk Actions */}
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <Search
                placeholder={t(
                  "ResponPerubahanPage.searchPlaceholder",
                  {},
                  "Cari No. Polisi / Nama Driver"
                )}
                onSearch={(value) => setSearchTerm(value)}
                containerClassName="w-80"
                inputClassName="text-sm"
                autoSearch={true}
                debounceTime={300}
              />

              <div className="flex items-center gap-3">
                <div className="w-[216px]">
                  <SelectResponPerubahan
                    value={bulkResponse}
                    onChange={handleBulkResponse}
                    options={responseOptions}
                    placeholder={t(
                      "ResponPerubahanPage.setBulkResponse",
                      {},
                      "Atur Respon Massal"
                    )}
                    contentWidth="242px"
                    className="text-neutral-900"
                  />
                </div>
                <Button
                  variant="muattrans-primary-secondary"
                  onClick={handleSaveAsDraft}
                  disabled={isLoading || !hasAnyResponse}
                  className="h-10 px-6"
                >
                  {isLoading
                    ? t("ResponPerubahanPage.saving", {}, "Menyimpan...")
                    : t(
                        "ResponPerubahanPage.saveAsDraft",
                        {},
                        "Simpan sebagai Draf"
                      )}
                </Button>
                <Button
                  variant="muattrans-primary"
                  onClick={handleSubmitResponse}
                  disabled={isLoading}
                  className="h-10 px-6"
                >
                  {isLoading
                    ? t("ResponPerubahanPage.sending", {}, "Mengirim...")
                    : t("ResponPerubahanPage.sendResponse", {}, "Kirim Respon")}
                </Button>
              </div>
            </div>
          </div>

          {/* Armada List Header */}
          <div className="grid grid-cols-3 items-center gap-9 px-6 text-xs font-bold text-neutral-600">
            <div>
              {t("ResponPerubahanPage.fleetList", {}, "Daftar Armada")} (
              {filteredArmada.length}{" "}
              {t("ResponPerubahanPage.fleet", {}, "Armada")})
            </div>
            <div className="">
              {t(
                "ResponPerubahanPage.replacementFleet",
                {},
                "Armada Pengganti"
              )}
            </div>
            <div className="">
              {t(
                "ResponPerubahanPage.selectResponseChange",
                {},
                "Pilih Respon Perubahan"
              )}
            </div>
          </div>

          {/* Armada List */}
          <div className="flex flex-col gap-3 p-6 pt-4">
            {filteredArmada.length === 0 && searchTerm ? (
              <div className="flex items-center justify-center py-8">
                <SearchNotFound />
              </div>
            ) : (
              filteredArmada.map((armada) => (
                <div
                  key={armada.id}
                  className="flex items-center justify-between gap-6 rounded-xl border border-neutral-400 p-4"
                >
                  <div className="flex w-[308px] items-center gap-2">
                    {/* Truck Image */}
                    <ImageArmada
                      src={armada.truckImage}
                      plateNumber={armada.plateNumber}
                      size="md"
                    />

                    {/* Armada Info */}
                    <div className="flex-1">
                      <div className="mb-2.5 flex items-center gap-1">
                        <span className="text-xs font-bold text-black">
                          {armada.plateNumber}
                        </span>
                        <span className="text-xs font-semibold text-neutral-800">
                          - {armada.driverName}
                        </span>
                      </div>
                      <BadgeStatus
                        variant={
                          getTrackingStatusBadgeWithTranslation(
                            armada.status,
                            t
                          ).variant
                        }
                        className="w-auto"
                      >
                        {
                          getTrackingStatusBadgeWithTranslation(
                            armada.status,
                            t
                          ).label
                        }
                      </BadgeStatus>
                    </div>
                  </div>

                  {/* Info Message for Accept Response */}
                  {formValues[`armada_${armada.id}`] === "accept" && (
                    <div className="flex flex-1 items-center gap-6">
                      <IconComponent
                        src="/icons/arrow-right.svg"
                        className="h-6 w-6 text-success-600"
                      />
                      <span className="w-[340px] text-xs font-semibold text-success-400">
                        {t(
                          "ResponPerubahanPage.noFleetChangeMessage",
                          {},
                          "Tidak ada perubahan armada dan akan ada penyesuaian pendapatan"
                        )}
                      </span>
                    </div>
                  )}

                  {/* Selected Replacement Armada for Change Response */}
                  {formValues[`armada_${armada.id}`] === "change" &&
                    selectedReplacementArmada[armada.id] && (
                      <div className="flex flex-1 items-center gap-6">
                        <IconComponent
                          src="/icons/arrow-right.svg"
                          className="h-6 w-6 text-neutral-600"
                        />
                        <div className="flex w-full items-center gap-2">
                          <ImageArmada
                            src={
                              selectedReplacementArmada[armada.id].truckImage
                            }
                            plateNumber={
                              selectedReplacementArmada[armada.id].plateNumber
                            }
                            size="md"
                          />
                          <div className="flex w-[195px] flex-col">
                            <div className="line-clamp-2 break-all text-xs">
                              <span className="font-bold">
                                {
                                  selectedReplacementArmada[armada.id]
                                    .plateNumber
                                }
                              </span>
                              <span className="font-semibold">
                                {" - "}
                                {
                                  selectedReplacementArmada[armada.id]
                                    .driverName
                                }
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setCurrentArmadaId(armada.id);
                              setIsArmadaModalOpen(true);
                            }}
                            className="ml-auto text-xs font-medium text-primary-700"
                          >
                            {t(
                              "ResponPerubahanPage.changeFleet",
                              {},
                              "Ubah Armada"
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                  {/* Info Message for Reject Response */}
                  {formValues[`armada_${armada.id}`] === "reject" && (
                    <div className="flex flex-1 items-center gap-6">
                      <IconComponent
                        src="/icons/arrow-right.svg"
                        className="h-6 w-6 text-error-400"
                      />
                      <span className="w-[340px] text-xs font-semibold text-error-400">
                        {t(
                          "ResponPerubahanPage.fleetCancelMessage",
                          {},
                          "Armada akan dibatalkan, akan ada penyesuaian pendapatan, dan tidak ada kompensasi"
                        )}
                      </span>
                    </div>
                  )}

                  {/* Response Dropdown */}
                  <div className="w-[345px]">
                    <SelectResponPerubahan
                      value={formValues[`armada_${armada.id}`] || ""}
                      onChange={(value) =>
                        handleIndividualResponse(armada.id, value)
                      }
                      options={responseOptions}
                      placeholder={t(
                        "ResponPerubahanPage.selectResponseChange",
                        {},
                        "Pilih Respon Perubahan"
                      )}
                      error={!!errors[`armada_${armada.id}`]}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RespondChangeModal */}
      <RespondChangeModal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        orderData={{ id: params.uuid }}
        hideActionButton
      />

      {/* TerimaDanUbahArmadaModal */}
      <TerimaDanUbahArmadaModal
        isOpen={isArmadaModalOpen}
        onClose={() => {
          setIsArmadaModalOpen(false);
          setCurrentArmadaId(null);
        }}
        orderData={{ id: params.uuid }}
        armadaId={currentArmadaId}
        onSave={handleArmadaSave}
      />

      {/* AturResponMassalModal */}
      <AturResponMassalModal
        isOpen={isMassalModalOpen}
        onClose={() => {
          setIsMassalModalOpen(false);
          setBulkResponse("");
        }}
        title={massalModalConfig.title}
        responseType={massalModalConfig.responseType}
        armadaList={filteredArmada}
        totalRequired={armadaList.length}
        onSave={handleMassalSave}
        existingReplacements={selectedReplacementArmada}
        existingSelections={filteredArmada
          .filter(
            (armada) =>
              formValues[`armada_${armada.id}`] ===
              massalModalConfig.responseType
          )
          .map((armada) => armada.id.toString())}
      />
      {/* ConfirmationModal */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        setIsOpen={setIsConfirmationModalOpen}
        description={{
          text: "Apakah kamu yakin ingin berpindah halaman? Data yang telah diisi tidak akan disimpan",
        }}
        cancel={{
          text: "Ya",
          onClick: handleConfirmNavigation,
          classname: "w-[112px]",
        }}
        confirm={{ text: "Batal", classname: "w-[112px]" }}
      />
    </div>
  );
};

export default ResponPerubahanPage;
