import Card from "@/components/Card/Card";
import { useShallowMemo } from "@/hooks/use-shallow-memo";

const UpdateOrderSummaryPanel = ({ calculatedPrice }) => {
  const priceSummary = useShallowMemo(() => {
    if (!calculatedPrice || !truckTypeId) {
      return [];
    }
    return [
      {
        title: "Biaya Pesan Jasa Angkut",
        items: [
          {
            label: `Nominal Pesan Jasa Angkut (${truckCount} Unit)`,
            price: calculatedPrice.transportFee,
          },
        ],
      },
      {
        title: "Biaya Asuransi Barang",
        items: [
          {
            label: "Nominal Premi Asuransi (1 Unit)",
            price: calculatedPrice.insuranceFee,
          },
        ],
      },
      ...(calculatedPrice.additionalServiceFee.length > 0
        ? [
            {
              title: "Biaya Layanan Tambahan",
              items: calculatedPrice.additionalServiceFee.map((item) => ({
                label: item.name,
                price: item.totalCost,
              })),
            },
          ]
        : []),
      ...(selectedVoucherDetails
        ? [
            {
              title: "Diskon Voucher",
              items: [
                {
                  label: `Voucher (${selectedVoucherDetails.code})`,
                  price: calculatedPrice.voucher || voucherDiscount,
                },
              ],
            },
          ]
        : []),
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
  }, [
    calculatedPrice,
    truckTypeId,
    truckCount,
    selectedVoucherDetails,
    voucherDiscount,
  ]);

  return (
    <>
      <Card className="shadow-muat sticky top-[124px] flex w-[338px] flex-col gap-0 rounded-xl border-none bg-white">
        <div className="flex flex-col gap-y-6 px-5 py-6 text-neutral-900">
          <div className="border-b border-b-neutral-400 pb-6">
            <span className="text-base font-bold leading-[19.2px]">
              Detail Tambahan Biaya
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-bold leading-[19.2px]">Total</span>
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
        </div>
      </Card>
    </>
  );
};

export default UpdateOrderSummaryPanel;
