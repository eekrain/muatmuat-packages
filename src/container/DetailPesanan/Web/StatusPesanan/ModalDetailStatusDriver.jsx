import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import Button from "@/components/Button/Button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { DriverTimeline } from "@/components/Timeline/DriverTimeline";
import { useGetDriverStatusTimeline } from "@/services/lacak-armada/getDriverStatusTimeline";

const ModalDetailStatusDriver = () => {
  const { data: dataDriverStatus, isLoading } = useGetDriverStatusTimeline({
    orderId: "123",
    driverId: "456",
  });

  return (
    <Modal closeOnOutsideClick>
      <ModalTrigger>
        <Button variant="muatparts-primary-secondary">
          Detail Status Driver
        </Button>
      </ModalTrigger>
      <ModalContent className="w-[800px] p-6">
        <h2 className="mb-3 text-center text-[16px] font-bold leading-[19.2px] text-black">
          Detail Status Driver
        </h2>

        <div className="grid h-[388px] grid-cols-1 grid-rows-[64px_1fr] rounded-xl border border-neutral-400 pt-5">
          <div className="relative px-4">
            <AvatarDriver
              name={"Ardian Eka"}
              image={"https://picsum.photos/50"}
              licensePlate={"B 1234 CD"}
            />

            <div className="absolute bottom-0 left-0 w-full px-4">
              <hr />
            </div>
          </div>

          <div className="overflow-y-auto">
            {dataDriverStatus && (
              <DriverTimeline
                dataDriverStatus={dataDriverStatus}
                className="px-4 pb-5 pt-6"
              />
            )}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ModalDetailStatusDriver;
