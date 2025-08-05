import IconComponent from "@/components/IconComponent/IconComponent";

const RepaymentPaymentMethod = () => {
  // sementara ditoggle dulu
  const hasPaymentMethod = false;
  return (
    <div className="flex flex-col gap-y-3 bg-neutral-50 px-4 py-5">
      <div className="flex items-center justify-between text-sm font-semibold leading-[1.1]">
        <span className="text-neutral-900">Opsi Pembayaran</span>
        <button className="text-primary-700">
          {hasPaymentMethod ? "Ubah" : "Pilih"}
        </button>
      </div>
      {hasPaymentMethod ? (
        <div className="flex items-center gap-x-2">
          <IconComponent src="/icons/bca24.svg" size="medium" />
          <span className="text-xs font-semibold leading-[1.1] text-neutral-900">
            BCA Virtual Account
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default RepaymentPaymentMethod;
