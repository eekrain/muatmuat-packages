import Link from "next/link";
import { useState } from "react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import BatalkanModal from "@/components/BatalkanModal/BatalkanModal";
import Button from "@/components/Button/Button";
import { Select } from "@/components/Form/Select";
import { TagInput } from "@/components/Form/TagInput";
import IconComponent from "@/components/IconComponent/IconComponent";
import LightboxTrigger, {
  LightboxProvider,
} from "@/components/Lightbox/Lighbox";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import Stepper from "@/components/Stepper/Stepper";
import ToogleButton from "@/components/ToogleButton/ToogleButton";
import { toast } from "@/lib/toast";

import ExampleSwr from "./ExampleSwr";
import ExampleTimeline from "./ExampleTimeline";

const images = [
  "https://picsum.photos/400/300?random=1",
  "https://picsum.photos/400/300?random=2",
  "https://picsum.photos/400/300?random=3",
  "https://picsum.photos/400/300?random=4",
];

const ExampleWeb = () => {
  const [courierStatus, setCourierStatus] = useState({
    ambilLangsung: false,
    kurirToko: false,
    gojekInstant: true,
    grabInstant: true,
    jtRegular: false,
    jneRegular: false,
    sicepat: false,
    anteraja: false,
    posIndonesia: false,
    jtCargo: false,
    jneTrucking: false,
    wahana: false,
  });
  const [openControlled, setOpenControlled] = useState(false);
  const toggleCourier = (courierName) => {
    setCourierStatus((prev) => ({
      ...prev,
      [courierName]: !prev[courierName],
    }));
  };

  const [batalkanModal, setBatalkanModal] = useState(false);

  const [tags, setTags] = useState([]);
  const [tagsError, setTagsError] = useState("");

  const [selectValue, setSelectValue] = useState("");
  console.log("🚀 ~ ExampleWeb ~ selectValue:", selectValue);

  return (
    <div className="flex flex-col gap-4 bg-white p-4">
      <div className="itmes-center flex gap-x-2">
        <Button
          variant="muattrans-primary"
          onClick={() => setOpenControlled(true)}
        >
          Primary
        </Button>
        <Button variant="muattrans-primary-secondary">Primary Secondary</Button>
        <Button variant="muattrans-error">Error</Button>
        <Button variant="muattrans-error-secondary">Error Seconary</Button>
        <Button variant="muattrans-warning">Warning</Button>

        <Button
          variant="muattrans-primary"
          onClick={() => toast.success("Toast Success")}
        >
          Toast Success
        </Button>
        <Button
          variant="muattrans-error"
          onClick={() => toast.error("Toast Error")}
        >
          Toast Error
        </Button>
      </div>
      <div>
        <ToogleButton
          onClick={() => toggleCourier("ambilLangsung")}
          value={courierStatus.ambilLangsung}
        />
      </div>
      <Modal
        open={openControlled}
        onOpenChange={setOpenControlled}
        closeOnOutsideClick
      >
        <ModalContent>
          <ModalHeader size="big" />
          <div className="px-6 py-9">
            <div className="flex w-[406px] max-w-[510px] flex-col items-center justify-center gap-6">
              {/* Judul Modal */}
              <h2 className="w-full text-center text-[16px] font-bold leading-[19.2px] text-neutral-900">
                Informasi
              </h2>

              {/* Box Peringatan */}
              <div className="flex w-full flex-row items-center gap-2.5 rounded-md bg-warning-100 p-6">
                <div className="flex items-center">
                  <IconComponent
                    src="/icons/warning24.svg"
                    height={24}
                    width={24}
                    className="text-[#FF7A00]"
                  />
                </div>
                <p className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                  Jika ada kendala pada persiapan atau perjalanan ke lokasi
                  muat, pengiriman mungkin tidak bisa dilanjutkan. Kami akan
                  tetap berusaha memberikan solusi terbaik.
                </p>
              </div>

              {/* Text Konfirmasi */}
              <p className="w-full text-center text-[14px] font-medium leading-[16.8px] text-neutral-900">
                Apakah kamu yakin data yang kamu isi sudah benar? <br />
                Pastikan semua informasi telah diperiksa sebelum melanjutkan.
              </p>

              {/* Text Syarat dan Ketentuan */}
              <p className="w-[320px] text-center text-[12px] font-medium leading-[14.4px] text-neutral-900">
                *Dengan memesan jasa angkut ini, kamu telah menyetujui{" "}
                <Link href="/syarat-ketentuan">
                  <span className="text-primary-700 underline">
                    Syarat dan Ketentuan Muatrans
                  </span>
                </Link>
              </p>

              {/* Container Tombol */}
              <div className="flex flex-row justify-center gap-2">
                <Button
                  variant="muatparts-primary-secondary"
                  onClick={() => setOpenControlled(false)}
                  className="h-8 min-w-[132px]"
                  type="muatparts"
                >
                  Kembali
                </Button>
                <Button
                  variant="muatparts-primary"
                  onClick={() => setOpenControlled(false)}
                  className="h-8 min-w-[151px]"
                  type="muatparts"
                >
                  Pesan Sekarang
                </Button>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>

      <div className="mt-4">
        <ExampleTimeline />
      </div>

      <div className="mt-4">
        <ExampleSwr />
      </div>

      <Link href="/sewaarmada">Sewa Armada</Link>

      <div className="grid grid-cols-2">
        <div>
          <h1 className="mb-2 text-xl font-bold">Badge Status Pesanan</h1>

          <div className="flex flex-row flex-wrap gap-4">
            {[
              {
                icon: "/icons/info16.svg",
                label: "Menunggu Konfirmasi",
                variant: "primary",
              },
              {
                label: "Pesanan Terkonfirmasi",
                variant: "primary",
              },
              {
                label: "Armada Dijadwalkan",
                variant: "primary",
              },
              {
                label: "Proses Muat",
                variant: "primary",
              },
              {
                label: "Proses Bongkar",
                variant: "primary",
              },
              {
                label: "Dokumen Sedang Disiapkan",
                variant: "primary",
              },
              {
                label: "Proses Pengiriman Dokumen",
                variant: "primary",
              },
              {
                icon: "/icons/warning24.svg",
                label: "Perlu Respon Perubahan",
                variant: "warning",
              },
              {
                icon: "/icons/warning24.svg",
                label: "Perlu Konfirmasi Siap",
                variant: "error",
              },
              {
                icon: "/icons/warning24.svg",
                label: "Perlu Assign Armada",
                variant: "warning",
              },
              {
                label: "Selesai",
                variant: "success",
              },
              {
                label: "Dibatalkan Shipper",
                variant: "error",
              },
              {
                label: "Dibatalkan Transporter",
                variant: "error",
              },
              {
                label: "Dibatalkan Sistem",
                variant: "error",
              },
              {
                label: "Proses Muat",
                variant: "primary",
                className: "w-fit",
              },
            ].map((item, index) => (
              <BadgeStatusPesanan
                key={item.label + index}
                variant={item.variant}
                icon={{
                  iconLeft: item.icon,
                }}
                className={item?.className}
              >
                <p>{item.label}</p>
              </BadgeStatusPesanan>
            ))}
          </div>
        </div>
        <div>
          <h1 className="mb-2 text-xl font-bold">Stepper</h1>
          <Stepper
            steps={[
              {
                label: "Armada Dijadwalkan",
                icon: "/icons/stepper-scheduled.svg",
              },
              {
                label: "Proses Muat",
                icon: "/icons/stepper-box.svg",
              },
              {
                label: "Proses Bongkar",
                icon: "/icons/stepper-box-opened.svg",
              },
              {
                label: "Dokumen Sedang Disiapkan",
                icon: "/icons/stepper-document-preparing.svg",
              },
              {
                label: "Proses Pengiriman Dokumen",
                icon: "/icons/stepper-document-sending.svg",
              },
              {
                label: "Selesai",
                icon: "/icons/stepper-done.svg",
              },
            ]}
            currentStep={2}
          />

          <div className="w-[200px]">
            <h1 className="my-2 text-xl font-bold">Select</h1>
            <Select
              options={[
                {
                  label: "kg",
                  value: "kg",
                },
                {
                  label: "Liter",
                  value: "liter",
                },
                {
                  label: "Ton",
                  value: "ton",
                },
              ]}
              value={selectValue}
              onChange={setSelectValue}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div>
          <h1 className="mb-2 text-xl font-bold">Batalkan Modal</h1>
          <Button
            variant="muatparts-error-secondary"
            onClick={() => setBatalkanModal(true)}
          >
            Batalkan Modal
          </Button>

          <BatalkanModal
            open={batalkanModal}
            onOpenChange={setBatalkanModal}
            onConfirm={() => setBatalkanModal(false)}
          />
        </div>

        <div>
          <h1 className="mb-2 text-xl font-bold">Tag Input</h1>
          <TagInput
            tags={tags}
            onTagsChange={setTags}
            placeholder="Masukkan No. Delivery Order (DO)"
            onTagsDuplicate={(duplicateTag) =>
              setTagsError(`Tag ${duplicateTag} sudah ada`)
            }
            errorMessage={tagsError}
          />
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div>
          <h1 className="mb-2 text-xl font-bold">Lightbox (Single Image)</h1>

          <LightboxProvider image={images[0]} title="Jenis Carrier">
            <LightboxTrigger
              image={images[0]}
              alt="Jenis Carrier"
              className="size-[100px] overflow-hidden rounded-md object-cover"
            />
          </LightboxProvider>
        </div>

        <div>
          <h1 className="mb-2 text-xl font-bold">Lightbox (Multiple Images)</h1>

          <LightboxProvider
            images={images}
            title="Bukti Muat Barang di Lokasi 2"
          >
            <div className="flex flex-wrap gap-2">
              {images.map((image, index) => (
                <LightboxTrigger
                  key={index}
                  image={image}
                  index={index}
                  className="size-[100px] overflow-hidden rounded-md object-cover"
                  alt={`Bukti Muat Barang di Lokasi 2, Foto ke-${index + 1}`}
                />
              ))}
            </div>
          </LightboxProvider>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div>
          <h1 className="mb-2 text-xl font-bold">Avatar Driver</h1>

          <AvatarDriver
            name="Noel Gallagher"
            image="https://picsum.photos/50"
            platNomor="B 123456"
          />
        </div>
      </div>
    </div>
  );
};

export default ExampleWeb;
