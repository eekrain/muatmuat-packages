"use client";

import { AlertTriangle, ArrowRight, Info, MapPin } from "lucide-react";

import Button from "@/components/Button/Button";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalTitle,
} from "@/components/Modal/Modal";
import { useTranslation } from "@/hooks/use-translation";

export default function ModalResponseChange({
  open,
  onOpenChange,
  changeData,
  onRespond,
}) {
  const { t } = useTranslation();

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="w-[800px] max-w-full pt-6">
        <ModalTitle className="mb-6 text-center text-base font-bold">
          {t("ModalResponseChange.title", {}, "Informasi Perubahan Pesanan")}
        </ModalTitle>
        <div className="px-6 pb-4">
          {/* Banner Warning */}
          <div className="mb-4 flex h-14 items-start gap-2 rounded-lg bg-secondary-100 px-6 py-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-warning-500" />
            <p className="text-sm font-medium text-neutral-800">
              {t(
                "ModalResponseChange.warningMessage",
                {},
                "Terdapat perubahan pesanan dari shipper, mohon pelajari perubahannya dan segera beri respon"
              )}
            </p>
          </div>

          {/* Scrollable Changes Container with neutral-400 border */}
          <div className="mb-4 max-h-[200px] overflow-y-auto rounded-lg border border-neutral-400">
            <div className="space-y-4 px-4 py-1">
              {/* Perubahan Waktu Muat - only bottom border */}
              <div className="border-b border-neutral-200 pb-4">
                <div className="rounded-full bg-muat-trans-primary-400">
                  tes
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-neutral-900">
                    {t(
                      "ModalResponseChange.loadTimeChangeTitle",
                      {},
                      "Perubahan Waktu Muat"
                    )}
                  </p>
                </div>
                <div className="flex justify-between px-3 py-2 text-sm">
                  <div>
                    <p className="font-bold text-[#0FBB81]">
                      {t(
                        "ModalResponseChange.originalLoadTime",
                        {},
                        "Waktu Muat Awal"
                      )}
                    </p>
                    <p className="text-xs font-medium text-neutral-900">
                      {changeData.oldLoadTime}
                    </p>
                  </div>
                  <div className="w-1/2 border-l ps-6">
                    <p className="font-bold text-[#7A360D]">
                      {t(
                        "ModalResponseChange.newLoadTime",
                        {},
                        "Waktu Muat Baru"
                      )}
                    </p>
                    <p className="text-xs font-medium text-neutral-900">
                      {changeData.newLoadTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Perubahan Rute Muat & Bongkar - only bottom border */}
              <div className="border-b border-neutral-200 pb-4">
                <div className="p-3">
                  <p className="text-sm font-semibold text-neutral-900">
                    {t(
                      "ModalResponseChange.routeChangeTitle",
                      {},
                      "Perubahan Rute Muat & Bongkar"
                    )}
                  </p>
                </div>
                <div className="px-3 py-2 text-sm">
                  {/* Rute Awal */}
                  <div className="mb-4">
                    <p className="text-neutral-500">
                      {t(
                        "ModalResponseChange.originalRoute",
                        { distance: changeData.oldDistance },
                        `Rute Awal • Estimasi ${changeData.oldDistance}`
                      )}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-neutral-800">
                      <MapPin className="h-4 w-4 text-primary-500" />
                      {changeData.oldRoute}
                    </div>
                  </div>
                  {/* Rute Baru */}
                  <div>
                    <p className="text-neutral-500">
                      {t(
                        "ModalResponseChange.newRoute",
                        { distance: changeData.newDistance },
                        `Rute Baru • Estimasi ${changeData.newDistance}`
                      )}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-neutral-800">
                      <MapPin className="h-4 w-4 text-primary-500" />
                      {changeData.newRoute}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Penyesuaian Pendapatan with neutral-400 border */}
          <div className="mb-6 flex h-[49px] items-center justify-around rounded-lg border border-neutral-400 px-3 py-2 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-semibold">
                {t(
                  "ModalResponseChange.incomeAdjustment",
                  {},
                  "Penyesuaian Pendapatan"
                )}
              </span>
              <InfoTooltip
                trigger={<Info className="h-4 w-4 text-neutral-500" />}
              >
                {t(
                  "ModalResponseChange.incomeAdjustmentTooltip",
                  {},
                  "Perubahan pendapatan berdasarkan perubahan rute dan waktu."
                )}
              </InfoTooltip>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-900 line-through">
                {changeData.oldIncome}
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-500" />
              <span className="font-bold text-neutral-900">
                {changeData.newIncome}
              </span>
            </div>
          </div>

          {/* Centered Actions */}
          <div className="flex justify-center gap-3">
            <ModalClose asChild>
              <Button variant="muattrans-primary-secondary">
                {t("ModalResponseChange.cancelButton", {}, "Batal")}
              </Button>
            </ModalClose>
            <Button onClick={onRespond}>
              {t("ModalResponseChange.respondButton", {}, "Respon Perubahan")}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
