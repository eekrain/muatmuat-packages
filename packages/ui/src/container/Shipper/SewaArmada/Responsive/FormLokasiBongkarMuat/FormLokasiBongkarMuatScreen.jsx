import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import { ExpandableTextArea } from "@/components/Form/ExpandableTextArea";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";

import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useTranslation } from "@/hooks/use-translation";

import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { toast } from "@/lib/toast";

import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";
import { useSewaArmadaActions } from "@/store/Shipper/forms/sewaArmadaStore";

const MODE_MAP = {
  muat: "lokasiMuat",
  bongkar: "lokasiBongkar",
};

const FormLokasiBongkarMuatScreen = () => {
  const params = useResponsiveRouteParams();
  const navigation = useResponsiveNavigation();
  const { t } = useTranslation();
  const { updateLokasi, setField: setSewaArmadaField } = useSewaArmadaActions();
  const { formValues, formErrors, setField, validateLokasiBongkarMuat, reset } =
    useLocationFormStore();
  const validateLokasiOnSelect = useLocationFormStore(
    (s) => s.validateLokasiOnSelect
  );

  const handleUbahLokasi = () => {
    // Handle location change
    const field = {
      muat: "lokasiMuat",
      bongkar: "lokasiBongkar",
    };
    const newParams = {
      formMode: params.config.formMode,
      allSelectedLocations: formValues[field[params.config.formMode]],
      index: params.config.index,
      needValidateLocationChange: params.config.needValidateLocationChange,
    };
    const navigateToForm = async (defaultValues) => {
      navigation.push("/FormLokasiBongkarMuat", {
        config: {
          ...newParams,
          defaultValues,
        },
        layout: {
          title:
            params.config.formMode === "bongkar"
              ? "Lokasi Bongkar"
              : "Lokasi Muat",
        },
      });
    };
    navigation.push("/PencarianLokasi", {
      config: {
        ...newParams,
        afterLocationSelected: async () => {
          // delay 500ms untuk menunggu data lokasi terisi
          await new Promise((resolve) => setTimeout(resolve, 500));
          const defaultValues = useLocationFormStore.getState().formValues;
          navigateToForm(defaultValues);
        },
        validateLokasiOnSelect: (selectedAddress) => {
          const error = validateLokasiOnSelect(
            params.config.formMode,
            params.config.index,
            selectedAddress
          );

          if (error) {
            toast.error(error);
            throw new Error(error);
          }
        },
      },
      layout: {
        title:
          params.config.formMode === "bongkar"
            ? "Cari Lokasi Bongkar"
            : "Cari Lokasi Muat",
      },
    });
  };

  const handleSave = () => {
    const isValid = validateLokasiBongkarMuat(
      params.config.formMode,
      params.config.index,
      true
    );
    if (!isValid) {
      /** Toast Error Setup */
      if (!formValues.namaPIC && !formValues.noHPPIC)
        // Terdapat field yang kosong
        toast.error(t("messageEmptyFields"));

      if (formErrors.dataLokasi) toast.error(formErrors.dataLokasi);

      return;
    }

    updateLokasi(
      MODE_MAP[params.config.formMode],
      params.config.index,
      formValues
    );
    setSewaArmadaField("hasUpdatedForm", true);
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
        // "Form Lokasi"
        label: params?.layout?.title || t("titleFormLocation"),
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
                {/* "Lokasi Muat" / "Lokasi Bongkar" */}
                {params.config.formMode === "muat"
                  ? t("titleLoadingLocation")
                  : t("titleUnloadingLocation")}
              </h2>
              <button
                onClick={handleUbahLokasi}
                className="text-xs font-semibold leading-[13px] text-[#176CF7]"
              >
                {/* "Ubah Lokasi" */}
                {t("buttonChangeLocation")}
              </button>
            </div>

            {/* Location Details */}
            <div className="flex items-center gap-2">
              <IconComponent
                src="/icons/marker-outline.svg"
                className="size-6 text-muat-trans-secondary-900"
              />
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

            <FormContainer>
              <FormLabel optional>{t("labelLocationDetail")}</FormLabel>
              <ExpandableTextArea
                value={formValues.detailLokasi}
                onChange={(e) => setField("detailLokasi", e.target.value)}
                placeholder={t("placeholderEnterLocationDetail")}
                maxLength={500}
                errorMessage={formErrors?.detailLokasi}
                appearance={{
                  inputClassName: "resize-none h-8",
                }}
                withCharCount={!!formValues.detailLokasi}
              />
            </FormContainer>

            {/* Nama PIC Field */}
            <FormContainer>
              <FormLabel required>
                {params.config.formMode === "muat"
                  ? t("labelPICNameLoadingLocation")
                  : t("labelPICNameUnloadingLocation")}
              </FormLabel>

              <Input
                type="text"
                // "Masukkan Nama PIC Lokasi Muat" / "Masukkan Nama PIC Lokasi Bongkar"
                placeholder={
                  params.config.formMode === "muat"
                    ? t("placeholderEnterPICNameLoadingLocation")
                    : t("placeholderEnterPICNameUnloadingLocation")
                }
                value={formValues.namaPIC}
                onChange={(e) => setField("namaPIC", e.target.value)}
                errorMessage={formErrors?.namaPIC}
                icon={{
                  right: "/icons/user-contact.svg",
                }}
                appearance={{
                  inputClassName: "truncate",
                  iconClassName: "size-4 text-primary-700",
                }}
              />
            </FormContainer>
            {/* No. HP PIC Field */}
            <div className="flex flex-col gap-4">
              <label className="text-sm font-semibold leading-[15px] text-black">
                {/* "No. HP PIC Lokasi Muat" / "No. HP PIC Lokasi Bongkar" */}
                {params.config.formMode === "muat"
                  ? t("labelPICPhoneLoadingLocation")
                  : t("labelPICPhoneUnloadingLocation")}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-3">
                <Input
                  type="number"
                  // "Contoh: 08xxxxxxxx"
                  placeholder={t("placeholderPhoneNumberExample")}
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
          {/* "Simpan" */}
          {t("buttonSave")}
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};

export default FormLokasiBongkarMuatScreen;
