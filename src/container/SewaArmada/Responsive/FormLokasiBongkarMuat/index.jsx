import { MapPin, User } from "lucide-react";

import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import { cn } from "@/lib/cn";
import { useResponsiveRouteParams } from "@/lib/responsive-navigation";
import { toast } from "@/lib/toast";
import { useLocationFormStore } from "@/store/forms/locationFormStore";

export const FormLokasiBongkarMuat = () => {
  const params = useResponsiveRouteParams();
  console.log("🚀 ~ FormLokasiBongkarMuat ~ params:", params);
  const {
    formValues,
    formErrors,
    setField,
    setLocationPartial,
    validateForm,
    reset,
  } = useLocationFormStore();

  const handleBack = () => {
    // Handle back navigation
    console.log("Navigate back");
  };

  const handleUbahLokasi = () => {
    // Handle location change
    console.log("Change location");
  };

  const handleSave = () => {
    console.log("Save");
    const isValid = validateForm(
      params.config.formMode,
      params.config.allSelectedLocations,
      params.config.index
    );
    if (!isValid) {
      if (!formValues.namaPIC && !formValues.noHPPIC) {
        toast.error("Terdapat field yang kosong");
      }
      return;
    }
  };

  return (
    <FormResponsiveLayout
      title={{
        label: "Lokasi Muat",
      }}
    >
      {/* Content Container */}
      <div className="flex flex-col gap-2">
        {/* Location Section */}
        <div className="bg-white px-4 py-5">
          <div className="flex flex-col gap-4">
            {/* Header with Ubah Lokasi */}
            <div className="flex items-center justify-between">
              <h2 className="flex-1 text-[14px] font-bold leading-[15px] text-black">
                Lokasi Muat
              </h2>
              <button
                onClick={handleUbahLokasi}
                className="text-[12px] font-semibold leading-[13px] text-[#176CF7]"
              >
                Ubah Lokasi
              </button>
            </div>

            {/* Location Details */}
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-6 w-6 flex-shrink-0 text-[#461B02]" />
              <p className="flex-1 text-[14px] font-medium leading-[15px] text-black">
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
                <label className="text-[14px] font-semibold leading-[15px] text-black">
                  Detail Lokasi
                </label>
                <span className="text-[10px] font-semibold leading-[12px] text-black">
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
                    className="min-h-8 w-full resize-none overflow-y-auto rounded-md border border-neutral-600 bg-white px-3 py-[6px] text-[14px] font-semibold text-neutral-600 placeholder:text-neutral-600 focus:border-primary-700 focus:outline-none"
                    maxLength={500}
                    rows={1}
                    style={{ height: "32px" }} // Initial height for 1 line
                  />
                </div>
                <div className="flex items-center justify-between text-[12px] font-medium leading-[13px] text-neutral-600">
                  <span className="opacity-0">notes</span>
                  <span>{formValues.detailLokasi.length}/500</span>
                </div>
              </div>
            </div>

            {/* Nama PIC Field */}
            <div className="flex flex-col gap-4">
              <label className="text-[14px] font-semibold leading-[15px] text-black">
                Nama PIC Lokasi Muat<span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="text"
                    value={formValues.namaPIC}
                    onChange={(e) => setField("namaPIC", e.target.value)}
                    placeholder="Masukkan Nama PIC Lokasi Muat"
                    className={cn(
                      "h-8 w-full rounded-md border border-neutral-600 bg-white px-3 py-3 text-[14px] font-semibold text-neutral-600 placeholder:text-neutral-600 focus:border-primary-700 focus:outline-none",
                      formErrors?.namaPIC && "border-red-500"
                    )}
                  />
                  <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#176CF7]" />
                </div>

                {formErrors?.namaPIC && (
                  <span className="text-xs font-medium leading-[1] text-red-500">
                    {formErrors?.namaPIC}
                  </span>
                )}
              </div>
            </div>

            {/* No. HP PIC Field */}
            <div className="flex flex-col gap-4">
              <label className="text-[14px] font-semibold leading-[15px] text-black">
                No. HP PIC Lokasi Muat<span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-3">
                <input
                  type="number"
                  value={formValues.noHPPIC}
                  onChange={(e) => {
                    const val = e.currentTarget.value;
                    if (val.length > 14) return;
                    setField("noHPPIC", val);
                  }}
                  placeholder="Contoh: 08xxxxxxxx"
                  className={cn(
                    "h-8 w-full rounded-md border border-neutral-600 bg-white px-3 py-2.5 text-[14px] font-semibold text-neutral-600 placeholder:text-neutral-600 focus:border-primary-700 focus:outline-none",
                    formErrors?.noHPPIC && "border-red-500"
                  )}
                />
                {formErrors?.noHPPIC && (
                  <span className="text-xs font-medium text-red-500">
                    {formErrors?.noHPPIC}
                  </span>
                )}
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
