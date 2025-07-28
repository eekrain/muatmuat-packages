import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { useTranslation } from "@/hooks/use-translation";
import { useSewaArmadaActions } from "@/store/Shipper/forms/sewaArmadaStore";

const UpdateOrderSummaryPanel = ({ calculatedPrice }) => {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { setUpdateOrderSuccess } = useSewaArmadaActions();
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  // const priceSummary = useShallowMemo(() => {
  //   if (!calculatedPrice || !truckTypeId) {
  //     return [];
  //   }
  //   return [
  //     {
  //       title: "Biaya Pesan Jasa Angkut",
  //       items: [
  //         {
  //           label: `Nominal Pesan Jasa Angkut (${truckCount} Unit)`,
  //           price: calculatedPrice.transportFee,
  //         },
  //       ],
  //     },
  //     {
  //       title: "Biaya Asuransi Barang",
  //       items: [
  //         {
  //           label: "Nominal Premi Asuransi (1 Unit)",
  //           price: calculatedPrice.insuranceFee,
  //         },
  //       ],
  //     },
  //     ...(calculatedPrice.additionalServiceFee.length > 0
  //       ? [
  //           {
  //             title: "Biaya Layanan Tambahan",
  //             items: calculatedPrice.additionalServiceFee.map((item) => ({
  //               label: item.name,
  //               price: item.totalCost,
  //             })),
  //           },
  //         ]
  //       : []),
  //     ...(selectedVoucherDetails
  //       ? [
  //           {
  //             title: "Diskon Voucher",
  //             items: [
  //               {
  //                 label: `Voucher (${selectedVoucherDetails.code})`,
  //                 price: calculatedPrice.voucher || voucherDiscount,
  //               },
  //             ],
  //           },
  //         ]
  //       : []),
  //     {
  //       title: "Biaya Lainnya",
  //       items: [
  //         {
  //           label: "Admin Layanan",
  //           price: calculatedPrice.adminFee,
  //         },
  //         {
  //           label: "Pajak",
  //           price: calculatedPrice.taxAmount,
  //         },
  //       ],
  //     },
  //   ];
  // }, [
  //   calculatedPrice,
  //   truckTypeId,
  //   truckCount,
  //   selectedVoucherDetails,
  //   voucherDiscount,
  // ]);

  const handleUpdateOrder = () => {
    setUpdateOrderSuccess(true);
    router.push(`/daftarpesanan/detailpesanan/${params.orderId}`);
  };

  return (
    <>
      <Card className="shadow-muat sticky top-[124px] flex w-[338px] flex-col gap-0 rounded-xl border-none bg-white">
        <div className="flex flex-col gap-y-6 px-5 py-6 text-neutral-900">
          <div className="border-b border-b-neutral-400 pb-6">
            <span className="text-base font-bold leading-[19.2px]">
              Detail Tambahan Biaya
            </span>
          </div>
          <div className="flex justify-between">
            <div className="max-w-[148px] text-base font-bold leading-[19.2px]">
              Total Tambahan Biaya
            </div>
            <span className="text-base font-bold leading-[19.2px]">
              {
                "Rp0"
                // calculatedPrice
                //   ? `Rp${calculatedPrice.totalPrice.toLocaleString("id-ID")}`
                //   : "Rp0"
                // `Rp${currentTotal.toLocaleString("id-ID")}`
              }
            </span>
          </div>
          <Button
            variant="muatparts-primary"
            onClick={() => setConfirmationModalOpen(true)}
          >
            Lanjut
          </Button>
        </div>
      </Card>

      <ConfirmationModal
        size="big"
        isOpen={isConfirmationModalOpen}
        setIsOpen={setConfirmationModalOpen}
        title={{
          text: t("titleInformasi"),
        }}
        description={{
          text: (
            <>
              {t("messageKonfirmasiUpdateOrder1")}{" "}
              <b>{t("messageKonfirmasiUpdateOrderBold")}</b>{" "}
              {t("messageKonfirmasiUpdateOrder2")}
            </>
          ),
        }}
        cancel={{
          text: t("buttonKembali"),
        }}
        confirm={{
          text: t("buttonSimpanPerubahan"),
          onClick: handleUpdateOrder,
        }}
      />
    </>
  );
};

export default UpdateOrderSummaryPanel;
