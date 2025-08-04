import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/Bottomsheet/BottomSheet";
import { useTranslation } from "@/hooks/use-translation";
import { idrFormat } from "@/lib/utils/formatters";

export const BottomsheetDetailPengirimanDokumen = ({
  open,
  onOpenChange,
  documentShippingDetail,
}) => {
  const { t } = useTranslation();

  const shippingData = documentShippingDetail;

  // Return null if no shipping data is provided
  if (!shippingData) {
    return null;
  }

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>Detail Pengiriman Dokumen</BottomSheetTitle>
        </BottomSheetHeader>

        <div className="mr-1 h-[68vh] overflow-y-auto pb-6 pl-4 pr-3 text-xs text-neutral-900">
          <div className="divide-y divide-neutral-200">
            {/* Recipient Info Section */}
            <div className="py-4 first:pt-0">
              <h3 className="mb-2 font-semibold">{t("Nama Penerima")}</h3>
              <p className="font-medium text-neutral-600">
                {shippingData.recipientName}
              </p>
            </div>

            <div className="py-4">
              <h3 className="mb-2 font-semibold">
                {t("Nomor Handphone Penerima")}
              </h3>
              <p className="font-medium text-neutral-600">
                {shippingData.recipientPhone}
              </p>
            </div>

            {/* Address Info Section */}
            <div className="py-4">
              <h3 className="mb-2 font-semibold">{t("Alamat Tujuan")}</h3>
              <p className="font-medium text-neutral-600">
                {shippingData.fullAddress}
              </p>
            </div>

            <div className="py-4">
              <h3 className="mb-2 font-semibold">
                {t("Detail Alamat Tujuan")}
              </h3>
              <p className="font-medium text-neutral-600">
                {shippingData.detailAddress}
              </p>
            </div>

            <div className="py-4">
              <h3 className="mb-2 font-semibold">{t("Kecamatan")}</h3>
              <p className="font-medium text-neutral-600">
                {shippingData.district}
              </p>
            </div>

            <div className="py-4">
              <h3 className="mb-2 font-semibold">{t("Kabupaten/Kota")}</h3>
              <p className="font-medium text-neutral-600">
                {shippingData.city}
              </p>
            </div>

            <div className="py-4">
              <h3 className="mb-2 font-semibold">{t("Provinsi")}</h3>
              <p className="font-medium text-neutral-600">
                {shippingData.province}
              </p>
            </div>

            <div className="py-4">
              <h3 className="mb-2 font-semibold">{t("Kode Pos")}</h3>
              <p className="font-medium text-neutral-600">
                {shippingData.postalCode}
              </p>
            </div>

            {/* Shipping Info Section */}
            <div className="py-4">
              <h3 className="mb-2 font-semibold">{t("Nama Ekspedisi")}</h3>
              <p className="font-medium text-neutral-600">
                {shippingData.courier}
              </p>
            </div>
            <div className="py-4 last:pb-0">
              <h3 className="mb-2 font-semibold">{t("Asuransi Pengiriman")}</h3>
              <p className="font-medium text-neutral-600">
                {idrFormat(shippingData.insurancePrice)}
              </p>
            </div>
          </div>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};
