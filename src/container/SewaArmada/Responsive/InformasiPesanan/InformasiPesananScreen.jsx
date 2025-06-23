"use client";

import { Fragment } from "react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import { InfoBottomsheet } from "@/components/Form/InfoBottomsheet";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import TextArea from "@/components/TextArea/TextArea";
import NoDeliveryOrder from "@/container/SewaArmada/Responsive/InformasiPesanan/NoDeliveryOrder";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

const InformasiPesananScreen = () => {
  const paymentMethods = [
    {
      title: "Transfer Virtual Account",
      icon: "/icons/transfer24.svg",
      options: [
        {
          id: "bca",
          name: "BCA Virtual Account",
          icon: "/icons/bca24.svg",
        },
        {
          id: "mandiri",
          name: "Mandiri Virtual Account",
          icon: "/icons/bca24.svg",
        },
        {
          id: "bni",
          name: "BNI Virtual Account",
          icon: "/icons/bca24.svg",
        },
        {
          id: "bri",
          name: "BRI Virtual Account",
          icon: "/icons/bca24.svg",
        },
        {
          id: "bsi",
          name: "BSI Virtual Account",
          icon: "/icons/bca24.svg",
        },
        {
          id: "permata",
          name: "Permata Virtual Account",
          icon: "/icons/bca24.svg",
        },
        {
          id: "cimb",
          name: "CIMB Virtual Account",
          icon: "/icons/bca24.svg",
        },
      ],
    },
  ];
  const navigation = useResponsiveNavigation();
  // Get state from Zustand store
  const { formValues, formErrors } = useSewaArmadaStore();
  const {
    fotoMuatan,
    deskripsi,
    // deliveryOrder,
    opsiPembayaran,
  } = formValues;
  const businessEntity = useSewaArmadaStore(
    (state) => state.formValues.businessEntity
  );
  const isBusinessEntity = useSewaArmadaStore(
    (state) => state.formValues.businessEntity.isBusinessEntity
  );
  const name = useSewaArmadaStore(
    (state) => state.formValues.businessEntity.name
  );
  const taxId = useSewaArmadaStore(
    (state) => state.formValues.businessEntity.taxId
  );

  // Get actions from Zustand store
  const { setField, setFotoMuatan, validateSecondForm } =
    useSewaArmadaActions();

  // Event handlers
  const handleImageUpload = (index, img) => setFotoMuatan(index, img);

  const handleToggleCheckbox = (checked) => {
    setField("businessEntity", {
      isBusinessEntity: checked,
      name: "",
      taxId: "",
    });
  };

  const handleSubmit = () => {
    if (validateSecondForm()) {
      // Navigate to next page or submit form
      // navigation.push("/NextPage");
      console.log("Form is valid, proceeding...");
    }
  };

  const selectedOpsiPembayaran = opsiPembayaran
    ? paymentMethods
        .flatMap((method) => method.options || [])
        .find((item) => item.id === opsiPembayaran.id)
    : null;
  console.log("formerr", formErrors);
  return (
    <FormResponsiveLayout
      title={{
        label: "Informasi Pesanan",
      }}
    >
      <div className="mb-[118px] flex flex-col gap-y-2 bg-neutral-200">
        {/* Warning Banner */}
        <div className="flex items-center gap-2.5 rounded-md bg-warning-100 p-3">
          <IconComponent
            src="/icons/warning20.svg"
            width={20}
            height={20}
            className="icon-fill-secondary-400"
          />
          <div className="flex flex-1 items-center gap-1">
            <p className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
              Jika ada kendala pada persiapan / perjalanan ke lokasi muat,
              pengiriman mungkin tidak bisa dilanjutkan. Kami akan tetap
              berusaha memberikan solusi terbaik.
            </p>
          </div>
        </div>

        {/* Info Jasa Angkut */}
        <div className="flex items-center gap-3 bg-neutral-50 px-4 py-5">
          {/* Image Container */}
          <div className="relative size-[68px] overflow-hidden rounded-xl border border-neutral-400">
            <ImageComponent
              className="w-full"
              src="/img/recommended1.png"
              width={68}
              height={68}
            />
            <button
              className="absolute right-2 top-2 flex size-[20px] items-center justify-center rounded-3xl bg-neutral-50"
              onClick={() => {}}
            >
              <IconComponent
                src="/icons/fullscreen12.svg"
                width={12}
                height={12}
              />
            </button>
          </div>

          {/* Info Text */}
          <div className="flex flex-1 flex-col gap-3">
            <h3 className="text-[14px] font-semibold leading-[15.4px] text-neutral-900">
              Box - Colt Diesel Engkel
            </h3>
            <p className="text-[14px] font-medium leading-[15.4px] text-neutral-900">
              Kebutuhan : 1 Unit
            </p>
            <p className="text-[14px] font-medium leading-[15.4px] text-neutral-900">
              Estimasi Jarak : 178 km
            </p>
          </div>
        </div>

        {/* Form Lampiran Foto */}
        <div className="flex flex-col gap-6 bg-white p-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-[14px] font-semibold text-neutral-900">
              Lampiran/Foto Muatan*
            </h2>

            {/* Grid Upload Foto */}
            <div className="flex flex-wrap gap-3">
              {[...Array(4)].map((_, key) => (
                <Fragment key={key}>
                  <ImageUploader
                    getImage={(value) => handleImageUpload(key, value)}
                    uploadText={key === 0 ? "Foto Utama" : `Foto ${key + 1}`}
                    maxSize={10}
                    className="!size-[72px]"
                    value={fotoMuatan[key]}
                    isNull={formErrors.fotoMuatan}
                  />
                </Fragment>
              ))}
            </div>

            {formErrors.fotoMuatan && (
              <p className="text-[12px] font-medium leading-[14.4px] text-error-400">
                {formErrors.fotoMuatan}
              </p>
            )}

            <p className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
              Maksimal unggah 4 foto muatan dengan format .jpg/.jpeg/.png, besar
              file maks. 10MB
            </p>
          </div>

          {/* Form Deskripsi */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-1">
              <span className="text-[14px] font-semibold text-neutral-900">
                Deskripsi Muatan*
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-full">
                <TextArea
                  maxLength={500}
                  hasCharCount
                  supportiveText={{
                    title: formErrors.deskripsi,
                  }}
                  resize="none"
                  placeholder={
                    "Lengkapi deskripsi informasi muatan Anda dengan rincian spesifik terkait barang yang dikirim, seperti bahan, penggunaan, atau karakteristik unik lainnya."
                  }
                  value={deskripsi}
                  onChange={(e) => setField("deskripsi", e.target.value)}
                  status={formErrors.deskripsi ? "error" : ""}
                />
              </div>
            </div>
          </div>

          {/* No. Delivery Order */}
          <NoDeliveryOrder />
        </div>

        {/* Badan Usaha Pemesan - Updated Section */}
        <div className="flex flex-col gap-4 bg-white p-4">
          {/* Header */}
          <div className="flex items-center gap-1">
            <h2 className="text-[14px] font-bold leading-[15.4px] text-neutral-900">
              Badan Usaha Pemesan
            </h2>
            <span className="text-[10px] font-semibold leading-[10px] text-neutral-900">
              (Opsional)
            </span>
            <InfoBottomsheet title="Badan Usaha Pemesan">
              <p className="text-center text-[14px] font-medium leading-[15.4px] text-neutral-900">
                Jika kamu mencentang opsi ini kamu akan dikenakan PPh 23
                terhadap pembayaran sewa jasa angkut yang kamu lakukan
              </p>
            </InfoBottomsheet>
          </div>

          {/* Checkbox */}
          <Checkbox
            label="Centang opsi jika kamu merupakan suatu badan usaha/perusahaan"
            checked={isBusinessEntity}
            onChange={({ checked }) => handleToggleCheckbox(checked)}
          />

          {/* Form Fields - Only show when checkbox is checked */}
          {isBusinessEntity && (
            <div className="mt-2 flex flex-col gap-4">
              {/* Field Nama Badan Usaha */}
              <div className="flex flex-col gap-3">
                <label className="text-[14px] font-semibold leading-[15.4px] text-neutral-900">
                  Nama Badan Usaha/Perusahaan*
                </label>
                <Input
                  name="name"
                  placeholder="Masukkan Nama Badan Usaha/Perusahaan"
                  value={name}
                  onChange={({ target: { name, value } }) =>
                    setField("businessEntity", {
                      ...businessEntity,
                      [name]: value,
                    })
                  }
                  errorMessage={formErrors?.businessEntity?.name}
                />
              </div>

              {/* Field Nomor NPWP */}
              <div className="flex flex-col gap-3">
                <label className="text-[14px] font-semibold leading-[15.4px] text-neutral-900">
                  Nomor NPWP*
                </label>
                <Input
                  name="taxId"
                  placeholder="Masukkan Nomor NPWP Perusahaan"
                  value={taxId}
                  onChange={({ target: { name, value } }) =>
                    setField("businessEntity", {
                      ...businessEntity,
                      [name]: value,
                    })
                  }
                  errorMessage={formErrors?.businessEntity?.taxId}
                />
              </div>
            </div>
          )}
        </div>

        {/* Opsi Pembayaran */}
        <div className="flex flex-col gap-y-3 bg-neutral-50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-neutral-900">
              Opsi Pembayaran
            </h2>
            <button
              className="text-[14px] font-semibold text-primary-700"
              onClick={() =>
                navigation.push("/OpsiPembayaran", { paymentMethods })
              }
            >
              Pilih
            </button>
          </div>
          {selectedOpsiPembayaran ? (
            <div className="flex items-center gap-x-2">
              <IconComponent src={selectedOpsiPembayaran.icon} size="medium" />
              <span className="text-[12px] font-semibold leading-[13.2px] text-neutral-900">
                {selectedOpsiPembayaran.name}
              </span>
            </div>
          ) : null}
          {formErrors.opsiPembayaran ? (
            <span className="text-[12px] font-medium leading-[13.2px] text-error-400">
              Metode pembayaran wajib diisi
            </span>
          ) : null}
        </div>

        {/* Ringkasan Transaksi */}
        <div className="flex flex-col gap-6 bg-white p-4">
          <h1 className="text-[14px] font-semibold text-neutral-900">
            Ringkasan Transaksi
          </h1>

          {/* Detail Biaya Container */}
          <div className="flex flex-col gap-6 border-b border-neutral-400 pb-6">
            {/* Biaya Pesan Jasa Angkut */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
                Biaya Pesan Jasa Angkut
              </h3>
              <div className="flex items-start justify-between gap-3">
                <span className="flex-1 text-[12px] font-medium leading-[14.4px] text-neutral-600">
                  Nominal Pesan Jasa Angkut (1 Unit)
                </span>
                <span className="text-right text-[12px] font-medium leading-[14.4px] text-neutral-900">
                  Rp950.000
                </span>
              </div>
            </div>

            {/* Biaya Asuransi */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
                Biaya Asuransi Barang
              </h3>
              <div className="flex items-start justify-between gap-3">
                <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                  Nominal Premi Asuransi (1 Unit)
                </span>
                <span className="text-right text-[12px] font-medium leading-[14.4px] text-neutral-900">
                  Rp10.000
                </span>
              </div>
            </div>

            {/* Biaya Layanan Tambahan */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
                Biaya Layanan Tambahan
              </h3>
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                    Nominal Kirim Bukti Fisik Penerimaan Barang
                  </span>
                  <button className="text-left text-[12px] font-semibold leading-[13.2px] text-primary-700">
                    Lihat Detail Pengiriman Dokumen
                  </button>
                </div>
                <span className="text-right text-[12px] font-medium leading-[14.4px] text-neutral-900">
                  Rp35.000
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                  Nominal Bantuan Tambahan
                </span>
                <span className="text-right text-[12px] font-medium leading-[14.4px] text-neutral-900">
                  Rp100.000
                </span>
              </div>
            </div>

            {/* Diskon Voucher */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
                Diskon Voucher
              </h3>
              <div className="flex items-start justify-between gap-3">
                <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                  -
                </span>
                <span className="text-right text-[12px] font-medium leading-[14.4px] text-error-400">
                  -
                </span>
              </div>
            </div>
          </div>

          {/* Biaya Lainnya Container */}
          <div className="flex flex-col gap-6 border-b border-neutral-400 pb-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
                Biaya Lainnya
              </h3>
              <div className="flex items-start justify-between gap-3">
                <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                  Admin Layanan
                </span>
                <span className="text-right text-[12px] font-medium leading-[14.4px] text-neutral-900">
                  Rp10.000
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                  Pajak
                </span>
                <span className="text-right text-[12px] font-medium leading-[14.4px] text-neutral-900">
                  -
                </span>
              </div>
            </div>
          </div>

          {/* Total Biaya */}
          <div className="flex items-start justify-between gap-4">
            <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
              Total Biaya
            </span>
            <span className="text-right text-[14px] font-semibold leading-[15.4px] text-neutral-900">
              Rp1.123.233
            </span>
          </div>
        </div>
      </div>

      <ResponsiveFooter className="flex flex-col gap-y-2.5">
        <button className="flex h-[44px] items-center justify-between rounded-md bg-primary-50 px-4">
          <div className="flex items-center gap-x-3">
            <IconComponent src="/icons/voucher24.svg" size="medium" />
            <span className="text-[14px] font-semibold leading-[15.4px] text-primary-700">
              Makin hemat pakai voucher
            </span>
          </div>
          <IconComponent src="/icons/chevron-right24.svg" size="medium" />
        </button>
        <Button
          variant="muatparts-primary"
          className="h-10"
          onClick={handleSubmit}
          type="button"
        >
          Lanjut
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};

export default InformasiPesananScreen;
