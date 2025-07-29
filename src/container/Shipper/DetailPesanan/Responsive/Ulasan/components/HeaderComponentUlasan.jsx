import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";

const HeaderComponentUlasan = ({ orderCode }) => {
  return (
    <div className="flex w-full flex-col items-start bg-white p-5">
      <div className="flex w-full flex-col items-start gap-4">
        {/* Order Code */}
        <div className="box-border flex w-full flex-row items-start justify-between border-b border-[#C4C4C4] pb-4">
          <span className="text-xs font-medium text-[#7B7B7B]">
            Kode Pesanan
          </span>
          <span className="text-right text-xs font-semibold text-black">
            {orderCode}
          </span>
        </div>

        {/* Order Status */}
        <div className="flex w-full flex-col items-start gap-3">
          <span className="text-xs font-medium text-[#7B7B7B]">
            Status Pesanan
          </span>

          <BadgeStatusPesanan
            variant="success"
            className="w-full text-sm font-semibold"
          >
            Selesai
          </BadgeStatusPesanan>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponentUlasan;
