// RingkasanPembayaran.jsx
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import useSWR from "swr";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Form/Checkbox";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from "@/components/Modal/Modal";
import { ModalAlasanPembatalan } from "@/components/Modal/ModalAlasanPembatalan";
import { ModalFormRekeningPencairan } from "@/components/RekeningPencairan/ModalFormRekeningPencairan";
import { ModalFormRequestOtp } from "@/components/RekeningPencairan/ModalFormRequestOtp";
import { fetcherMuatparts, fetcherMuatrans } from "@/lib/axios";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { toast } from "@/lib/toast";
import {
  useRequestOtpActions,
  useRequestOtpStore,
} from "@/store/Shipper/forms/requestOtpStore";

export const ModalBatalkanPesanan = ({ dataRingkasanPembayaran, children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isModalBatalkanOpen, setIsModalBatalkanOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isModalReasonOpen, setIsModalReasonOpen] = useState(false);
  const [isModalRekeningOpen, setIsModalRekeningOpen] = useState(false);
  const [isModalOtpOpen, setIsModalOtpOpen] = useState(false);

  const { data: cancelReasons } = useSWR(
    "v1/orders/cancellation-reasons",
    async (url) => {
      const res = await fetcherMuatrans.get(url);
      const data = res.data?.Data?.reasons;
      if (!data) return [];
      return data.map((val) => ({
        value: val?.reasonId,
        label: val?.reasonName,
      }));
    }
  );

  const { data: dataRekening } = useSWR(
    "v1/muatparts/bankAccount",
    async (url) => {
      const res = await fetcherMuatparts.get(url);
      const data = res.data?.Data?.accounts;
      // return data || [];
      return [];
    }
  );

  const { data: bankOptions } = useSWR("v1/muatparts/banks", async (url) => {
    const res = await fetcherMuatparts.get(url);
    const data = res.data?.Data;
    if (!data) return [];
    return data.map((val) => ({
      value: val?.id,
      label: val?.value,
    }));
  });

  const [cancelFormErrors, setCancelFormErrors] = useState({});
  const handleProceedCancelOrder = ({
    selectedReason,
    isOtherReason,
    customReason,
  }) => {
    // Validation
    if (!selectedReason) {
      toast.error(
        "Minimal pilih 1 alasan pembatalan untuk membatalkan pesanan"
      );
      return;
    }

    const errors = {};

    if (isOtherReason && !customReason)
      errors.customReason = "Alasan pembatalan harus diisi";
    setCancelFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    // If there is no rekening, show modal to add rekening
    if (dataRekening.length === 0) {
      setIsModalBatalkanOpen(false);
      setIsModalReasonOpen(false);
      setIsModalRekeningOpen(true);
      return;
    }

    // // Implement cancel order
    // const body = {
    //   reasonId: selectedReason,
    //   additionalInfo: isOtherReason ? customReason : "",
    // };

    // fetcherMuatrans
    //   .post(`v1/orders/${routerParams.orderId}/cancel`, body)
    //   .then((response) => {
    //     toast.success(response.data?.Data?.Message);
    //   })
    //   .catch((error) => {
    //     toast.error(error.response.data?.Data?.Message);
    //   });
    toast.success("Pesanan kamu berhasil dibatalkan");
    setIsModalReasonOpen(false);
  };

  const { params: otpParams, formValues: otpValues } = useRequestOtpStore();
  const { setParams, reset: resetOtp } = useRequestOtpActions();
  const handleTempSaveRekening = (data) => {
    setParams({
      mode: "add-rekening",
      data,
      redirectUrl: pathname,
    });
    setIsModalOtpOpen(true);
  };

  const handleRequestOtp = () => {
    router.push("/rekening-pencairan/otp");
  };

  const handleAddNewRekeningPencairan = () => {
    fetcherMuatparts
      .post("v1/muatparts/bankAccount", otpParams.data)
      .then((response) => {
        toast.success(response.data?.Data?.Message);
      })
      .catch((error) => {
        toast.error(error.response.data?.Data?.Message);
      });
    resetOtp();
  };

  const hasAddedNewRekening = useRef(false);
  useEffect(() => {
    if (
      otpParams?.mode === "add-rekening" &&
      otpParams.data &&
      otpValues?.hasVerified
    ) {
      if (hasAddedNewRekening.current) return;
      handleAddNewRekeningPencairan();
      hasAddedNewRekening.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpParams?.mode, otpValues?.hasVerified]);

  return (
    <>
      <Modal open={isModalBatalkanOpen} onOpenChange={setIsModalBatalkanOpen}>
        <ModalTrigger>{children}</ModalTrigger>
        <ModalContent className="w-modal-small">
          <ModalHeader type="muattrans" size="small" />
          <div className="flex w-[386px] flex-col items-center justify-center gap-6 px-6 py-9">
            {/* Title */}
            <h2 className="w-full text-center text-base font-bold leading-[19.2px] text-black">
              Batalkan Pesanan
            </h2>

            {dataRingkasanPembayaran?.orderStatus ===
            OrderStatusEnum.PREPARE_FLEET ? (
              <CancelContentWhenPrepareFleet
                isAgreed={isAgreed}
                setIsAgreed={setIsAgreed}
              />
            ) : (
              <CancelContentWhenNotPrepareFleet
                isAgreed={isAgreed}
                setIsAgreed={setIsAgreed}
              />
            )}

            {/* Action Button */}
            <Button
              variant="muatparts-primary-secondary"
              disabled={!isAgreed}
              type="button"
              onClick={() => {
                setIsModalBatalkanOpen(false);
                setIsModalReasonOpen(true);
              }}
            >
              Batalkan Pesanan
            </Button>
          </div>
        </ModalContent>
      </Modal>

      <ModalAlasanPembatalan
        open={isModalReasonOpen}
        onOpenChange={setIsModalReasonOpen}
        cancelReasons={cancelReasons || []}
        errors={cancelFormErrors}
        onSubmit={handleProceedCancelOrder}
        title="Alasan Pembatalan"
      />

      <ModalFormRekeningPencairan
        labelTitle="titleAccountInfo"
        open={isModalRekeningOpen}
        onOpenChange={setIsModalRekeningOpen}
        bankOptions={bankOptions || []}
        dataRekening={dataRekening}
        onSave={handleTempSaveRekening}
      />

      <ModalFormRequestOtp
        open={isModalOtpOpen}
        onOpenChange={setIsModalOtpOpen}
        onSubmit={handleRequestOtp}
      />
    </>
  );
};

const CancelContentWhenPrepareFleet = ({ isAgreed, setIsAgreed }) => {
  return (
    <>
      {/* Description */}
      <p className="w-full text-center text-sm font-medium leading-[15.4px] text-black">
        Apakah Anda yakin ingin membatalkan pesanan? Sebelum melakukan
        pembatalan pesanan, pastikan Anda sudah membaca{" "}
        <a
          href="https://faq.muatmuat.com/pusat-bantuan"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer text-primary-700"
          onClick={(e) => e.stopPropagation()}
        >
          Syarat dan Ketentuan kami.
        </a>
      </p>

      {/* Checkbox with Terms */}
      <div className="flex w-[318px] flex-row items-center gap-2">
        <Checkbox
          checked={isAgreed}
          onChange={(e) => setIsAgreed(e.checked)}
          value="terms_agreement"
          label=""
        >
          <span className="text-xs font-medium leading-[14.4px] text-black">
            Ya, Saya setuju dengan syarat dan ketentuan tersebut
          </span>
        </Checkbox>
      </div>
    </>
  );
};

const CancelContentWhenNotPrepareFleet = ({ isAgreed, setIsAgreed }) => {
  return (
    <>
      {/* Description */}
      <p className="w-full text-center text-sm font-medium leading-[15.4px] text-black">
        Pembatalan pesanan akan dikenakan biaya admin sebesar Rp75.000/unit.
        <br />
        <br />
        Apakah kamu yakin ingin membatalkan pesanan?
      </p>

      {/* Checkbox with Terms */}
      <div className="flex w-[292px] flex-row items-center gap-2">
        <Checkbox
          checked={isAgreed}
          onChange={(e) => setIsAgreed(e.checked)}
          value="terms_agreement"
          label=""
        >
          <span className="text-xs font-medium leading-[14.4px] text-black">
            Saya menyetujui{" "}
            <a
              href="https://faq.muatmuat.com/pusat-bantuan"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-primary-700"
              onClick={(e) => e.stopPropagation()}
            >
              Syarat dan Ketentuan Muatrans
            </a>
          </span>
        </Checkbox>
      </div>
    </>
  );
};
