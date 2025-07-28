import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { useSewaArmadaActions } from "@/store/Shipper/forms/sewaArmadaStore";

const UpdateOrderSummaryPanel = ({ calculatedPrice }) => {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { setUpdateOrderSuccess } = useSewaArmadaActions();
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  console.log("calculated", calculatedPrice);

  const priceSummary = useShallowMemo(() => {
    if (!calculatedPrice || calculatedPrice?.totalPrice <= 0) {
      return [];
    }
    return [
      {
        title: "Biaya Perubahan Rute",
        items: [
          {
            label: "Selisih Jarak Perubahan Lokasi Bongkar",
            price:
              calculatedPrice.costDifference > 0
                ? calculatedPrice.costDifference
                : 0,
          },
        ],
      },
      {
        title: "Biaya Administrasi",
        items: [
          {
            label: "Admin Ubah Pesanan",
            price: calculatedPrice.penaltyFee,
          },
        ],
      },
      {
        title: "Biaya Lainnya",
        items: [
          {
            label: "Admin Layanan",
            price: calculatedPrice.adminFee,
          },
          {
            label: "Pajak",
            price: calculatedPrice.taxAmount,
          },
        ],
      },
    ];
  }, [calculatedPrice]);

  const handleUpdateOrder = () => {
    setUpdateOrderSuccess(true);
    router.push(`/daftarpesanan/detailpesanan/${params.orderId}`);
  };

  return (
    <>
      <Card className="shadow-muat sticky top-[124px] flex w-[338px] flex-col gap-0 rounded-xl border-none bg-white">
        <div className="flex flex-col gap-y-6 px-5 py-6 text-neutral-900">
          <div
            className={cn(
              priceSummary.length > 0
                ? "flex flex-col gap-y-6"
                : "border-b border-b-neutral-400 pb-6"
            )}
          >
            <span className="text-base font-bold leading-[19.2px]">
              Detail Tambahan Biaya
            </span>
            {/* Detail Pesanan - Integrated from old file logic */}
            {priceSummary.length > 0 ? (
              <>
                {priceSummary.map(({ title, items }, key) => (
                  <div className="flex flex-col gap-y-3" key={key}>
                    <span
                      className={
                        "text-sm font-semibold leading-[16.8px] text-neutral-900"
                      }
                    >
                      {title}
                    </span>
                    {items.map(({ label, price }, itemKey) => {
                      const isTaxSection = label
                        .toLowerCase()
                        .includes("pajak");
                      return (
                        <div
                          className={
                            "flex items-center justify-between text-neutral-900"
                          }
                          key={itemKey}
                        >
                          <div
                            className={
                              "max-w-[180px] text-xs font-medium leading-[14.4px] text-neutral-600"
                            }
                          >
                            {label}
                          </div>
                          <span
                            className={`text-xs font-medium leading-[14.4px] ${isTaxSection ? "text-[#EE4343]" : "text-neutral-900"}`}
                          >
                            {isTaxSection ? "-" : ""}Rp
                            {price.toLocaleString("id-ID")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </>
            ) : null}
          </div>
        </div>
        <div
          className={cn(
            "flex flex-col gap-y-6 rounded-b-xl px-5",
            priceSummary.length > 0 ? "shadow-muat py-6" : "pb-6"
          )}
        >
          <div className="flex justify-between">
            <div className="max-w-[148px] text-base font-bold leading-[19.2px]">
              Total Tambahan Biaya
            </div>
            <span className="text-base font-bold leading-[19.2px]">
              {calculatedPrice?.totalPrice > 0
                ? `Rp${calculatedPrice.totalPrice.toLocaleString("id-ID")}`
                : "Rp0"}
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
