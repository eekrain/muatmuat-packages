import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";

const FleetOrderConfirmationModal = ({ isOpen, setIsOpen, onOrderFleet }) => {
  return (
    <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick={false}>
      <ModalContent className="w-modal-big">
        <ModalHeader size="big" type="muattrans" />
        <div className="flex w-[454px] flex-col items-center justify-center gap-6 px-6 py-9">
          {/* Judul Modal */}
          <h2 className="w-full text-center text-base font-bold leading-[19.2px] text-neutral-900">
            Informasi
          </h2>

          {/* Box Peringatan */}
          <div className="flex h-[68px] w-full flex-row items-center gap-2 rounded-md bg-secondary-100 px-6">
            <div className="flex items-center">
              <IconComponent
                className="icon-stroke-warning-900"
                src="/icons/warning24.svg"
                height={24}
                width={24}
              />
            </div>
            <p className="text-xs font-medium leading-[14.4px] text-neutral-900">
              Jika ada kendala pada persiapan atau perjalanan ke lokasi muat,
              pengiriman mungkin tidak bisa dilanjutkan. Kami akan tetap
              berusaha memberikan solusi terbaik.
            </p>
          </div>

          {/* Text Konfirmasi */}
          <p className="w-full text-center text-sm font-medium leading-[16.8px] text-neutral-900">
            Apakah kamu yakin data yang kamu isi sudah benar? <br />
            Pastikan semua informasi telah diperiksa sebelum melanjutkan.
          </p>

          {/* Text Syarat dan Ketentuan */}
          <p className="w-[320px] text-center text-xs font-medium leading-[14.4px] text-neutral-900">
            *Dengan memesan jasa angkut ini, kamu telah menyetujui{" "}
            {/* <Link href="/syarat-ketentuan"> */}
            <span className="text-primary-700">
              Syarat dan Ketentuan Muatrans
            </span>
            {/* </Link> */}
          </p>

          {/* Container Tombol */}
          <div className="flex flex-row justify-center gap-2">
            <Button
              variant="muatparts-primary-secondary"
              onClick={() => setIsOpen(false)}
            >
              Kembali
            </Button>
            <Button variant="muatparts-primary" onClick={onOrderFleet}>
              Pesan Sekarang
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default FleetOrderConfirmationModal;
