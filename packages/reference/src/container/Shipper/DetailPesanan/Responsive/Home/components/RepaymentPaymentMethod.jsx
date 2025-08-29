import { useTranslation } from "@/hooks/use-translation";

import { useResponsiveNavigation } from "@/lib/responsive-navigation";

import { useSewaArmadaStore } from "@/store/Shipper/forms/sewaArmadaStore";

const RepaymentPaymentMethod = ({ paymentMethods }) => {
  const { t } = useTranslation();
  const navigation = useResponsiveNavigation();
  const paymentMethodId = useSewaArmadaStore(
    (state) => state.formValues.paymentMethodId
  );

  // Find the selected payment method from the paymentMethods data
  const selectedPaymentMethod = paymentMethods
    ?.flatMap((category) => category.methods)
    .find((method) => method.id === paymentMethodId);

  // Check if payment method is selected
  const hasPaymentMethod = !!selectedPaymentMethod;

  return (
    <div className="flex flex-col gap-y-3 bg-neutral-50 px-4 py-5">
      <div className="flex items-center justify-between text-sm font-semibold leading-[1.1]">
        <span className="text-neutral-900">
          {t("RepaymentPaymentMethod.paymentOptions", {}, "Opsi Pembayaran")}
        </span>
        <button
          className="text-primary-700"
          onClick={() => navigation.push("/OpsiPembayaran")}
        >
          {hasPaymentMethod
            ? t("RepaymentPaymentMethod.changeButton", {}, "Ubah")
            : t("RepaymentPaymentMethod.selectButton", {}, "Pilih")}
        </button>
      </div>
      {hasPaymentMethod ? (
        <div className="flex items-center gap-x-2">
          <img
            src={selectedPaymentMethod.icon}
            width={24}
            height={24}
            alt={`${selectedPaymentMethod.name} logo`}
            className="object-contain"
          />
          <span className="text-xs font-semibold leading-[1.1] text-neutral-900">
            {selectedPaymentMethod.name}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default RepaymentPaymentMethod;
