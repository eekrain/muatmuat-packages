import Button from "@/components/Button/Button";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

export const FooterButton = () => {
  const navigation = useResponsiveNavigation();

  const ALLOW_LIST = {
    DetailRefund: [
      OrderStatusEnum.CANCELED_BY_SHIPPER,
      OrderStatusEnum.CANCELED_BY_SYSTEM,
      OrderStatusEnum.CANCELED_BY_TRANSPORTER,
    ],
    Unduh: "ALL",
    PesanUlang: "ALL",
    DokumenDiterima: [OrderStatusEnum.DOCUMENT_DELIVERY],
    BeriUlasan: [OrderStatusEnum.COMPLETED],
  };

  return (
    <>
      <Button
        variant="muatparts-primary-secondary"
        className="flex-1"
        onClick={() => alert("Simpan")}
        type="button"
      >
        Pesan Ulang
      </Button>
      <Button
        variant="muatparts-primary"
        className="flex-1"
        onClick={() => alert("Simpan")}
        type="button"
      >
        Beri Ulasan
      </Button>
    </>
  );
};
