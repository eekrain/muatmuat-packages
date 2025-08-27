import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { useUpdateOrder } from "@/services/Shipper/sewaarmada/updateOrder";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";

import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useTranslation } from "@/hooks/use-translation";

import { normalizeUpdateOrder } from "@/lib/normalizers/sewaarmada/normalizeUpdateOrder";
import { cn } from "@/lib/utils";
import { idrFormat } from "@/lib/utils/formatters";

import { useSewaArmadaStore } from "@/store/Shipper/forms/sewaArmadaStore";

const UpdateOrderSummaryPanel = ({ calculatedPrice }) => {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { setUpdateOrderSuccess } = useSewaArmadaStore(
    (state) => state.actions
  );
  const formValues = useSewaArmadaStore((state) => state.formValues);
  const orderType = useSewaArmadaStore((state) => state.orderType);
  const originalOrderData = useSewaArmadaStore(
    (state) => state.originalOrderData
  );
  const { trigger, isMutating, error, data } = useUpdateOrder(params.orderId);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const priceSummary = useShallowMemo(() => {
    if (
      !calculatedPrice ||
      calculatedPrice?.totalPrice <= 0 ||
      !formValues.hasUpdatedForm
    ) {
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
  }, [calculatedPrice, formValues.hasUpdatedForm]);

  const handleUpdateOrder = async () => {
    // setUpdateOrderSuccess(true);
    // router.push(`/daftarpesanan/detailpesanan/${response.data.data.orderId}`);
    try {
      const payload = normalizeUpdateOrder(
        orderType,
        formValues,
        calculatedPrice,
        originalOrderData
      );
      console.log(payload, "payload");
      const response = await trigger(payload);
      setUpdateOrderSuccess(true);
      router.push(`/daftarpesanan/detailpesanan/${params.orderId}`);
    } catch (err) {
      // Enhanced error handling
      console.error(err);
      if (err?.response?.data) {
        alert(`Error: ${err.response.data.message?.text || "Unknown error"}`);
      } else {
        alert("Terjadi kesalahan. Silakan coba lagi.");
      }
    }
  };

  return (
    <>
      <Card className="sticky top-[124px] flex w-[338px] flex-col gap-0 rounded-xl border-none bg-white shadow-muat">
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
                    {items.map(({ label, price }, itemKey) => (
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
                        <span className="text-xs font-medium leading-[14.4px] text-neutral-900">
                          {idrFormat(price)}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </>
            ) : null}
          </div>
        </div>
        <div
          className={cn(
            "flex flex-col gap-y-6 rounded-b-xl px-5",
            priceSummary.length > 0 ? "py-6 shadow-muat" : "pb-6"
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
          {/* 25. 18 - Web - LB - 0271 */}
          {formValues.hasUpdatedForm ? (
            <Button
              variant="muatparts-primary"
              onClick={() => setConfirmationModalOpen(true)}
            >
              Lanjut
            </Button>
          ) : null}
        </div>
      </Card>

      <ConfirmationModal
        variant="muatparts"
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
          // 25. 18 - Web - LB - 0275
          classname: "min-w-[170px]",
          text: t("buttonKembali"),
        }}
        confirm={{
          // 25. 18 - Web - LB - 0275
          classname: "min-w-[170px]",
          text: t("buttonSimpanPerubahan"),
          onClick: handleUpdateOrder,
        }}
      />
    </>
  );
};

export default UpdateOrderSummaryPanel;
