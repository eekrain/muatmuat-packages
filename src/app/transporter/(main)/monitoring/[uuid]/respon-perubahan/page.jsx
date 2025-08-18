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
import PageTitle from "@/components/PageTitle/PageTitle";
import Search from "@/components/Search/Search";
import SearchNotFound from "@/components/SearchNotFound/SearchNotFound";
import SelectResponPerubahan from "@/components/Select/SelectResponPerubahan";
import RespondChangeModal from "@/container/Shared/OrderModal/RespondChangeModal";
import { toast } from "@/lib/toast";

// Create validation schema for all armada responses
const createFormSchema = (armadaList) => {
  const responseSchema = {};
  armadaList.forEach((armada) => {
    responseSchema[`armada_${armada.id}`] = v.pipe(
      v.string(),
      v.minLength(1, `Respon untuk ${armada.plateNumber} wajib dipilih`)
    );
  });

  return v.object(responseSchema);
};

const ResponPerubahanPage = () => {
  const router = useRouter();
  const params = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [bulkResponse, setBulkResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);

  // Mock data for demonstration
  const armadaList = [
    {
      id: 1,
      plateNumber: "AE 1111 LBA",
      driverName: "Noel Gallagher",
      status: "Armada Dijadwalkan",
      response: "",
    },
    {
      id: 2,
      plateNumber: "AE 2222 LBA",
      driverName: "Yoel Gallagher",
      status: "Menuju ke Lokasi Muat",
      response: "",
    },
    {
      id: 3,
      plateNumber: "AE 3333 LBA",
      driverName: "Gamma Gallagher",
      status: "Menuju ke Lokasi Muat",
      response: "",
    },
    {
      id: 4,
      plateNumber: "AE 4444 LBA",
      driverName: "Sam Gallagher",
      status: "Tiba di Lokasi Muat",
      response: "",
    },
    {
      id: 5,
      plateNumber: "AE 5555 LBA",
      driverName: "Muklason",
      status: "Antri di Lokasi Muat",
      response: "",
    },
    {
      id: 6,
      plateNumber: "AE 6666 LBA",
      driverName: "Hadi Agus James",
      status: "Antri di Lokasi Muat",
      response: "",
    },
  ];

  const responseOptions = [
    { value: "accept", label: "Terima Perubahan" },
    { value: "change", label: "Terima Perubahan & Ubah Armada" },
    { value: "reject", label: "Tolak Perubahan & Batalkan Armada" },
  ];

  // Initialize form with validation
  const formSchema = createFormSchema(armadaList);
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
    setValue(`armada_${armadaId}`, value);
    trigger(`armada_${armadaId}`);
  };

  const handleBulkResponse = (value) => {
    setBulkResponse(value);
    // Apply to all armada
    armadaList.forEach((armada) => {
      setValue(`armada_${armada.id}`, value);
    });
    // Trigger validation for all fields
    trigger();
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

      toast.success("Respon berhasil disimpan sebagai draf");
    } catch (error) {
      toast.error("Gagal menyimpan draf. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
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

      toast.success("Respon perubahan berhasil dikirim");
      // Optionally navigate back or reset form
    } catch (error) {
      toast.error("Gagal mengirim respon. Silakan coba lagi.");
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
      toast.error("Respon perubahan wajib diisi");
    } else {
      // Some responses are missing
      toast.error("Respon perubahan wajib terisi semua");
    }

    console.log("Validation errors:", errors);
  });

  const getStatusBadgeVariant = (status) => {
    const statusVariants = {
      "Armada Dijadwalkan": "primary",
      "Menuju ke Lokasi Muat": "warning",
      "Tiba di Lokasi Muat": "success",
      "Antri di Lokasi Muat": "warning",
    };
    return statusVariants[status] || "neutral";
  };

  const breadcrumbData = [
    { name: "Monitoring", href: "/monitoring" },
    { name: "Daftar Pesanan Aktif", href: "/monitoring" },
    { name: "Respon Perubahan" },
  ];

  return (
    <div className="mx-auto flex h-full max-w-[1200px] flex-col py-6">
      {/* Header */}
      <div className="">
        <div className="flex flex-col gap-4">
          <BreadCrumb data={breadcrumbData} />

          <div className="flex items-center justify-between">
            <PageTitle withBack className="mb-0">
              Respon Perubahan
            </PageTitle>

            <div className="flex items-center gap-3">
              <Button
                variant="muattrans-primary-secondary"
                onClick={() => setIsChangeModalOpen(true)}
                className="h-10 px-4"
              >
                Lihat Perubahan
              </Button>
              <Button
                variant="muattrans-primary-secondary"
                onClick={() =>
                  router.push(
                    `/transporter/monitoring/${params.uuid}/detail-pesanan`
                  )
                }
                className="h-10 px-4"
              >
                Detail Pesanan
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
            <p className="mb-3 pt-0.5">Pemberitahuan:</p>
            <ul className="mt-1 list-disc pl-5">
              <li>
                Terdapat perubahan pesanan dari shipper, mohon pelajari
                perubahannya dan segera beri respon.
              </li>
              <li>
                Jika kamu melakukan penolakan pada satu armada atau lebih, maka
                akan ada penyesuaian pendapatan.
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
                placeholder="Cari No. Polisi / Nama Driver"
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
                    placeholder="Atur Respon Massal"
                    contentWidth="242px"
                    className="text-neutral-900"
                  />
                </div>
                <Button
                  variant="muattrans-primary-secondary"
                  onClick={handleSaveAsDraft}
                  disabled={isLoading}
                  className="h-10 px-6"
                >
                  {isLoading ? "Menyimpan..." : "Simpan sebagai Draf"}
                </Button>
                <Button
                  variant="muattrans-primary"
                  onClick={handleSubmitResponse}
                  disabled={isLoading}
                  className="h-10 px-6"
                >
                  {isLoading ? "Mengirim..." : "Kirim Respon"}
                </Button>
              </div>
            </div>
          </div>

          {/* Armada List Header */}
          <div className="grid grid-cols-3 items-center gap-9 px-6 text-xs font-bold text-neutral-600">
            <div>Daftar Armada ({filteredArmada.length} Armada)</div>
            <div className="">Armada Pengganti</div>
            <div className="">Pilih Respon Perubahan</div>
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
                  className="flex items-center justify-between rounded-xl border border-neutral-400 p-4"
                >
                  <div className="flex w-[340px] items-center gap-3">
                    {/* Truck Image */}
                    <div className="relative flex h-[56px] w-[56px] items-center justify-center overflow-hidden rounded-[4px] border border-neutral-400 bg-white">
                      <img
                        src={`/img/mock-armada/${armada.id === 1 ? "one" : armada.id === 2 ? "two" : armada.id === 3 ? "three" : armada.id === 4 ? "four" : armada.id === 5 ? "five" : "six"}.png`}
                        alt={`Truck ${armada.plateNumber}`}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div className="hidden h-full w-full items-center justify-center">
                        <IconComponent
                          src="/icons/monitoring/daftar-pesanan-aktif/truck.svg"
                          className="h-8 w-8 text-gray-600"
                        />
                      </div>
                    </div>

                    {/* Armada Info */}
                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-1">
                        <span className="text-xs font-bold text-black">
                          {armada.plateNumber}
                        </span>
                        <span className="text-xs font-semibold text-neutral-800">
                          - {armada.driverName}
                        </span>
                      </div>
                      <BadgeStatus
                        variant={getStatusBadgeVariant(armada.status)}
                        className="w-auto"
                      >
                        {armada.status}
                      </BadgeStatus>
                    </div>
                  </div>

                  {/* Info Message for Accept Response */}
                  {formValues[`armada_${armada.id}`] === "accept" && (
                    <div className="flex flex-1 items-center gap-6">
                      <IconComponent
                        src="/icons/arrow-right.svg"
                        className="h-4 w-4 text-success-600"
                      />
                      <span className="w-[340px] text-xs font-semibold text-success-400">
                        Tidak ada perubahan armada dan akan ada penyesuaian
                        pendapatan
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
                      placeholder="Pilih Respon Perubahan"
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
    </div>
  );
};

export default ResponPerubahanPage;
