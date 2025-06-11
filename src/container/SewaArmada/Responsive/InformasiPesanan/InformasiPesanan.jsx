"use client";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import { InfoBottomsheet } from "@/components/Form/InfoBottomsheet";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import Input from "@/components/Input/Input";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import {
  useInformasiPesananActions,
  useInformasiPesananStore,
} from "@/store/forms/informasiPesananStore";

const InformasiPesanan = () => {
  // Get state from Zustand store
  const { formValues, formErrors } = useInformasiPesananStore();
  const {
    uploadedImages,
    deskripsiMuatan,
    isBadanUsaha,
    deliveryOrder,
    showDOInput,
    badanUsahaData,
  } = formValues;

  // Get actions from Zustand store
  const {
    setField,
    setBadanUsahaField,
    handleImageUpload,
    handleBadanUsahaToggle,
    handleAddDeliveryOrder,
    validateForm,
  } = useInformasiPesananActions();

  // Event handlers
  const handleCheckboxChange = ({ checked }) => {
    handleBadanUsahaToggle(checked);
  };

  const handleBadanUsahaInputChange = (field) => (e) => {
    setBadanUsahaField(field, e.target.value);
  };

  const handleDeskripsiChange = (e) => {
    setField("deskripsiMuatan", e.target.value);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Navigate to next page or submit form
      // navigation.push("/NextPage");
      console.log("Form is valid, proceeding...");
    }
  };

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
          <div
            className="relative size-[68px] rounded border border-neutral-400 bg-neutral-100 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(/img/light-truck-cold-diesel-engkel-reefer.png)",
            }}
          >
            <button className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-white">
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
              {[0, 1, 2, 3].map((index) => (
                <ImageUploader
                  key={index}
                  className="size-[72px]"
                  getImage={(imageData) => handleImageUpload(index, imageData)}
                  uploadText="Unggah"
                  errorText="Ulangi"
                  maxSize={10}
                  value={uploadedImages[index]}
                  acceptedFormats={[".jpg", ".jpeg", ".png"]}
                  onUpload={(imageData) => handleImageUpload(index, imageData)}
                  onError={() => {}}
                />
              ))}
            </div>

            {formErrors.uploadedImages && (
              <p className="text-[12px] font-medium leading-[14.4px] text-error-400">
                {formErrors.uploadedImages}
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
                <textarea
                  value={deskripsiMuatan}
                  onChange={handleDeskripsiChange}
                  placeholder="Lengkapi deskripsi informasi muatan kamu dengan rincian spesifik terkait barang yang dikirim, seperti bahan, penggunaan, atau karakteristik unik lainnya."
                  className={`h-[77px] w-full resize-none rounded-md border bg-white p-3 text-[14px] font-semibold placeholder:text-neutral-600 hover:border-primary-700 focus:border-primary-700 focus:outline-none ${
                    formErrors.deskripsiMuatan
                      ? "border-error-400 text-error-400"
                      : "border-neutral-600 text-neutral-600"
                  }`}
                  maxLength={500}
                />
              </div>

              {formErrors.deskripsiMuatan && (
                <p className="text-[12px] font-medium leading-[14.4px] text-error-400">
                  {formErrors.deskripsiMuatan}
                </p>
              )}

              <div className="flex justify-end">
                <span className="text-[12px] font-medium text-neutral-600">
                  {deskripsiMuatan.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* No. Delivery Order */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <h2 className="text-[14px] font-semibold text-neutral-900">
                No. Delivery Order (DO)
              </h2>
              <span className="text-[10px] font-semibold text-neutral-900">
                (Opsional)
              </span>
              <IconComponent
                src="/icons/info.svg"
                width={16}
                height={16}
                classname="icon-gray"
              />
            </div>
            <button
              onClick={handleAddDeliveryOrder}
              className="text-[14px] font-semibold text-primary-700"
            >
              Tambah
            </button>
          </div>

          {/* Delivery Order Input - Show when button is clicked */}
          {showDOInput && (
            <div className="flex flex-col gap-3">
              <Input
                type="text"
                name="deliveryOrder"
                placeholder="Masukkan No. Delivery Order"
                value={deliveryOrder}
                onChange={(e) => setField("deliveryOrder", e.target.value)}
                classname="w-full"
              />
            </div>
          )}
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
            checked={isBadanUsaha}
            onChange={handleCheckboxChange}
            value="badanUsaha"
            classname="bank_checkbox"
          />

          {/* Form Fields - Only show when checkbox is checked */}
          {isBadanUsaha && (
            <div className="mt-2 flex flex-col gap-4">
              {/* Field Nama Badan Usaha */}
              <div className="flex flex-col gap-3">
                <label className="text-[14px] font-semibold leading-[15.4px] text-neutral-900">
                  Nama Badan Usaha/Perusahaan*
                </label>
                <Input
                  type="text"
                  name="namaBadanUsaha"
                  placeholder="Masukkan Nama Badan Usaha/Perusahaan"
                  value={badanUsahaData.namaBadanUsaha}
                  onChange={handleBadanUsahaInputChange("namaBadanUsaha")}
                  classname="w-full"
                  status={formErrors.namaBadanUsaha ? "error" : null}
                  supportiveText={{ title: formErrors?.namaBadanUsaha ?? "" }}
                />
              </div>

              {/* Field Nomor NPWP */}
              <div className="flex flex-col gap-3">
                <label className="text-[14px] font-semibold leading-[15.4px] text-neutral-900">
                  Nomor NPWP*
                </label>
                <Input
                  type="text"
                  name="nomorNPWP"
                  placeholder="Masukkan Nomor NPWP Perusahaan"
                  value={badanUsahaData.nomorNPWP}
                  onChange={handleBadanUsahaInputChange("nomorNPWP")}
                  classname="w-full"
                  status={formErrors.nomorNPWP ? "error" : null}
                  supportiveText={{ title: formErrors?.nomorNPWP ?? "" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Opsi Pembayaran */}
        <div className="flex items-center justify-between rounded-md bg-white p-4">
          <h2 className="text-[14px] font-semibold text-neutral-900">
            Opsi Pembayaran
          </h2>
          <button className="text-[14px] font-semibold text-primary-700">
            Pilih
          </button>
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
        <button className="flex justify-between">
          <div>
            <span>Makin hemat pakai voucher</span>
          </div>
        </button>
        <Button
          variant="muatparts-primary"
          className="flex-1"
          onClick={handleSubmit}
          type="button"
        >
          Lanjut
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};

export default InformasiPesanan;
