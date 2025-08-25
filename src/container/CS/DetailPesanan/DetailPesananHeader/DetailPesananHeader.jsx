import { useRouter } from "next/navigation";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";

const DetailPesananHeader = ({ data }) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-3">
        <IconComponent
          onClick={() => router.back()}
          src="/icons/arrow-left24.svg"
          size="medium"
          className="text-primary-700"
        />
        <h1 className="text-xl font-bold text-neutral-900">
          {t("DetailPesananHeader.titleDetailPesanan", {}, "Detail Pesanan")}
        </h1>
      </div>
      <div className="flex items-center gap-x-3">
        {/* https://www.figma.com/design/3M23e9bqxbGkzyTzuhJ1AJ/-Transporter--Real-Time-Monitoring---Web?node-id=1994-691502&t=koiFV6Df3fMS25BC-0 */}
        {/* LDN-351 */}
        {data?.orderDetail?.isCancelable && (
          <Button variant="muatparts-error-secondary" onClick={() => {}}>
            {t(
              "DetailPesananHeader.buttonBatalkanPesanan",
              {},
              "Batalkan Pesanan"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DetailPesananHeader;
