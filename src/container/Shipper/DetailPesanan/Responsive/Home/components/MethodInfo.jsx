import IconComponent from "@/components/IconComponent/IconComponent";
import { PaymentMethodTitle } from "@/lib/constants/detailpesanan/payment.enum";

export const MethodInfo = ({ dataRingkasanPembayaran }) => {
  if (!dataRingkasanPembayaran?.paymentMethod) return null;
  
  const paymentMethod = dataRingkasanPembayaran.paymentMethod.toLowerCase().replace(/ /g, '_');
  const paymentLogo = dataRingkasanPembayaran.paymentLogo;
  const paymentMethodName = dataRingkasanPembayaran.paymentMethod;

  return (
    <div className="bg-white p-4">
      <div className="space-y-2 text-xs font-medium">
        <div className="text-sm font-semibold text-neutral-900">
          Opsi Pembayaran
        </div>

        <div className="w-full">
          <div className="flex items-center gap-2">
            {paymentLogo ? (
              <img src={paymentLogo} alt={paymentMethodName} width={24} height={24} className="bg-white" />
            ) : (
              <IconComponent
                src={`/icons/payment/${paymentMethod}.svg`}
                width={24}
                height={24}
                className="bg-white"
              />
            )}
            <span className="text-xs font-semibold text-neutral-900">
              {paymentMethodName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
