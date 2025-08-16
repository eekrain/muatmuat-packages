import { useRouter } from "next/navigation";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

const DetailPesananHeader = ({ dataOrderDetail, activeTab }) => {
  const router = useRouter();
  return (
    <div>
      <div className="flex h-6 items-center justify-between">
        <div className="flex items-center gap-x-3">
          <IconComponent
            onClick={() => router.back()}
            src="/icons/arrow-left24.svg"
            size="medium"
            className="text-primary-700"
          />
          <h1 className="text-xl font-bold text-neutral-900">Detail Pesanan</h1>
        </div>
        <div className="flex items-center gap-x-3">
          {/* https://www.figma.com/design/3M23e9bqxbGkzyTzuhJ1AJ/-Transporter--Real-Time-Monitoring---Web?node-id=1994-691502&t=koiFV6Df3fMS25BC-0 */}
          {/* LDN-351 */}
          {dataOrderDetail?.orderStatus === OrderStatusEnum.SCHEDULED_FLEET ? (
            <>
              <Button
                variant="muattrans-primary-secondary"
                iconLeft="/icons/download16.svg"
                onClick={() => {}}
              >
                Unduh DO
              </Button>
              <Button variant="muatparts-error-secondary" onClick={() => {}}>
                Batalkan Pesanan
              </Button>
            </>
          ) : null}
        </div>
      </div>
      <div
        className={
          "mt-4 flex items-center gap-[2px] rounded-lg bg-secondary-100 px-6 py-4 text-xs font-medium text-neutral-900"
        }
      >
        <IconComponent
          src={"/icons/warning-kuning.svg"}
          className={"mr-1 flex-shrink-0"}
          width={24}
          height={24}
        />
        Terdapat perubahan pesanan dari shipper, mohon pelajari perubahannya dan
        segera beri respon
      </div>
    </div>
  );
};

export default DetailPesananHeader;
