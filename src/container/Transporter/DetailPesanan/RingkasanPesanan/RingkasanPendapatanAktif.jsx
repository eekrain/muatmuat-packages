import { useState } from "react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import CardPayment from "@/components/Card/CardPayment";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal";
import { ModalTitle, ModalTrigger } from "@/components/Modal/Modal";

import { useTranslation } from "@/hooks/use-translation";

import { idrFormat } from "@/lib/utils/formatters";

import { ORDER_STATUS } from "@/utils/Transporter/orderStatus";

const RingkasanPendapatanAktif = ({ dataOrderDetail }) => {
  const [showDetail, setShowDetail] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="sticky top-[120px] h-fit min-w-[338px]">
      <CardPayment.Root className="max-h-[357px] flex-1 overflow-y-auto">
        <CardPayment.Header>Ringkasan Pendapatan</CardPayment.Header>
        <CardPayment.Body>
          <CardPayment.CollapsibleSection title={t("titleDetailPesanan")}>
            <CardPayment.Section title={"Pesanan Jasa Angkut"}>
              <CardPayment.LineItem
                // 25. 30 - Web - LB - 0253
                label={`Nominal Pesanan Jasa Angkut (${dataOrderDetail?.truckCount} Unit)`}
                labelClassName="max-w-[170px]"
                value={idrFormat(dataOrderDetail?.incomeSummary.transportFee)}
              />
            </CardPayment.Section>
            <CardPayment.Section title={"Layanan Tambahan"}>
              <CardPayment.LineItem
                label={t("labelNominalBantuanTambahan")}
                value={idrFormat(
                  dataOrderDetail?.incomeSummary.additionalServiceFee
                )}
              />
            </CardPayment.Section>
            <CardPayment.Section title="Potongan PPh">
              <CardPayment.LineItem
                label="Nominal Potongan PPh"
                value={`-${idrFormat(dataOrderDetail?.incomeSummary.taxAmount)}`}
                valueClassName="text-error-400"
              />
            </CardPayment.Section>
            <CardPayment.LineItem
              className="mt-3"
              labelClassName="text-sm font-semibold text-neutral-900"
              valueClassName="text-sm font-semibold text-neutral-900"
              label="Sub Total"
              value={idrFormat(dataOrderDetail?.incomeSummary.totalPrice)}
            />
          </CardPayment.CollapsibleSection>
          <CardPayment.CollapsibleSection
            title={"Detail Penyesuaian Pendapatan"}
          >
            <CardPayment.Section title={"Total Perubahan Rute"}>
              <CardPayment.LineItem
                label={"Nominal Selisih Jarak Perubahan Lokasi Bongkar"}
                labelClassName="max-w-[160px]"
                value={idrFormat(
                  dataOrderDetail?.incomeSummary.totalRouteChange
                )}
              />
              {dataOrderDetail?.orderStatus ===
                ORDER_STATUS.CANCELLED_BY_TRANSPORTER && (
                <>
                  <CardPayment.LineItem
                    label={"Nominal Bantuan Tambahan"}
                    labelClassName="max-w-[160px]"
                    value={`-${idrFormat(dataOrderDetail?.incomeSummary.additionalServiceFee)}`}
                    valueClassName="text-error-400"
                  />
                  <CardPayment.LineItem
                    label={"Nominal Potongan PPh"}
                    labelClassName="max-w-[160px]"
                    value={idrFormat(
                      dataOrderDetail?.incomeSummary.additionalServiceFee
                    )}
                  />
                  <Modal
                    open={showDetail}
                    onOpenChange={setShowDetail}
                    closeOnOutsideClick
                  >
                    <ModalTrigger asChild>
                      <p className="cursor-pointer text-xs font-medium text-primary-700">
                        Lihat Detail Pembatalan
                      </p>
                    </ModalTrigger>

                    <ModalContent
                      type="muatmuat"
                      className="w-[600px] max-w-[90vw]"
                    >
                      <div className="p-6">
                        <ModalTitle className="mb-4 text-center text-base font-bold">
                          Detail Pembatalan
                        </ModalTitle>
                        <div>
                          <div
                            className={
                              "mb-3 flex items-center gap-[2px] rounded-lg bg-secondary-100 p-2 text-xs font-semibold text-neutral-900"
                            }
                          >
                            <IconComponent
                              src={"/icons/warning-kuning.svg"}
                              className={"mr-1 flex-shrink-0"}
                              width={14}
                              height={14}
                            />
                            Nominal penyesuaian pendapatan dapat bervariasi,
                            tergantung pada status armada saat pembatalan maupun
                            adanya perubahan lokasi bongkar oleh shipper
                          </div>
                          <div>
                            <p className="mb-4 text-xs font-medium text-neutral-600">
                              Armada dan status saat pembatalan
                            </p>
                            <div className="mb-6 flex items-center gap-4 border-b border-neutral-400 pb-4">
                              <img
                                src={"/img/depan.png"}
                                alt="Truck"
                                className="h-14 w-14 rounded-md bg-gray-100 object-cover"
                              />
                              <div className="w-full space-y-3">
                                <div className="flex w-full items-center justify-between gap-2">
                                  <p className="text-xs font-semibold text-neutral-900">
                                    <span className="font-bold">
                                      {dataOrderDetail?.fleets?.[0]
                                        ?.licensePlate || "B 1234 XYZ"}
                                    </span>{" "}
                                    -{" "}
                                    {dataOrderDetail?.fleets?.[0]?.driver
                                      ?.name || "Budi Santoso"}
                                  </p>
                                  <p className="text-xs font-medium text-error-400">
                                    -Rp400.000
                                  </p>
                                </div>
                                <BadgeStatus
                                  variant="primary"
                                  className={"w-max"}
                                >
                                  Armada Dijadwalkan
                                </BadgeStatus>
                              </div>
                            </div>
                            <div className="flex w-full items-center justify-between gap-2 font-bold">
                              <p>Total</p>
                              <p>-Rp400.000</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ModalContent>
                  </Modal>
                </>
              )}
            </CardPayment.Section>
          </CardPayment.CollapsibleSection>
          <CardPayment.LineItem
            className="mt-3"
            labelClassName="text-sm font-semibold text-neutral-900"
            valueClassName="text-sm font-semibold text-neutral-900"
            label="Sub Total"
            value={idrFormat(dataOrderDetail?.incomeSummary.totalPrice)}
          />
        </CardPayment.Body>
        <CardPayment.Footer>
          <CardPayment.Total
            label="Total Pendapatan"
            value={idrFormat(dataOrderDetail?.incomeSummary.totalPrice)}
          />
        </CardPayment.Footer>
      </CardPayment.Root>
    </div>
  );
};

export default RingkasanPendapatanAktif;
