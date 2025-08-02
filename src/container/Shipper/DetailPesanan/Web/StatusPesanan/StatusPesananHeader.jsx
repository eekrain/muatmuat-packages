import { useMemo, useState } from "react";

import { ChevronDown } from "lucide-react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { useTranslation } from "@/hooks/use-translation";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { getStatusPesananMetadata } from "@/lib/normalizers/detailpesanan/getStatusPesananMetadata";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

import { DriverStatusCardItem } from "./DriverStatusCard";
import { ModalDetailAlasanPembatalan } from "./ModalDetailAlasanPembatalan";
import { ModalLihatStatusLainnya } from "./ModalLihatStatusLainnya";

const dummyPhoto = [
  "/img/muatan1.png",
  "/img/muatan2.png",
  "/img/muatan3.png",
  "/img/muatan4.png",
];

export const StatusPesananHeader = ({ dataStatusPesanan }) => {
  const { t } = useTranslation();

  const [isModalAllDriverOpen, setIsModalAllDriverOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const copyAllDriverQRCodeLink = () => {
    const orderId = dataStatusPesanan.orderId;
    const qrCodeLink = `${window.location.origin}/orders/${orderId}/qr-code`;
    navigator.clipboard.writeText(qrCodeLink);
    toast.success(
      t(
        "StatusPesananHeader.toastQRCodeBerhasilDisalin",
        {},
        "Link QR Code Semua Driver Berhasil Disalin"
      )
    );
    setIsModalAllDriverOpen(false);
  };

  const statusMeta = getStatusPesananMetadata({
    orderStatus: dataStatusPesanan.orderStatus,
    unitFleetStatus: dataStatusPesanan.unitFleetStatus,
    totalUnit: dataStatusPesanan.totalUnit,
    t,
  });

  return (
    <div className="flex w-full items-end gap-x-3">
      <div className="grid flex-1 grid-cols-[220px_1fr] items-center gap-x-3 gap-y-2">
        <span className="text-xs font-medium leading-[1.2] text-neutral-600">
          {t("StatusPesananHeader.labelKodePesanan", {}, "Kode Pesanan")}
        </span>

        <span className="text-xs font-medium leading-[1.2] text-neutral-600">
          {t("StatusPesananHeader.labelStatusPesanan", {}, "Status Pesanan")}
        </span>

        <span className="text-sm font-bold leading-[16.8px] text-neutral-900">
          {dataStatusPesanan.orderCode}
        </span>

        <div className="flex items-center gap-x-2">
          <div
            className={cn(
              "flex items-center gap-x-2",
              dataStatusPesanan.orderStatus.startsWith("CANCELED") &&
                dataStatusPesanan.cancellationHistory &&
                "gap-x-5"
            )}
          >
            <BadgeStatusPesanan variant={statusMeta.variant} className="w-fit">
              {statusMeta.label}
            </BadgeStatusPesanan>
            {dataStatusPesanan.orderStatus.startsWith("CANCELED") &&
            dataStatusPesanan.cancellationHistory ? (
              <ModalDetailAlasanPembatalan
                cancellationHistory={dataStatusPesanan.cancellationHistory}
              />
            ) : dataStatusPesanan.otherStatus.length > 1 ? (
              <ModalLihatStatusLainnya
                otherStatus={dataStatusPesanan.otherStatus}
              />
            ) : null}
          </div>
          {dataStatusPesanan.orderStatus ===
          OrderStatusEnum.DOCUMENT_DELIVERY ? (
            <Modal closeOnOutsideClick>
              <ModalTrigger>
                <button className="flex items-center gap-x-1">
                  <span className="text-xs font-medium leading-[14.4px] text-primary-700">
                    {t(
                      "StatusPesananHeader.linkLihatBuktiPengiriman",
                      {},
                      "Lihat Bukti Pengiriman"
                    )}
                  </span>
                  <IconComponent
                    src="/icons/chevron-right.svg"
                    className="icon-blue"
                  />
                </button>
              </ModalTrigger>
              <ModalContent type="muatmuat">
                <div className="flex w-[472px] flex-col gap-y-6 px-6 py-8">
                  <h1 className="text-center text-base font-bold leading-[19.2px] text-neutral-900">
                    {t(
                      "StatusPesananHeader.modalTitleBuktiPengiriman",
                      {},
                      "Bukti Pengiriman Dokumen"
                    )}
                  </h1>
                  <div className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-3">
                      <span className="text-xs font-semibold leading-[14.4px] text-neutral-900">
                        {t("StatusPesananHeader.labelTanggal", {}, "Tanggal")}
                      </span>
                      <span className="text-xs font-medium leading-[14.4px] text-neutral-600">
                        04 Okt 2024 18:00 WIB
                      </span>
                    </div>
                    <div className="flex flex-col gap-y-3">
                      <span className="text-xs font-semibold leading-[14.4px] text-neutral-900">
                        {t(
                          "StatusPesananHeader.labelFotoBuktiPengiriman",
                          {},
                          "Foto Bukti Pengiriman"
                        )}
                      </span>
                      <div className="flex items-center gap-x-4">
                        <LightboxProvider
                          image={
                            dummyPhoto.length === 1 ? dummyPhoto[0] : undefined
                          }
                          images={
                            dummyPhoto.length > 1 ? dummyPhoto : undefined
                          }
                          title={t(
                            "StatusPesananHeader.labelFotoBuktiPengiriman",
                            {},
                            "Foto Bukti Pengiriman"
                          )}
                        >
                          {dummyPhoto.map((image, index) => (
                            <LightboxPreview
                              key={image}
                              image={image}
                              alt={`${t(
                                "StatusPesananHeader.altDokumen",
                                { index: index + 1 },
                                "Dokumen {index}"
                              )}`}
                              className="size-[56px]"
                            />
                          ))}
                        </LightboxProvider>
                      </div>
                    </div>
                    {/* LOGIC BUAT ADA CATATAN ATAU TIDAK */}
                    {true ? (
                      <div className="flex flex-col gap-y-3">
                        <span className="text-xs font-semibold leading-[14.4px] text-neutral-900">
                          {t("StatusPesananHeader.labelCatatan", {}, "Catatan")}
                        </span>
                        <p className="text-xs font-medium leading-[14.4px] text-neutral-600">
                          {t(
                            "StatusPesananHeader.textCatatanContoh",
                            {},
                            "Kami informasikan bahwa dokumen telah kami kirim dan saat ini sudah diterima oleh Bapak Ervin Sudjatmiko. Mohon konfirmasi apabila ada hal yang perlu ditindaklanjuti lebih lanjut. Kami siap membantu apabila dibutuhkan klarifikasi atau kelengkapan tambahan. Terima kasih atas perhatian dan kerja samanya."
                          )}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </ModalContent>
            </Modal>
          ) : null}
        </div>
      </div>

      {dataStatusPesanan.driverStatus.length > 1 && (
        <div className="w-[127px]">
          <SimpleDropdown onOpenChange={setIsDropdownOpen}>
            <SimpleDropdownTrigger asChild>
              <button
                className={cn(
                  "flex h-8 flex-row items-center justify-between gap-2 rounded-md border bg-white px-3 py-2 shadow-sm transition-colors duration-150 focus:outline-none",
                  isDropdownOpen
                    ? "border-primary-700 bg-gray-50"
                    : "border-neutral-600 hover:border-primary-700 hover:bg-gray-50"
                )}
              >
                <span className="text-nowrap text-xs font-medium leading-tight text-black">
                  {t(
                    "StatusPesananHeader.buttonMenuLainnya",
                    {},
                    "Menu Lainnya"
                  )}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-neutral-700 transition-transform duration-150",
                    isDropdownOpen && "rotate-180"
                  )}
                />
              </button>
            </SimpleDropdownTrigger>

            <SimpleDropdownContent className="max-w-[198px]">
              <SimpleDropdownItem onClick={() => setIsModalAllDriverOpen(true)}>
                {t(
                  "StatusPesananHeader.menuLihatSemuaDriver",
                  {},
                  "Lihat Semua Driver"
                )}
              </SimpleDropdownItem>
              {!dataStatusPesanan.orderStatus.startsWith("CANCELED") && (
                <SimpleDropdownItem onClick={copyAllDriverQRCodeLink}>
                  {t(
                    "StatusPesananHeader.menuBagikanQRCode",
                    {},
                    "Bagikan QR Code Semua Driver"
                  )}
                </SimpleDropdownItem>
              )}
            </SimpleDropdownContent>
          </SimpleDropdown>
        </div>
      )}

      <ModalAllDriver
        open={isModalAllDriverOpen}
        onOpenChange={setIsModalAllDriverOpen}
        driverStatus={dataStatusPesanan.driverStatus}
        orderId={dataStatusPesanan.orderId}
        orderStatus={dataStatusPesanan.orderStatus}
        copyAllDriverQRCodeLink={copyAllDriverQRCodeLink}
      />
    </div>
  );
};

const ModalAllDriver = ({
  open,
  onOpenChange,
  driverStatus = [],
  orderId,
  orderStatus,
  copyAllDriverQRCodeLink,
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filteredDriverStatus = useMemo(() => {
    return driverStatus.filter((driver) => {
      const byName = driver.name.toLowerCase().includes(search.toLowerCase());
      const byLicensePlate = driver.licensePlate
        .toLowerCase()
        .includes(search.toLowerCase());
      return byName || byLicensePlate;
    });
  }, [driverStatus, search]);

  return (
    <Modal open={open} onOpenChange={onOpenChange} closeOnOutsideClick>
      <ModalContent className="p-6">
        <h2 className="mb-3 text-center text-base font-bold leading-[1.2]">
          {t("StatusPesananHeader.modalTitleSemuaDriver", {}, "Semua Driver")}
        </h2>

        <div className="w-[810px] rounded-xl border border-neutral-600 pl-3 pt-3">
          <Input
            placeholder={t(
              "StatusPesananHeader.placeholderCariDriver",
              {},
              "Cari Nama Driver/Plat Nomor"
            )}
            icon={{ left: "/icons/search.svg" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3 w-[262px]"
          />
          <div className="pr-[4px]">
            <div className="flex max-h-[398px] flex-col gap-3 overflow-y-auto pb-3 pr-[7px]">
              {filteredDriverStatus.map((driver) => (
                <DriverStatusCardItem
                  key={driver.driverId}
                  driver={driver}
                  orderId={orderId}
                  orderStatus={orderStatus}
                />
              ))}
            </div>
          </div>
        </div>

        <Button
          variant="muatparts-primary"
          className="ml-auto mt-3"
          onClick={copyAllDriverQRCodeLink}
        >
          {t(
            "StatusPesananHeader.buttonBagikanQRCode",
            {},
            "Bagikan QR Code Semua Driver"
          )}
        </Button>
      </ModalContent>
    </Modal>
  );
};
