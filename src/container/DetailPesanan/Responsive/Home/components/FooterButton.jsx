import Button from "@/components/Button/Button";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
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

  const beriUlasanShow = () => {
    navigation.push("/ulasan");
  };

  return (
    <>
      <div className="flex gap-2">
        {true && (
          <Button
            variant="muatparts-primary-secondary"
            className="w-full p-0"
            onClick={() => alert("Simpan")}
            type="button"
          >
            Pesan Ulang
          </Button>
        )}
        {true && (
          <Button
            variant="muatparts-primary"
            className="w-full p-0"
            onClick={beriUlasanShow}
            type="button"
          >
            Beri Ulasan
          </Button>
        )}
        {false && (
          <Button
            variant="muatparts-primary"
            className="w-full p-0"
            onClick={() => alert("Simpan")}
            type="button"
          >
            Lanjut Pembayaran
          </Button>
        )}
        {false && (
          <Button
            variant="muatparts-primary"
            className="w-full p-0"
            onClick={() => alert("Simpan")}
            type="button"
          >
            Dokumen Diterima
          </Button>
        )}
        {false && (
          <Button
            variant="muatparts-error-secondary"
            className="w-full p-0"
            onClick={() => alert("Simpan")}
            type="button"
          >
            Batalkan Pesanan
          </Button>
        )}
      </div>
    </>
  );
};
