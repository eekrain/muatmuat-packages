import Card from "@/components/Card/Card";

const UpdateOrderSummaryPanel = () => {
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
