// RingkasanPembayaran.jsx
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import useSWR from "swr";

import BatalkanModal from "@/components/BatalkanModal/BatalkanModal";
import Button from "@/components/Button/Button";
import Checkbox from "@/components/Form/Checkbox";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from "@/components/Modal/Modal";
import { ModalFormRekeningPencairan } from "@/components/RekeningPencairan/ModalFormRekeningPencairan";
import { ModalFormRequestOtp } from "@/components/RekeningPencairan/ModalFormRequestOtp";
import { fetcherMuatparts, fetcherMuatrans } from "@/lib/axios";
import { toast } from "@/lib/toast";
import {
  useRequestOtpActions,
  useRequestOtpStore,
} from "@/store/forms/requestOtpStore";

const fetcher = async (url) => {
  const res = await fetcherMuatrans.get(url);
  const data = res.data?.Data?.reasons;
  if (!data) return [];
  return data.map((val) => ({
    value: val?.reasonId,
    label: val?.reasonName,
  }));
};

// make an array of integer from 1 to 6
const cancelReasons = new Array(6).fill(0).map((_, index) => index);

export const ModalBatalkanPesanan = ({ dataRingkasanPembayaran }) => {
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
      return data || [];
    }
  );

  const { data: bankOptions } = useSWR("v1/muatparts/banks", async (url) => {
    const res = await fetcherMuatparts.get(url);
    const data = res.data?.Data;
    console.log("🚀 ~ file: ModalBatalkanPesanan.jsx:58 ~ data:", data);
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

    if (Object.keys(errors).length > 0) {
      setCancelFormErrors(errors);
      return;
    }

    if (dataRekening.length === 0) {
      setIsModalBatalkanOpen(false);
      setIsModalReasonOpen(false);
      setIsModalRekeningOpen(true);
      return;
    }

    // Implement cancel order
  };

  const { params, formValues: otpValues } = useRequestOtpStore();
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
      .post("v1/muatparts/bankAccount", params.data)
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
      params?.mode === "add-rekening" &&
      params.data &&
      otpValues?.hasVerified
    ) {
      if (hasAddedNewRekening.current) return;
      handleAddNewRekeningPencairan();
      hasAddedNewRekening.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.mode, otpValues?.hasVerified]);

  return (
    <>
      <Modal open={isModalBatalkanOpen} onOpenChange={setIsModalBatalkanOpen}>
        <ModalTrigger>
          <Button
            variant="muattrans-error-secondary"
            className="h-8 w-full"
            type="button"
          >
            Batalkan Pesanan
          </Button>
        </ModalTrigger>
        <ModalContent className="w-modal-small">
          <ModalHeader type="muattrans" size="small" />
          <div className="flex w-[386px] flex-col items-center justify-center gap-6 px-6 py-9">
            {/* Title */}
            <h2 className="w-full text-center text-[16px] font-bold leading-[19.2px] text-black">
              Batalkan Pesanan
            </h2>

            {/* Description */}
            <p className="w-full text-center text-[14px] font-medium leading-[15.4px] text-black">
              Pembatalan pesanan akan dikenakan biaya admin sebesar
              Rp75.000/unit.
              <br />
              <br />
              Apakah kamu yakin ingin membatalkan pesanan?
            </p>

            {/* Checkbox with Terms */}
            <div className="flex w-[292px] flex-row items-center gap-2">
              <Checkbox
                checked={false}
                onChange={(e) => setIsAgreed(e.checked)}
                value="terms_agreement"
                label=""
              >
                <span className="text-[12px] font-medium leading-[14.4px] text-black">
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

            {/* Action Button */}
            <Button
              variant="muatparts-primary-secondary"
              type="button"
              className={`h-8 min-w-[112px] ${!isAgreed ? "cursor-not-allowed opacity-50" : ""}`}
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

      <BatalkanModal
        open={isModalReasonOpen}
        onOpenChange={setIsModalReasonOpen}
        cancelReasons={cancelReasons || []}
        errors={cancelFormErrors}
        onSubmit={handleProceedCancelOrder}
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
