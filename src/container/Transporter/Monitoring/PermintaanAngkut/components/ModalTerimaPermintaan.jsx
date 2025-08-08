import { useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { toast } from "@/lib/toast";

const ModalTerimaPermintaan = ({ isOpen, onClose, request, onAccept }) => {
  const [selectedOption, setSelectedOption] = useState("all"); // "all" or "partial"
  const [partialCount, setPartialCount] = useState(1);
  const [acceptTerms, setAcceptTerms] = useState(false);

  if (!isOpen) return null;

  const handleAccept = () => {
    if (selectedOption === "partial" && partialCount < 1) {
      toast.error("Jumlah armada minimal 1 unit");
      return;
    }

    if (!acceptTerms) {
      toast.error("Harap setujui Syarat dan Ketentuan Muatrans");
      return;
    }

    const acceptData = {
      requestId: request.id,
      type: selectedOption,
      truckCount: selectedOption === "all" ? request.truckCount : partialCount,
    };

    onAccept(acceptData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="flex h-[460px] w-full max-w-[600px] flex-col rounded-xl bg-white p-4">
        <div className="mb-3 flex flex-shrink-0 items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">
            Terima Permintaan Jasa Angkut
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <IconComponent src="/icons/close24.svg" className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="mb-3">
            <div className="mb-3 rounded-lg bg-gray-50 p-3">
              <span className="text-sm font-medium text-gray-600">
                Kebutuhan Armada
              </span>
              <span className="ml-2 text-sm font-bold text-gray-900">
                {request.truckCount || 2} Unit
              </span>
            </div>

            <div className="space-y-3">
              <label className="flex cursor-pointer items-center">
                <input
                  type="radio"
                  name="acceptOption"
                  value="all"
                  checked={selectedOption === "all"}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="mr-3 h-4 w-4 text-primary-600"
                />
                <span className="text-sm font-medium text-gray-900">
                  Terima semua kebutuhan armada
                </span>
              </label>

              <label className="flex cursor-pointer items-start">
                <input
                  type="radio"
                  name="acceptOption"
                  value="partial"
                  checked={selectedOption === "partial"}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="mr-3 mt-0.5 h-4 w-4 text-primary-600"
                />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      Terima dengan
                    </span>
                    <input
                      type="number"
                      min="1"
                      max={request.truckCount || 2}
                      value={partialCount}
                      onChange={(e) =>
                        setPartialCount(
                          Math.min(
                            parseInt(e.target.value) || 1,
                            request.truckCount || 2
                          )
                        )
                      }
                      disabled={selectedOption !== "partial"}
                      className="w-20 rounded border border-gray-300 px-3 py-2 text-center text-sm disabled:bg-gray-100"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      unit armada
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="mb-4 rounded-lg bg-blue-50 p-3">
            <div className="mb-2 text-sm font-semibold text-gray-900">
              Informasi Pesanan
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex flex-wrap gap-2">
                <span className="rounded bg-blue-100 px-3 py-1.5 text-center font-semibold text-blue-700">
                  Terjadwal
                </span>
                <span className="rounded bg-green-100 px-3 py-1.5 font-semibold text-green-700">
                  Muat 5 Hari Lagi
                </span>
                <span className="rounded bg-red-100 px-3 py-1.5 font-semibold text-red-700">
                  Potensi Overload
                </span>
              </div>
            </div>
            <div className="mt-3 text-right">
              <span className="text-sm font-bold text-blue-700">
                Potensi Pendapatan
              </span>
              <div className="text-xl font-bold text-blue-700">
                Rp999.999.999
              </div>
            </div>
          </div>

          <div className="mb-3 space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <IconComponent
                src="/icons/location.svg"
                className="h-5 w-5 text-yellow-500"
              />
              <span>Kota Surabaya, Kec. Tegalsari</span>
            </div>
            <div className="flex items-center gap-3">
              <IconComponent
                src="/icons/location.svg"
                className="h-5 w-5 text-red-500"
              />
              <span>Kab. Pasuruan, Kec. Klojen</span>
            </div>
          </div>

          <div className="mb-3 text-sm text-gray-600">
            <span className="font-medium">Estimasi Jarak:</span>
            <span className="ml-2">121 km</span>
          </div>

          <div className="mb-4 text-sm text-gray-600">
            <span>Informasi Muatan (Total: 2.500 kg)</span>
          </div>

          <div className="mb-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-primary-600"
              />
              <span className="text-sm text-gray-600">
                Saya menyetujui{" "}
                <span className="font-medium text-primary-600 underline">
                  Syarat dan Ketentuan Muatrans
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className="flex flex-shrink-0 gap-3 pt-3">
          <Button
            variant="muattrans-error-secondary"
            className="flex-1 py-2 text-sm font-semibold"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            variant="muattrans-primary"
            className="flex-1 py-2 text-sm font-semibold"
            onClick={handleAccept}
            disabled={!acceptTerms}
          >
            Terima
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalTerimaPermintaan;
