import ConfirmationModal from "@/components/Modal/ConfirmationModal";

const TransporterConfirmationModals = ({
  modalState,
  setModalState,
  onConfirmAction,
  isLoading = false,
}) => {
  if (!modalState.isOpen || !modalState.data) return null;

  const commonProps = {
    isOpen: modalState.isOpen,
    setIsOpen: (val) => setModalState({ ...modalState, isOpen: val }),
    size: "small",
  };

  if (modalState.type === "delete") {
    return (
      <ConfirmationModal
        {...commonProps}
        title={{ text: "Hapus Transporter" }}
        description={{
          text: (
            <>
              Apakah Kamu yakin ingin menghapus Transporter{" "}
              <strong>{modalState.data.companyName}</strong>? Data yang dihapus
              tidak dapat dikembalikan lagi
            </>
          ),
        }}
        confirm={{
          text: "Ya",
          onClick: onConfirmAction,
          classname:
            "!w-[124px] border border-[--muat-trans-secondary-900] bg-neutral-50 text-[--muat-trans-secondary-900] hover:bg-[--muat-trans-secondary-50]",
        }}
        cancel={{
          text: "Batal",
          classname:
            "!w-[124px] bg-[--muat-trans-primary-400] text-neutral-900 hover:bg-[--muat-trans-primary-500] border-none",
          onClick: () => commonProps.setIsOpen(false),
        }}
      />
    );
  }

  if (modalState.type === "resend") {
    return (
      <ConfirmationModal
        {...commonProps}
        title={{ text: "Kirim Verifikasi Ulang Transporter" }}
        description={{
          text: (
            <>
              <p className="mb-4">
                Apakah Kamu yakin ingin mengirim ulang verifikasi Transporter{" "}
                <strong>{modalState.data.companyName}</strong>?
              </p>
              <p>
                Harap hubungi transporter terkait untuk melanjutkan proses
                verifikasi melalui pesan email yang dikirim.
              </p>
            </>
          ),
        }}
        confirm={{
          text: "Ya",
          onClick: onConfirmAction,
          classname:
            "!w-[124px] border border-[--muat-trans-secondary-900] bg-neutral-50 text-[--muat-trans-secondary-900] hover:bg-[--muat-trans-secondary-50]",
        }}
        cancel={{
          text: "Batal",
          classname:
            "!w-[124px] bg-[--muat-trans-primary-400] text-neutral-900 hover:bg-[--muat-trans-primary-500] border-none",
          onClick: () => commonProps.setIsOpen(false),
        }}
      />
    );
  }

  if (modalState.type === "deactivate") {
    return (
      <ConfirmationModal
        {...commonProps}
        title={{ text: "Non Aktifkan Transporter" }}
        description={{
          text: (
            <>
              Apakah kamu yakin ingin menonaktifkan Transporter{" "}
              <strong>{modalState.data.companyName}</strong>?
            </>
          ),
        }}
        confirm={{
          text: "Ya, Non Aktifkan",
          onClick: onConfirmAction,
          classname:
            " border border-[--muat-trans-secondary-900] bg-neutral-50 text-[--muat-trans-secondary-900] hover:bg-[--muat-trans-secondary-50]",
          loading: isLoading,
        }}
        cancel={{
          text: "Kembali",
          classname:
            " bg-[--muat-trans-primary-400] text-neutral-900 hover:bg-[--muat-trans-primary-500] border-none",
          onClick: () => commonProps.setIsOpen(false),
        }}
      />
    );
  }

  if (modalState.type === "activate") {
    return (
      <ConfirmationModal
        {...commonProps}
        title={{ text: "Aktifkan Transporter" }}
        description={{
          text: (
            <>
              Apakah kamu yakin ingin mengaktifkan Transporter{" "}
              <strong>{modalState.data.companyName}</strong>?
            </>
          ),
        }}
        confirm={{
          text: "Ya, Aktifkan",
          onClick: onConfirmAction,
          classname:
            " border border-[--muat-trans-secondary-900] bg-neutral-50 text-[--muat-trans-secondary-900] hover:bg-[--muat-trans-secondary-50]",
          loading: isLoading,
        }}
        cancel={{
          text: "Kembali",
          classname:
            " bg-[--muat-trans-primary-400] text-neutral-900 hover:bg-[--muat-trans-primary-500] border-none",
          onClick: () => commonProps.setIsOpen(false),
        }}
      />
    );
  }

  return null;
};

export default TransporterConfirmationModals;
