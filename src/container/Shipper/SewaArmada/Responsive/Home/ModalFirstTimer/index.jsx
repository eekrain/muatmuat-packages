import { useEffect, useRef, useState } from "react";

import Checkbox from "@/components/Form/Checkbox";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { useAuth } from "@/hooks/use-auth";
import { useFirstTimerSewaArmadaApp } from "@/store/Shipper/first-timer/sewaArmadaApp";

export const ModalFirstTimer = ({}) => {
  const [open, setOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { dataUser } = useAuth();
  const { dontShowAgain, userId, setDontShowAgain } =
    useFirstTimerSewaArmadaApp();

  const hasInit = useRef(false);

  useEffect(() => {
    // Open the modal on first render if dontShowAgain is false
    if (!dontShowAgain && userId === dataUser?.ID && !hasInit.current) {
      setOpen(true);
      hasInit.current = true;
    }
    // Reset the state if the user is not the same, e.g. user has logged out and logged in with another account
    else if (userId !== dataUser?.ID) {
      setDontShowAgain(false, dataUser?.ID);
      setOpen(true);
      hasInit.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dontShowAgain, userId, dataUser?.ID]);

  return (
    <Modal
      open={open}
      onOpenChange={(value) => {
        if (value === false) {
          setDontShowAgain(isChecked, dataUser?.ID);
          setOpen(value);
        }
      }}
      closeOnOutsideClick
    >
      <ModalContent type="muatmuat">
        <div className="w-[296px] rounded-[10px] bg-neutral-50 px-5 pb-[26px] pt-[44px]">
          <h3 className="text-center text-base font-bold text-neutral-900">
            Nikmati Kemudahan Pengiriman dengan Muatrans!
          </h3>

          <div className="flex justify-center">
            <ImageComponent
              src="/img/sewa-armada-first-timer-apps.png"
              alt=""
              width={158}
              height={158}
            />
          </div>

          <p className="mb-[59px] mt-5 text-sm font-medium leading-[1.1] text-neutral-900">
            Pesan truk kapan saja dengan mudah. Lacak kirimanmu secara real-time
            dan dapatkan rekomendasi truk sesuai muatan!
          </p>

          <div className="flex justify-center">
            <Checkbox
              label="Jangan Tampilkan lagi"
              value="rentang_waktu"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
