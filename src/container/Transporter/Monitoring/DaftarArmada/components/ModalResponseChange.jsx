"use client";

import { AlertTriangle, MapPin } from "lucide-react";

import {
  Modal,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/Modal/Modal";

export default function ModalResponseChange({
  open,
  onOpenChange,
  changeData,
  onRespond,
}) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="w-[520px] max-w-full">
        <ModalHeader />

        <div className="px-6 py-4">
          {/* Banner Warning */}
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-warning-50 p-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-warning-500" />
            <p className="text-sm text-neutral-800">
              Terdapat perubahan pesanan dari shipper, mohon pelajari
              perubahannya dan segera beri respon
            </p>
          </div>

          <ModalTitle className="mb-4 text-center text-base font-bold">
            Informasi Perubahan Pesanan
          </ModalTitle>

          {/* Perubahan Waktu Muat */}
          <div className="mb-4 rounded-lg border border-neutral-200">
            <div className="border-b border-neutral-200 p-3">
              <p className="text-sm font-semibold text-neutral-900">
                Perubahan Waktu Muat
              </p>
            </div>
            <div className="flex justify-between px-3 py-2 text-sm">
              <div>
                <p className="text-neutral-500">Waktu Muat Awal</p>
                <p className="font-medium">{changeData.oldLoadTime}</p>
              </div>
              <div className="text-right">
                <p className="text-neutral-500">Waktu Muat Baru</p>
                <p className="font-medium">{changeData.newLoadTime}</p>
              </div>
            </div>
          </div>

          {/* Perubahan Rute Muat & Bongkar */}
          <div className="mb-4 rounded-lg border border-neutral-200">
            <div className="border-b border-neutral-200 p-3">
              <p className="text-sm font-semibold text-neutral-900">
                Perubahan Rute Muat & Bongkar
              </p>
            </div>
            <div className="px-3 py-2 text-sm">
              {/* Rute Awal */}
              <div className="mb-2">
                <p className="text-neutral-500">
                  Rute Awal • Estimasi {changeData.oldDistance}
                </p>
                <div className="mt-1 flex items-center gap-2 text-neutral-800">
                  <MapPin className="h-4 w-4 text-primary-500" />
                  {changeData.oldRoute}
                </div>
              </div>
              {/* Rute Baru */}
              <div>
                <p className="text-neutral-500">
                  Rute Baru • Estimasi {changeData.newDistance}
                </p>
                <div className="mt-1 flex items-center gap-2 text-neutral-800">
                  <MapPin className="h-4 w-4 text-primary-500" />
                  {changeData.newRoute}
                </div>
              </div>
            </div>
          </div>

          {/* Penyesuaian Pendapatan */}
          <div className="mb-6 flex items-center justify-between rounded-lg bg-neutral-100 px-3 py-2 text-sm font-semibold">
            <span>Penyesuaian Pendapatan</span>
            <span>
              <span className="text-neutral-500 line-through">
                {changeData.oldIncome}
              </span>{" "}
              <span className="text-success-600">{changeData.newIncome}</span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <ModalClose asChild>
              <button className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100">
                Batal
              </button>
            </ModalClose>
            <button
              className="flex-1 rounded-lg bg-warning-500 px-4 py-2 text-sm font-medium text-white hover:bg-warning-600"
              onClick={onRespond}
            >
              Respon Perubahan
            </button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
