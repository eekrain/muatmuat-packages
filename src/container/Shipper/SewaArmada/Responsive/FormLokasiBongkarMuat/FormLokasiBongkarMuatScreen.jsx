import { MapPin, User } from "lucide-react";

import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import Input from "@/components/Form/Input";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { toast } from "@/lib/toast";
import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";
import { useSewaArmadaActions } from "@/store/Shipper/forms/sewaArmadaStore";

const MODE_MAP = {
  muat: "lokasiMuat",
  bongkar: "lokasiBongkar",
};

const FormLokasiBongkarMuatScreen = () => {
  const params = useResponsiveRouteParams();
  const navigation = useResponsiveNavigation();
  const { updateLokasi } = useSewaArmadaActions();
  const { formValues, formErrors, setField, validateLokasiBongkarMuat, reset } =
    useLocationFormStore();

  const handleUbahLokasi = () => {
    // Handle location change
    console.log("Change location");
  };

  const handleSave = () => {
    const isValid = validateLokasiBongkarMuat(
      params.config.formMode,
      params.config.index
    );
    if (!isValid) {
      /** Toast Error Setup */
      if (!formValues.namaPIC && !formValues.noHPPIC)
        toast.error("Terdapat field yang kosong");

      if (formErrors.dataLokasi) toast.error(formErrors.dataLokasi);

      return;
    }

    updateLokasi(
      MODE_MAP[params.config.formMode],
      params.config.index,
      formValues
    );
    navigation.popTo("/");

    // Reset form values in useLocationFormStore
    reset();
  };

  useShallowCompareEffect(() => {
    if (params?.config?.defaultValues) {
      reset(params.config.defaultValues);
    }
  }, [params?.config?.defaultValues]);

  return (
    <FormResponsiveLayout
      title={{
        label: params?.layout?.title || "Form Lokasi",
      }}
    >
      {/* Content Container */}
      <div className="flex flex-col gap-2">
        {/* Location Section */}
        <div className="bg-white px-4 py-5">
          <div className="flex flex-col gap-4">
            {/* Header with Ubah Lokasi */}
            <div className="flex items-center justify-between">
              <h2 className="flex-1 text-sm font-bold leading-[15px] text-black">
                {params.config.formMode === "muat"
                  ? "Lokasi Muat"
                  : "Lokasi Bongkar"}
              </h2>
              <button
                onClick={handleUbahLokasi}
                className="text-xs font-semibold leading-[13px] text-[#176CF7]"
              >
                Ubah Lokasi
              </button>
            </div>

            {/* Location Details */}
            <div className="flex items-center gap-2">
              <MapPin className="mt-0.5 h-6 w-6 flex-shrink-0 text-[#461B02]" />
              <p className="flex-1 text-sm font-medium leading-[15px] text-black">
                {formValues.dataLokasi?.location?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white px-4 py-5">
          <div className="flex flex-col gap-6">
            {/* Detail Lokasi Field */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-1">
                <label className="text-sm font-semibold leading-[15px] text-black">
                  Detail Lokasi
                </label>
                <span className="text-xxs font-semibold leading-[12px] text-black">
                  (Opsional)
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <div className="relative">
                  <textarea
                    value={formValues.detailLokasi}
                    onChange={(e) => {
                      const textarea = e.currentTarget;
                      textarea.style.height = "auto";
                      textarea.style.height = `${Math.min(textarea.scrollHeight, 72)}px`; // 72px is approximately 3 lines
                      setField("detailLokasi", textarea.value);
                    }}
                    placeholder="Masukkan Detail Lokasi"
                    className="min-h-8 w-full resize-none overflow-y-auto rounded-md border border-neutral-600 bg-white px-3 py-[6px] text-sm font-semibold placeholder:text-neutral-600 focus:border-primary-700 focus:outline-none"
                    maxLength={500}
                    rows={1}
                    style={{ height: "32px" }} // Initial height for 1 line
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-medium leading-[13px] text-neutral-600">
                  <span className="opacity-0">notes</span>
                  <span>{formValues.detailLokasi.length}/500</span>
                </div>
              </div>
            </div>

            {/* Nama PIC Field */}
            <div className="flex flex-col gap-4">
              <label className="text-sm font-semibold leading-[15px] text-black">
                Nama PIC Lokasi Lokasi{" "}
                {params.config.formMode === "muat" ? "Muat" : "Bongkar"}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-3">
                <Input
                  type="text"
                  placeholder={`Masukkan Nama PIC Lokasi ${
                    params.config.formMode === "muat" ? "Muat" : "Bongkar"
                  }`}
                  icon={{
                    right: <User className="h-4 w-4 text-[#176CF7]" />,
                  }}
                  value={formValues.namaPIC}
                  onChange={(e) => setField("namaPIC", e.target.value)}
                  errorMessage={formErrors?.namaPIC}
                />
              </div>
            </div>

            {/* No. HP PIC Field */}
            <div className="flex flex-col gap-4">
              <label className="text-sm font-semibold leading-[15px] text-black">
                No. HP PIC Lokasi{" "}
                {params.config.formMode === "muat" ? "Muat" : "Bongkar"}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-3">
                <Input
                  type="number"
                  placeholder="Contoh: 08xxxxxxxx"
                  value={formValues.noHPPIC}
                  onChange={(e) => {
                    const val = e.currentTarget.value;
                    if (val.length > 14) return;
                    setField("noHPPIC", val);
                  }}
                  errorMessage={formErrors?.noHPPIC}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ResponsiveFooter>
        <Button
          variant="muatparts-primary"
          className="w-full"
          onClick={handleSave}
        >
          Simpan
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};

export default FormLokasiBongkarMuatScreen;
