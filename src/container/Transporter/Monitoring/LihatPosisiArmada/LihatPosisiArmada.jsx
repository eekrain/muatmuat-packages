"use client";

import IconComponent from "@/components/IconComponent/IconComponent";

const LihatPosisiArmada = ({ onClose, orderData }) => {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4">
        <div className="flex flex-col">
          <h3 className="text-sm font-bold">Lihat Posisi Armada</h3>
          {orderData && (
            <span className="text-xs text-gray-500">
              Pesanan: {orderData.orderCode}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100"
        >
          <IconComponent
            src="/icons/monitoring/collapse.svg"
            className="h-5 w-5"
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        <div className="space-y-4">
          {/* Fleet Position List */}
          <div className="rounded-lg border border-neutral-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold">Armada 1</span>
              <span className="text-xs text-gray-500">
                Sedang Menuju Lokasi
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">No. Polisi:</span>
                <span className="font-medium">B 1234 ABC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Driver:</span>
                <span className="font-medium">John Doe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Posisi Terakhir:</span>
                <span className="font-medium">Jl. Sudirman No. 123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Waktu Update:</span>
                <span className="font-medium">2 menit yang lalu</span>
              </div>
            </div>
          </div>

          {/* You can add more fleet cards here */}
          <div className="rounded-lg border border-neutral-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold">Armada 2</span>
              <span className="text-xs text-gray-500">Tiba di Lokasi Muat</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">No. Polisi:</span>
                <span className="font-medium">B 5678 DEF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Driver:</span>
                <span className="font-medium">Jane Smith</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Posisi Terakhir:</span>
                <span className="font-medium">Warehouse A - Gate 2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Waktu Update:</span>
                <span className="font-medium">Baru saja</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-neutral-200 p-4">
        <button
          className="w-full rounded-lg bg-primary-500 py-2 text-xs font-semibold text-white hover:bg-primary-600"
          onClick={() => {
            console.log("Refresh positions");
          }}
        >
          Refresh Posisi
        </button>
      </div>
    </div>
  );
};

export default LihatPosisiArmada;
