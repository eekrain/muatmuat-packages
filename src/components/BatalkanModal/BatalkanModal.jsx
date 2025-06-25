import { useState } from "react";

import { useSWRHook, useSWRMutateHook } from "@/hooks/use-swr";
import { fetcherMuatparts } from "@/lib/axios";
import { toast } from "@/lib/toast";
import useBatalkanPesanan from "@/store/zustand/batalkanPesanan";

import Button from "../Button/Button";
import Input from "../Form/Input";
import { Modal, ModalContent, ModalHeader } from "../Modal/Modal";
import RadioButton from "../Radio/RadioButton";

const BatalkanModal = ({ open, onOpenChange, data }) => {
  const [value, setValue] = useState();
  const [reason, setReason] = useState("");

  const { data: dataOptionBatalkan } = useSWRHook(
    "v1/muatparts/transaction/cancel_options"
  );

  const { data: swrSave, trigger: triggerSaveBatalkan } = useSWRMutateHook(
    "v1/muatparts/orders/cancel"
  );
  const {
    setModalBatal,
    modalBatal,
    validateReason,
    setValidateReason,
    activeReason,
    setActiveReason,
  } = useBatalkanPesanan();

  const onSave = () => {
    let orderID = data?.orderID;
    let cancelOptionID = value;
    if (activeReason && !reason) {
      setValidateReason(true);
      return;
    }

    fetcherMuatparts
      .post("v1/muatparts/orders/cancel", {
        orderID,
        cancelOptionID,
        reason,
      })
      .then((res) => {
        toast.success("Berhasil membatalkan pesanan");
      });

    // router.push("/daftarpesanan?tab=6");
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} closeOnOutsideClick>
      <ModalContent className="w-modal-small">
        <ModalHeader size="small" />

        <div className="grid grid-cols-1 items-center gap-6 px-6 py-9">
          <div className="flex flex-col items-center justify-center text-center text-[16px] font-[700] leading-[19.2px] text-[#000000]">
            Pilih Alasan Pembatalan
          </div>

          <div className="flex flex-col gap-4">
            {dataOptionBatalkan?.Data && dataOptionBatalkan?.Data.length > 0
              ? dataOptionBatalkan?.Data?.map((item) => (
                  <>
                    <label className="flex cursor-pointer items-start gap-[2px]">
                      <RadioButton
                        name="option-batalkan"
                        onClick={(e) => {
                          if (item.value !== "Lainnya") {
                            setActiveReason(false);
                            setReason("");
                          } else setActiveReason(true);
                          setValue(e.value);
                        }}
                        value={item.id}
                      />
                      <div className="flex text-start">
                        <div
                          className={
                            "flex flex-col gap-1 text-xs font-medium text-neutral-900"
                          }
                        >
                          {item.value}
                          {activeReason && item.value == "Lainnya" && (
                            <>
                              <Input
                                maxLength="80"
                                className="w-[312px]"
                                changeEvent={(event) => {
                                  setValidateReason(false);
                                  setReason(event.target.value);
                                }}
                                supportiveText={{
                                  title: `${
                                    validateReason
                                      ? "Alasan Pembatalan Wajib diisi"
                                      : ""
                                  }`,
                                  desc: ` ${reason.length}/80`,
                                }}
                                status={`${validateReason ? "error" : ""}`}
                                placeholder={"Masukkan alasan pembatalan"}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </label>
                  </>
                ))
              : null}
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => onOpenChange(false)}
              className="w-[112px]"
              variant="muatparts-primary-secondary"
            >
              Batal
            </Button>
            <Button
              onClick={onSave}
              className="w-[112px]"
              variant="muatparts-primary"
            >
              Simpan
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default BatalkanModal;
