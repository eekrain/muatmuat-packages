import { useState } from "react";

import { ChevronDown } from "lucide-react";

import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  StepperContainer,
  StepperItem,
  StepperItemResponsive,
} from "@/components/Stepper/Stepper";
import useDevice from "@/hooks/use-device";

// --- Main Card Component ---

function CardLacakArmada({
  plateNumber,
  driverName,
  vehicleImageUrl,
  sosActive,
  onActionClick, // Prop ini mungkin tidak lagi relevan, tapi saya biarkan
  onViewSosClick,
}) {
  const { isMobile } = useDevice();

  const steps = [
    { label: "Armada Dijadwalkan", icon: "/icons/calendar16.svg" },
    { label: "Proses Muat", icon: "/icons/calendar16.svg" },
    { label: "Dalam Perjalanan", icon: "/icons/calendar16.svg" },
    { label: "Proses Bongkar", icon: "/icons/calendar16.svg" },
    { label: "Dokumen Disiapkan", icon: "/icons/calendar16.svg" },
    { label: "Selesai", icon: "/icons/calendar16.svg" },
  ];

  const [activeIndex, setActiveIndex] = useState(2);

  // Contoh fungsi untuk item dropdown
  const handleViewDetails = () => alert("Menampilkan detail perjalanan...");
  const handleContactDriver = () => alert("Menghubungi driver...");
  const handleShareLocation = () => alert("Membagikan lokasi...");

  return (
    <div className="border-netral-400 w-full rounded-xl border px-4 py-5">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100">
            Menuju ke Lokasi Bongkar
          </div>
          {true && (
            <>
              <div className="inline-flex items-center justify-center rounded-md bg-red-500 px-3 py-1 text-xs font-bold text-white">
                SOS
              </div>
              <button
                onClick={onViewSosClick}
                className="text-xs font-medium text-blue-600"
              >
                Lihat SOS
              </button>
            </>
          )}
        </div>

        <SimpleDropdown>
          <SimpleDropdownTrigger asChild>
            <button className="flex items-center rounded-lg border border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
              Aksi Lainnya
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
          </SimpleDropdownTrigger>
          <SimpleDropdownContent align="end">
            <SimpleDropdownItem onClick={handleViewDetails}>
              Ubah Armada
            </SimpleDropdownItem>
            <SimpleDropdownItem onClick={handleContactDriver}>
              Ubah Driver
            </SimpleDropdownItem>
            <SimpleDropdownItem onClick={handleShareLocation}>
              Batalkan Armada
            </SimpleDropdownItem>
          </SimpleDropdownContent>
        </SimpleDropdown>
      </div>

      {/* Main Content */}
      <div className="mt-4 flex items-start justify-between">
        {/* Vehicle & Driver Info */}
        <div className="flex items-center gap-4">
          <img
            src={"/img/depan.png"}
            alt="Truck"
            className="h-14 w-14 rounded-md bg-gray-100 object-cover"
          />
          <div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold text-neutral-900">
                {plateNumber || "B 1234 XYZ"}
              </p>
              <div className="flex items-center gap-1">
                <IconComponent
                  src={"/icons/user16.svg"}
                  width={16}
                  height={16}
                />
                <p className="text-xs font-medium text-neutral-900">
                  {driverName || "Budi Santoso"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stepper Implementation */}
        <div className="w-full max-w-lg">
          <StepperContainer totalStep={steps.length} activeIndex={activeIndex}>
            {steps.map((step, index) =>
              isMobile ? (
                <StepperItemResponsive key={index} step={step} index={index} />
              ) : (
                <StepperItem key={index} step={step} index={index} />
              )
            )}
          </StepperContainer>
        </div>
      </div>
    </div>
  );
}

export default CardLacakArmada;
