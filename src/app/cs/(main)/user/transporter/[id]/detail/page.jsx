"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import PageTitle from "@/components/PageTitle/PageTitle";
import { toast } from "@/lib/toast";
import { useGetTransporterDetails } from "@/services/CS/transporters/getTransporterDetails";
import { usePatchCSTransporterStatus } from "@/services/CS/transporters/patchCSTransporterStatus";

import ModalKonfirmasi from "../../../components/ModalKonfirmasi";
import TransporterDetailContainer from "./containers/TransporterDetailContainer";

export default function TransporterDetailPage() {
  const params = useParams();
  const transporterId = params.id;

  const [aktifState, setAktifState] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch transporter details and pass down to container
  const {
    data: apiResponse,
    error,
    isLoading,
    mutate,
  } = useGetTransporterDetails(transporterId);

  const transporterData = apiResponse?.Data;

  const breadcrumbData = [
    { name: "Daftar User", href: "/user" },
    { name: "Transporter", href: "/user" },
    { name: "Detail Transporter" },
  ];

  const { trigger: patchTransporterStatus } = usePatchCSTransporterStatus();

  const handleConfirmAction = async () => {
    // Desired new state (toggle)
    const newState = !aktifState;

    try {
      // Call the API to update status
      await patchTransporterStatus({
        id: transporterId,
        data: { isActive: newState },
      });

      // Update local state after success
      setAktifState(newState);

      // Show success toast
      toast.success(
        `Berhasil ${newState ? "mengaktifkan" : "menonaktifkan"} Transporter`
      );
    } catch (err) {
      // Surface an error message if available
      const message = err?.message || "Gagal memperbarui status transporter";
      toast.error(message);
    } finally {
      // Close the modal in both cases
      setIsModalOpen(false);
    }
  };

  const handleCancelAction = () => {
    // Just close the modal - no state change needed
    // The modal will close automatically when this function completes
  };

  return (
    <div className="mx-auto my-6 max-h-screen w-full max-w-[1280px] space-y-4 px-6">
      <BreadCrumb data={breadcrumbData} />
      <div className="flex items-center justify-between">
        <PageTitle href="/user">Detail Transporter</PageTitle>
        <Button
          variant={
            aktifState ? "muattrans-error-secondary" : "muattrans-primary"
          }
          onClick={() => setIsModalOpen(true)}
        >
          {aktifState ? "Non Aktifkan" : "Aktifkan"}
        </Button>
      </div>
      <ModalKonfirmasi
        isAktif={aktifState}
        companyName="PT Kalimantan Timur Jaya Sentosa Makmur Sejahtera Internasional"
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
      <TransporterDetailContainer
        transporterId={transporterId}
        transporterData={transporterData}
        isLoading={isLoading}
        error={error}
        mutate={mutate}
      />
    </div>
  );
}
