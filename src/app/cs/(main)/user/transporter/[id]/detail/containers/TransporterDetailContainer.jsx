"use client";

import { useState } from "react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import {
  Tabs,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";
import { toast } from "@/lib/toast";
import { useGetTransporterDetails } from "@/services/CS/transporters/getTransporterDetails";

import DaftarArmadaTab from "./tabs/DaftarArmadaTab";
import DaftarDriverTab from "./tabs/DaftarDriverTab";
import DataTransporterTab from "./tabs/DataTransporterTab";
import RekapPembatalanTab from "./tabs/RekapPembatalanTab";
import RiwayatStatusTab from "./tabs/RiwayatStatusTab";

const TransporterDetailContainer = ({ transporterId }) => {
  // State management
  const [activeTab, setActiveTab] = useState("daftar-armada");
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "",
    data: null,
  });
  const [hubungiModalOpen, setHubungiModalOpen] = useState(false);

  // API call to get transporter details
  const {
    data: apiResponse,
    error,
    isLoading,
    mutate,
  } = useGetTransporterDetails(transporterId);
  // Extract transporter data from API response
  const transporterData = apiResponse?.Data;

  const openHubungiModal = () => {
    setHubungiModalOpen(true);
  };

  const closeHubungiModal = () => {
    setHubungiModalOpen(false);
  };

  const handleConfirmAction = () => {
    if (!modalState.data) return;

    if (modalState.type === "deactivate") {
      // In a real app, you would call an API to update the transporter status
      // For now, we'll just refresh the data and show a success message
      mutate(); // Refresh the data
      toast.success("Berhasil menonaktifkan Transporter");
    } else if (modalState.type === "activate") {
      // In a real app, you would call an API to update the transporter status
      // For now, we'll just refresh the data and show a success message
      mutate(); // Refresh the data
      toast.success("Berhasil mengaktifkan Transporter");
    }
    setModalState({ isOpen: false, type: "", data: null });
  };

  const renderConfirmationModal = () => {
    if (!modalState.isOpen || !modalState.data) return null;

    const commonProps = {
      isOpen: modalState.isOpen,
      setIsOpen: (val) => setModalState({ ...modalState, isOpen: val }),
      size: "small",
    };

    const isDeactivate = modalState.type === "deactivate";
    const modalConfig = {
      title: isDeactivate ? "Non Aktifkan Transporter" : "Aktifkan Transporter",
      actionText: isDeactivate ? "Ya, Non Aktifkan" : "Ya, Aktifkan",
      question: isDeactivate ? "menonaktifkan" : "mengaktifkan",
    };

    return (
      <ConfirmationModal
        {...commonProps}
        title={{ text: modalConfig.title }}
        description={{
          text: (
            <>
              Apakah kamu yakin ingin {modalConfig.question} Transporter{" "}
              <strong>{transporterData?.companyName}</strong>?
            </>
          ),
        }}
        confirm={{
          text: modalConfig.actionText,
          onClick: handleConfirmAction,
          classname:
            " border border-[--muat-trans-secondary-900] bg-neutral-50 text-[--muat-trans-secondary-900] hover:bg-[--muat-trans-secondary-50]",
        }}
        cancel={{
          text: "Kembali",
          classname:
            " bg-[--muat-trans-primary-400] text-neutral-900 hover:bg-[--muat-trans-primary-500] border-none",
          onClick: () => commonProps.setIsOpen(false),
        }}
      />
    );
  };

  // Reusable status indicator component
  const StatusIndicator = ({ status }) => {
    const isActive = status === "Aktif";
    return (
      <div className="flex items-center space-x-1">
        <div
          className={`aspect-square size-[6px] rounded-[100%] ${
            isActive ? "bg-success-500" : "bg-error-500"
          }`}
        />
        <p>{status}</p>
      </div>
    );
  };

  // Reusable statistics item component
  const StatisticItem = ({ value, label }) => (
    <div className="flex flex-col gap-2 px-3 text-center">
      <div className="text-base font-bold text-black">{value}</div>
      <div className="text-xs text-neutral-900">{label}</div>
    </div>
  );

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Memuat data transporter...</p>
          <p className="mt-2 text-sm text-neutral-600">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  if (error || !transporterData) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-error-500">
            Terjadi Kesalahan
          </p>
          <p className="mt-2 text-sm text-neutral-600">
            Gagal memuat data transporter
          </p>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatJoinDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="">
      {/* Transporter Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-start gap-3">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-[100%] border border-neutral-400 bg-white p-2">
            <img
              src={transporterData.companyLogo || "/img/kaltim.png"}
              alt="logo"
              className="rounded-[100%] object-contain"
            />
          </div>
          <div className="space-y-3">
            <div>
              <h1 className="text-xl font-bold text-black">
                {transporterData.companyName || "-"}
              </h1>
              <div className="mt-2 flex items-center space-x-2 text-sm">
                <StatusIndicator
                  status={
                    transporterData.status === "ACTIVE" ? "Aktif" : "Non Aktif"
                  }
                />
                <span>&bull;</span>
                <div className="flex items-center space-x-1">
                  <IconComponent
                    src="/icons/location.svg"
                    className="text-neutral-600"
                    width={16}
                    height={16}
                  />

                  <span className="font-medium text-neutral-900">
                    {transporterData.company.city || "-"}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="muattrans-primary-secondary"
              iconLeft={
                <IconComponent
                  src="/icons/chat16.svg"
                  className="text-black"
                  width={16}
                  height={16}
                />
              }
              onClick={openHubungiModal}
              className="text-black hover:bg-neutral-50"
            >
              Hubungi
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-8">
          <div className="grid grid-cols-2 items-center divide-x divide-neutral-400">
            <StatisticItem
              value={transporterData.completedOrders || 0}
              label="Pesanan Selesai"
            />
            <StatisticItem
              value={formatJoinDate(transporterData.joinedAt)}
              label="Bergabung Sejak"
            />
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="">
        <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-neutral-200 px-6 pt-6">
            <TabsList className="">
              <TabsTriggerWithSeparator
                value="daftar-armada"
                activeColor="primary-700"
                className="!text-base"
              >
                Daftar Armada
              </TabsTriggerWithSeparator>
              <TabsTriggerWithSeparator
                value="daftar-driver"
                activeColor="primary-700"
                className="!text-base"
              >
                Daftar Driver
              </TabsTriggerWithSeparator>
              <TabsTriggerWithSeparator
                value="rekap-pembatalan"
                activeColor="primary-700"
                className="!text-base"
              >
                Rekap Pembatalan
              </TabsTriggerWithSeparator>
              <TabsTriggerWithSeparator
                value="data-transporter"
                activeColor="primary-700"
                className="!text-base"
              >
                Data Transporter
              </TabsTriggerWithSeparator>
              <TabsTriggerWithSeparator
                value="riwayat-status"
                activeColor="primary-700"
                showSeparator={false}
                className="!text-base"
              >
                Riwayat Status
              </TabsTriggerWithSeparator>
            </TabsList>
          </div>

          {/* Tab Content */}
          <DaftarArmadaTab transporterId={transporterId} />

          <DaftarDriverTab transporterId={transporterId} />
          <RekapPembatalanTab transporterId={transporterId} />
          <DataTransporterTab transporterId={transporterId} />
          <RiwayatStatusTab />
        </Tabs>
      </div>

      {/* Modals */}
      {renderConfirmationModal()}
      <HubungiModal
        isOpen={hubungiModalOpen}
        onClose={closeHubungiModal}
        contacts={{
          pics: transporterData?.contact || [],
          emergencyContact: transporterData?.emergencyContact || null,
          companyContact: transporterData?.company?.phoneNumber,
        }}
      />
    </div>
  );
};

export default TransporterDetailContainer;
