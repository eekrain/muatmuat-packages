const { Modal, ModalTrigger, ModalContent } = require("./Modal");

export const ModalDetailOverloadMuatan = ({
  data = {
    driverName: "Noel Gallagher",
    amount: "Rp100.000",
    overloadWeight: "1.000 kg",
  },
}) => {
  return (
    <Modal closeOnOutsideClick>
      <ModalTrigger>
        <button
          type="button"
          className="text-[12px] font-medium leading-[14.4px] text-primary-700"
        >
          Lihat Detail Overload Muatan
        </button>
      </ModalTrigger>
      <ModalContent className="w-[578px]">
        <div className="w-[578px] p-6 text-xs font-medium leading-[1.2]">
          {/* Header */}
          <h2 className="text-center text-[16px] font-bold text-neutral-900">
            Detail Overload Muatan
          </h2>

          <div className="w-full">
            <div className="flex items-baseline justify-between">
              <span className="h-2.5 text-sm font-semibold text-neutral-900">
                Driver : {data.driverName}
              </span>

              <span className="h-2.5 text-right text-neutral-900">
                {data.amount}
              </span>
            </div>

            <span className="mt-3 block h-2 text-xs font-medium leading-[14.4px] text-neutral-600">
              Nominal Overload Muatan ({data.overloadWeight})
            </span>
          </div>

          <hr className="my-6 block" />

          <div className="flex items-center justify-between text-base font-bold text-neutral-900">
            <span className="">Total</span>
            <span className="">{data.amount}</span>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
