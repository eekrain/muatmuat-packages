import IconComponent from "@/components/IconComponent/IconComponent";
import ModalIncomingDriverWaitingTimeFee from "@/container/DetailPesanan/Web/StatusPesanan/ModalIncomingDriverWaitingTimeFee";

const AlertDriverWaiting = ({ arr = [1] }) => {
  if (arr.length === 0) {
    return (
      <div className="flex h-14 items-center rounded-md bg-secondary-100 px-6 py-4">
        <IconComponent
          className="icon-stroke-warning-900"
          src="/icons/warning24.svg"
          size="medium"
        />
        <div className="ml-2 mr-1">
          <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
            Harap tunjukkan QR Code ke pihak driver
          </span>
        </div>
        <IconComponent className="text-neutral-700" src="/icons/info16.svg" />
      </div>
    );
  }
  return (
    <div className="flex h-[100px] items-center rounded-md bg-secondary-100 px-6 py-4">
      <div className="flex w-full flex-col gap-y-3">
        <div className="flex items-center gap-x-2">
          <IconComponent
            className="icon-stroke-warning-900"
            src="/icons/warning24.svg"
            size="medium"
          />
          <span className="text-[12px] font-semibold leading-[14.4px] text-neutral-900">
            Pemberitahuan:
          </span>
        </div>
        <ul className="flex w-full list-disc flex-col gap-y-2 pl-12 text-[12px] font-semibold leading-[14.4px] text-neutral-900">
          <li>
            <div className="flex items-center gap-x-2">
              <span>Driver kamu akan dikenakan biaya waktu tunggu.</span>
              <ModalIncomingDriverWaitingTimeFee />
            </div>
          </li>
          <li>
            <div className="flex items-center gap-x-2">
              <span>Harap tunjukkan QR Code ke pihak driver</span>
              <IconComponent
                className="text-neutral-700"
                src="/icons/info16.svg"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AlertDriverWaiting;
