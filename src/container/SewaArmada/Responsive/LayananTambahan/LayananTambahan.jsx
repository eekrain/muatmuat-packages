import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import DropdownRadioBottomsheeet from "@/components/Dropdown/DropdownRadioBottomsheeet";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoBottomsheet } from "@/components/Form/InfoBottomsheet";
import IconComponent from "@/components/IconComponent/IconComponent";
import Input from "@/components/Input/Input";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import useTempLayananTambahanStore from "@/store/forms/tempLayananTambahanStore";

const LayananTambahan = () => {
  // dummy data
  const kodePosOptions = [
    {
      label: "60261",
      value: "60261",
    },
    {
      label: "60262",
      value: "60262",
    },
    {
      label: "60263",
      value: "60263",
    },
    {
      label: "60264",
      value: "60264",
    },
    {
      label: "60265",
      value: "60265",
    },
  ];
  // Zustand store
  const {
    namaPenerima,
    nomorHandphone,
    alamatTujuan,
    detailAlamat,
    kecamatan,
    kodePos,
    kirimBuktiFisik,
    bantuanTambahan,
    troli,
    showOtherAdditionalServices,
    updateFormData,
    setKirimBuktiFisik,
    setBantuanTambahan,
    setTroli,
    toggleOtherAdditionalServices,
  } = useTempLayananTambahanStore();

  // Handler untuk form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData(name, value);
  };

  return (
    <FormResponsiveLayout
      title={{
        label: "Layanan Tambahan",
      }}
    >
      <div className="mb-16 flex flex-col gap-y-2 bg-neutral-200">
        {/* Form Container Utama */}
        <div className="flex flex-col gap-6 rounded-none bg-white p-5 px-4">
          {/* Section 1: Checkbox Kirim Bukti Fisik */}
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-1 text-neutral-900">
              <Checkbox
                label="Kirim Bukti Fisik Penerimaan Barang"
                checked={kirimBuktiFisik}
                onClick={setKirimBuktiFisik}
              />

              <InfoBottomsheet title="Kirim Bukti Fisik Penerimaan Barang">
                {/* Main Content Area - Frame 42239 */}
                <span className="text-[14px] font-medium leading-[15.4px] text-neutral-900">
                  Pilih opsi ini jika kamu ingin dokumen surat jalan atau
                  dokumen pendukung lainnya, dikembalikan ke alamat tujuan yang
                  kamu isikan. Biaya pengiriman akan mengikuti alamat tujuan
                  tersebut.
                </span>
              </InfoBottomsheet>
            </div>

            <span className="ml-6 text-[14px] font-medium leading-[15.4px] text-neutral-600">
              Rp-
            </span>
          </div>

          {/* Section 2: Form Fields */}
          <div className="flex w-full flex-col gap-6">
            {/* Nama Penerima Field */}
            <FormContainer>
              <FormLabel required>Nama Penerima</FormLabel>
              <Input
                placeholder="Masukkan Nama Penerima"
                icon={{
                  right: (
                    <IconComponent
                      className="icon-fill-primary-700"
                      src="/icons/kontak-perusahaan16.svg"
                      onClick={async () => {
                        // alert("navigator.contacts" in navigator);
                        // alert(typeof navigator.contacts?.select);
                        if (
                          "contacts" in navigator &&
                          "select" in navigator.contacts
                        ) {
                          const props = ["name", "tel"];
                          const opts = { multiple: false };

                          try {
                            const contacts = await navigator.contacts.select(
                              props,
                              opts
                            );
                            if (
                              contacts.length > 0 &&
                              contacts[0].tel &&
                              contacts[0].tel.length > 0
                            ) {
                              alert(contacts[0].tel[0]); // Display first phone number
                              updateFormData(name, value);
                            } else {
                              alert("No phone number found.");
                            }
                          } catch (ex) {
                            console.error("Contact Picker failed", ex);
                          }
                        } else {
                          alert(
                            "Contact Picker API is not supported on this browser."
                          );
                          console.warn("navigator.contacts is not available.");
                        }
                      }}
                    />
                  ),
                }}
                name="namaPenerima"
                type="text"
                value={namaPenerima}
                onChange={handleInputChange}
              />
            </FormContainer>

            {/* Nomor Handphone Penerima Field */}
            <FormContainer>
              <FormLabel required>Nomor Handphone Penerima</FormLabel>
              <Input
                placeholder="Contoh: 08xxxxxxxx"
                name="nomorHandphone"
                type="text"
                value={nomorHandphone}
                onChange={handleInputChange}
              />
            </FormContainer>

            {/* Alamat Tujuan Field */}
            <FormContainer>
              <FormLabel required>Alamat Tujuan</FormLabel>
              <Input
                placeholder="Masukkan Alamat Tujuan"
                name="alamatTujuan"
                type="text"
                value={alamatTujuan}
                onChange={handleInputChange}
              />
            </FormContainer>

            {/* Detail Alamat Tujuan Field */}
            <FormContainer className="h-[78px]">
              <FormLabel required>Detail Alamat Tujuan</FormLabel>
              <Input
                placeholder="Masukkan Detail Alamat Tujuan"
                name="detailAlamat"
                type="text"
                supportiveText={{ desc: `${detailAlamat.length}/500` }}
                value={detailAlamat}
                onChange={handleInputChange}
              />
            </FormContainer>

            {/* Kecamatan Field */}
            <FormContainer>
              <FormLabel required>Kecamatan</FormLabel>
              <Input
                placeholder="Pilih Kecamatan Tujuan"
                icon={{ left: "/icons/ic-sport-winner.svg" }}
                name="kecamatan"
                type="text"
                value={kecamatan}
                onChange={handleInputChange}
              />
            </FormContainer>

            {/* Kabupaten/Kota Display */}
            <div className="flex flex-col gap-y-4">
              <span className="leading-[15.4px text-[14px] font-semibold text-neutral-900">
                Kabupaten/Kota
              </span>
              <span className="flex h-2 items-center text-[12px] font-semibold leading-[13.2px] text-black">
                -
              </span>
            </div>

            {/* Provinsi Display */}
            <div className="flex flex-col gap-y-4">
              <span className="leading-[15.4px text-[14px] font-semibold text-neutral-900">
                Provinsi
              </span>
              <span className="flex h-2 items-center text-[12px] font-semibold leading-[13.2px] text-black">
                -
              </span>
            </div>

            {/* Kode Pos Field */}
            <FormContainer>
              <FormLabel required>Kode Pos</FormLabel>
              <DropdownRadioBottomsheeet
                className="w-full"
                title="Kode Pos"
                options={kodePosOptions}
                value={kodePos}
                onChange={(value) => updateFormData("kodePos", value)}
                saveLabel="Simpan"
                placeHolder="Pilih Kode Pos"
              />
            </FormContainer>

            {/* Section 3: Pilih Opsi Pengiriman */}
            <div className="flex h-11 w-full cursor-pointer flex-row items-center justify-between rounded-md bg-neutral-200 px-4">
              <div className="flex h-7 items-center gap-x-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white p-1.5">
                  <IconComponent src="/icons/transporter16.svg" />
                </div>
                <span className="text-[14px] font-semibold leading-[15.4px] text-neutral-700">
                  Pilih Opsi Pengiriman
                </span>
              </div>
              <IconComponent src="/icons/chevron-right24.svg" size="medium" />
            </div>
          </div>
        </div>

        {/* Section 4: Layanan Tambahan Lainnya */}
        <div className="flex w-full flex-col gap-y-6 rounded-none bg-white p-5 px-4">
          {/* Section Header */}
          <button
            className="flex h-5 w-full flex-row items-center justify-between gap-4"
            onClick={toggleOtherAdditionalServices}
          >
            <span className="flex items-center text-[14px] font-bold leading-[15.4px] text-neutral-900">
              Layanan Tambahan Lainnya
            </span>
            <IconComponent
              src="/icons/chevron-up20.svg"
              width={20}
              height={20}
            />
          </button>

          {/* Services List Container */}
          {showOtherAdditionalServices ? (
            <div className="flex flex-col gap-y-4">
              {/* Bantuan Tambahan Checkbox */}
              <div className="flex flex-col gap-y-2">
                <FormLabel
                  required
                  tooltip={
                    <InfoBottomsheet title="Bantuan Tambahan">
                      <p>
                        Pilih opsi ini jika kamu memerlukan bantuan kenek untuk
                        proses bongkar-muat barang.
                      </p>
                    </InfoBottomsheet>
                  }
                >
                  Bantuan Tambahan
                </FormLabel>
                <span className="ml-6 text-[14px] font-medium leading-[15.4px] text-neutral-600">
                  Rp100.000
                </span>
              </div>

              {/* Troli Checkbox */}
              <div className="flex flex-col gap-y-2">
                <FormLabel>
                  <Checkbox label="Troli" checked={troli} onClick={setTroli} />
                  <InfoBottomsheet title="Troli">
                    {/* Main Content Area - Frame 42239 */}
                    <span className="text-[14px] font-medium leading-[15.4px] text-neutral-900">
                      Pilih opsi ini jika kamu memerlukan bantuan troli untuk
                      proses bongkar-muat barang.
                    </span>
                  </InfoBottomsheet>
                </FormLabel>
                <span className="ml-6 text-[14px] font-medium leading-[15.4px] text-neutral-600">
                  Rp75.000
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <ResponsiveFooter className="flex gap-3">
        <Button
          variant="muatparts-primary"
          className="flex-1"
          onClick={() => {}}
          type="button"
        >
          Simpan
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};

export default LayananTambahan;
