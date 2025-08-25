"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Checkbox from "@/components/Form/Checkbox";
import Input from "@/components/Form/Input";
import { MyTextArea } from "@/components/Form/TextArea";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageUploaderWeb from "@/components/ImageUploader/ImageUploaderWeb";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import MuatBongkarStepper from "@/components/Stepper/MuatBongkarStepper";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";

import UnggahResiTable from "../../components/UnggahResiTable";

export default function Page() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [notes, setNotes] = useState({
    MT25A002A: "",
    MT25A003A: "",
  });
  const [uploadedPhotos, setUploadedPhotos] = useState({
    MT25A002A: [null, null, null, null],
    MT25A003A: [null, null, null, null],
  });
  const [validationErrors, setValidationErrors] = useState({
    notes: {},
    photos: {},
  });
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Mock data for orders
  const orders = [
    {
      id: "MT25A002A",
      shipperName: "PT. Jaya Abadi",
      recipientName: "Nafalia Juwita",
      recipientPhone: "0812-3456-7890",
      pickupLocations: [
        {
          fullAddress: "Kota Surabaya, Kec. Tegalsari Tegalsari Tegalsari",
        },
      ],
      dropoffLocations: [
        {
          fullAddress: "Kota Pasuruan, Kec. Klojjen",
        },
      ],
      detailLink: "Lihat Lokasi Lainnya",
    },
    {
      id: "MT25A003A",
      shipperName: "PT. Jaya Abadi",
      recipientName: "Prima Arfandi",
      recipientPhone: "0812-3456-7890",
      pickupLocations: [
        {
          fullAddress: "Kota Surabaya, Kec. Tegalsari Tegalsari Tegalsari",
        },
      ],
      dropoffLocations: [
        {
          fullAddress: "Kota Pasuruan, Kec. Klojjen",
        },
      ],
      detailLink: "Lihat Lokasi Lainnya",
    },
  ];

  // Filter orders based on search value
  const filteredOrders = orders.filter((order) => {
    if (!searchValue.trim()) return true;

    const searchTerm = searchValue.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchTerm) ||
      order.shipperName.toLowerCase().includes(searchTerm) ||
      order.recipientName.toLowerCase().includes(searchTerm) ||
      order.recipientPhone.includes(searchTerm)
    );
  });

  const breadcrumbData = [
    { name: "Daftar Pesanan", href: "/daftar-pesanan/pesanan-aktif" },
    { name: "Pesanan Aktif", href: "/daftar-pesanan/pesanan-aktif" },
    { name: "Unggah Resi" },
  ];

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleNotesChange = (orderId, value) => {
    setNotes((prev) => ({
      ...prev,
      [orderId]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors.notes[orderId]) {
      setValidationErrors((prev) => ({
        ...prev,
        notes: {
          ...prev.notes,
          [orderId]: undefined,
        },
      }));
    }
  };

  const handlePhotoUpload = (orderId, photoIndex, file) => {
    setUploadedPhotos((prev) => ({
      ...prev,
      [orderId]: prev[orderId].map((photo, index) =>
        index === photoIndex ? file : photo
      ),
    }));

    // Clear validation error when user uploads a photo
    if (validationErrors.photos[orderId]) {
      setValidationErrors((prev) => ({
        ...prev,
        photos: {
          ...prev.photos,
          [orderId]: undefined,
        },
      }));
    }
  };

  const handleSubmit = () => {
    // Check if there's any data to submit
    if (selectedOrders.length === 0) {
      return; // Don't submit if no orders are selected
    }

    // Validate only selected orders
    const errors = {
      notes: {},
      photos: {},
    };

    let hasErrors = false;

    selectedOrders.forEach((orderId) => {
      // Validate notes
      if (!notes[orderId] || notes[orderId].trim() === "") {
        errors.notes[orderId] = "Catatan wajib diisi";
        hasErrors = true;
      }

      // Validate photos - check if at least one photo is uploaded
      const orderPhotos = uploadedPhotos[orderId] || [];
      const hasAtLeastOnePhoto = orderPhotos.some((photo) => photo !== null);

      if (!hasAtLeastOnePhoto) {
        errors.photos[orderId] = "Foto resi wajib diisi";
        hasErrors = true;
      }
    });

    setValidationErrors(errors);

    if (hasErrors) {
      return; // Don't submit if there are validation errors
    }

    // Show confirmation modal if validation passes
    setIsSubmitModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    // Close modal
    setIsSubmitModalOpen(false);

    // Show success toast
    toast.success("Berhasil mengunggah resi");

    // Navigate to active orders page
    router.push("/daftar-pesanan/pesanan-aktif");
  };

  const handleCancelSubmit = () => {
    setIsSubmitModalOpen(false);
  };

  // Check if there's any unsaved data
  const hasUnsavedData = () => {
    // Check if any notes are filled
    const hasNotes = Object.values(notes).some(
      (note) => note && note.trim() !== ""
    );

    // Check if any photos are uploaded
    const hasPhotos = Object.values(uploadedPhotos).some((photoArray) =>
      photoArray.some((photo) => photo !== null)
    );

    return hasNotes || hasPhotos;
  };

  const handleBackClick = () => {
    if (hasUnsavedData()) {
      setIsExitModalOpen(true);
    } else {
      router.back();
    }
  };

  const handleConfirmExit = () => {
    setIsExitModalOpen(false);
    router.back();
  };

  const handleCancelExit = () => {
    setIsExitModalOpen(false);
  };

  const isAllSelected =
    selectedOrders.length === filteredOrders.length &&
    filteredOrders.length > 0;

  // Table columns configuration
  const columns = [
    {
      key: "checkbox",
      header: (
        <div className="flex justify-center">
          <Checkbox
            label=""
            checked={isAllSelected}
            onChange={(data) => handleSelectAll(data.checked)}
          />
        </div>
      ),
      width: "20px",
      sortable: false,
      className: "text-center",
      render: (row) => (
        <div className="flex justify-center">
          <Checkbox
            label=""
            checked={selectedOrders.includes(row.id)}
            onChange={() => handleSelectOrder(row.id)}
          />
        </div>
      ),
    },
    {
      key: "id",
      header: "No. Pesanan",
      sortable: true,
      width: "100px",
      render: (row) => (
        <div className="cursor-pointer text-[12px] font-medium text-primary-700">
          {row.id}
        </div>
      ),
    },
    {
      key: "shipperName",
      header: "Nama Shipper",
      sortable: true,
      width: "240px",
      render: (row) => (
        <div className="text-[10px] font-[500]">{row.shipperName}</div>
      ),
    },
    {
      key: "recipient",
      header: "Nama & No. HP Penerima",
      sortable: false,
      width: "160px",
      render: (row) => (
        <div className="space-y-1">
          <div className="text-[10px] font-[500]">{row.recipientName}</div>
          <div className="ext-[10px] font-[500]">{row.recipientPhone}</div>
        </div>
      ),
    },
    {
      key: "route",
      header: "Rute Pesanan",
      sortable: false,
      width: "600px",
      render: (row) => (
        <div className="space-y-2">
          <MuatBongkarStepper
            pickupLocations={row.pickupLocations}
            dropoffLocations={row.dropoffLocations}
            appearance={{
              titleClassName: "text-[10px] font-medium text-neutral-900",
            }}
          />
          <button className="text-[12px] font-medium text-primary-700 hover:text-primary-800">
            {row.detailLink}
          </button>
        </div>
      ),
    },
    {
      key: "photos",
      header: "Foto Resi*",
      sortable: false,
      width: "180px",
      render: (row) => {
        const isDisabled = !selectedOrders.includes(row.id);
        const hasError = validationErrors.photos[row.id];

        return (
          <div className="space-y-1">
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((photoIndex) => {
                return (
                  <ImageUploaderWeb
                    key={photoIndex}
                    value={uploadedPhotos[row.id][photoIndex]}
                    onUpload={(file) =>
                      handlePhotoUpload(row.id, photoIndex, file)
                    }
                    uploadText="Foto"
                    errorText={hasError || "Ulangi"}
                    className={`!size-9 !rounded-md ${
                      isDisabled
                        ? "pointer-events-none bg-slate-200 opacity-70"
                        : ""
                    }`}
                    isBig={false}
                    maxSize={10}
                    acceptedFormats={[".jpg", ".jpeg", ".png"]}
                    onError={(_error) => null}
                    disabled={isDisabled}
                    isError={!!hasError}
                  />
                );
              })}
            </div>
            {hasError && <div className="text-xs text-red-500">{hasError}</div>}
          </div>
        );
      },
    },
    {
      key: "notes",
      header: "Catatan Pengiriman*",
      sortable: false,
      width: "160px",
      render: (row) => {
        const isDisabled = !selectedOrders.includes(row.id);
        const hasError = validationErrors.notes[row.id];

        return (
          <div className="w-48">
            <MyTextArea
              value={notes[row.id] || ""}
              onChange={(e) => handleNotesChange(row.id, e.target.value)}
              placeholder="Masukkan Catatan"
              maxLength={255}
              withCharCount
              disabled={isDisabled}
              className={isDisabled ? "opacity-50" : ""}
              errorMessage={hasError}
              appearance={{
                inputClassName: "text-xs min-h-[60px] resize-none",
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-6">
      {/* Breadcrumb */}
      <BreadCrumb data={breadcrumbData} className="mb-4" />

      {/* Header */}
      <div className="mb-6 flex items-center gap-x-3">
        <IconComponent
          onClick={handleBackClick}
          src="/icons/arrow-left24.svg"
          size="medium"
          className="cursor-pointer text-primary-700"
        />
        <h1 className="text-xl font-bold text-neutral-900">Unggah Resi</h1>
      </div>

      <Card className="border-none">
        <CardContent>
          {/* Search and Total */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="max-w-[262px] flex-1">
              <Input
                type="text"
                placeholder="Cari Pesanan"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                icon={{
                  left: (
                    <IconComponent
                      src="/icons/search.svg"
                      width={16}
                      height={16}
                    />
                  ),
                }}
                appearance={{
                  containerClassName: "h-8",
                  inputClassName: "text-xs font-medium",
                }}
              />
            </div>
            {filteredOrders.length > 0 && (
              <div className="whitespace-nowrap text-sm font-medium text-neutral-900">
                Total : {filteredOrders.length} Pesanan
              </div>
            )}
          </div>

          {/* Conditional Content */}
          {filteredOrders.length === 0 ? (
            <DataNotFound
              type="search"
              title="Keyword Tidak Ditemukan"
              className="py-16"
            />
          ) : (
            <>
              {/* Table */}
              <UnggahResiTable columns={columns} data={filteredOrders} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <Button
          variant="muattrans-primary"
          onClick={handleSubmit}
          // disabled={selectedOrders.length === 0}
          className="px-8"
        >
          Kirim
        </Button>
      </div>

      {/* Exit Confirmation Modal */}
      <ConfirmationModal
        variant="muattrans"
        isOpen={isExitModalOpen}
        setIsOpen={setIsExitModalOpen}
        title={{
          text: "Apakah kamu yakin ingin meninggalkan halaman Unggah Resi? Data yang telah terisi tidak akan tersimpan",
          className: "text-sm font-medium text-center",
        }}
        cancel={{
          text: "Tidak",
          onClick: handleCancelExit,
          classname: "px-6",
        }}
        confirm={{
          text: "Ya",
          onClick: handleConfirmExit,
          classname: "!px-9",
        }}
      />

      {/* Submit Confirmation Modal */}
      <ConfirmationModal
        variant="muattrans"
        isOpen={isSubmitModalOpen}
        setIsOpen={setIsSubmitModalOpen}
        title={{
          text: "Apakah kamu yakin ingin mengunggah resi?",
          className: "text-sm font-medium text-center",
        }}
        cancel={{
          text: "Tidak",
          onClick: handleCancelSubmit,
          classname: "px-6",
        }}
        confirm={{
          text: "Ya",
          onClick: handleConfirmSubmit,
          classname: "!px-9",
        }}
      />
    </div>
  );
}
