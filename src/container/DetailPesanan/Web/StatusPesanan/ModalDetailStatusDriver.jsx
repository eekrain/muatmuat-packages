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
      <ModalContent className="w-[800px] p-6" type="muatmuat">
        <h2 className="mb-3 text-center text-[16px] font-bold leading-[19.2px] text-black">
          Detail Status Driver
        </h2>

        <div className="flex max-h-[353px] min-h-[317px] flex-col rounded-xl border border-neutral-400 pr-[4px] pt-5">
          <div className="relative pl-4 pr-[7px]">
            <AvatarDriver
              name={"Ardian Eka"}
              image={"https://picsum.photos/50"}
              licensePlate={"B 1234 CD"}
            />
          </div>

          <div className="my-6 w-full px-4">
            <hr className="border-neutral-400" />
          </div>

          <div className="overflow-y-auto">
            {dataDriverStatus && (
              <DriverTimeline
                dataDriverStatus={dataDriverStatus}
                className="pb-5 pl-4 pr-[12px]"
              />
            )}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ModalDetailStatusDriver;
