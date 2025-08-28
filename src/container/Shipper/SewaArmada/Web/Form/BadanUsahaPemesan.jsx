import { usePathname } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Form/Checkbox";
import { FormContainer } from "@/components/Form/Form";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";
import { handleFirstTime } from "@/lib/utils/form";

import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

export const BadanUsahaPemesan = () => {
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const businessEntity = useSewaArmadaStore(
    (state) => state.formValues.businessEntity
  );
  const { isBusinessEntity, name, taxId } = businessEntity;

  const { setField } = useSewaArmadaActions();
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    taxId: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setFormErrors((prevState) => ({
      ...prevState,
      [e.target.name]: undefined,
    }));
  };

  const handleToggleCheckbox = (checked) => {
    if (checked) {
      setFormData((prevState) => ({ ...prevState }));
      setModalType("create");
      setIsModalOpen(true);
    } else {
      const defaultData = {
        name: "",
        taxId: "",
      };
      setFormData(defaultData);
      setField("businessEntity", {
        ...defaultData,
        isBusinessEntity: false,
      });
    }
  };

  const handleSimpan = () => {
    const newErrors = {};
    const { name, taxId } = formData;
    if (!name) {
      newErrors.name = t(
        "BadanUsahaPemesan.errorNameRequired",
        {},
        "Nama badan usaha/perusahaan wajib diisi"
      );
    } else if (name.length < 3) {
      newErrors.name = t(
        "BadanUsahaPemesan.errorNameMinLength",
        {},
        "Nama badan usaha/perusahaan minimal 3 karakter"
      );
    } else if (/[^a-zA-Z\s]/.test(name)) {
      newErrors.name = t(
        "BadanUsahaPemesan.errorNameInvalid",
        {},
        "Nama badan usaha/perusahaan tidak valid"
      );
    }

    if (!taxId) {
      newErrors.taxId = t(
        "BadanUsahaPemesan.errorTaxIdRequired",
        {},
        "Nomor NPWP wajib diisi"
      );
    } else if (taxId.length < 15) {
      newErrors.taxId = t(
        "BadanUsahaPemesan.errorTaxIdMinLength",
        {},
        "Nomor NPWP minimal 15 digit"
      );
    } else if (taxId.length > 16) {
      newErrors.taxId = t(
        "BadanUsahaPemesan.errorTaxIdMaxLength",
        {},
        "Nomor NPWP maksimal 16 digit"
      );
    }

    if (Object.keys(newErrors).length === 0) {
      setField("businessEntity", {
        isBusinessEntity: true,
        name,
        taxId,
      });
      setIsModalOpen(false);
    } else {
      setFormErrors(newErrors);
    }
  };

  return (
    <>
      <FormContainer>
        {/* 25. 18 - Web - LB - 0001 */}
        <div className="text-sm font-semibold leading-[1.1] text-neutral-900 md:h-4 md:w-[174px] md:text-xs md:font-medium md:leading-[1.2] md:text-neutral-600">
          <span>{t("BadanUsahaPemesan.label", {}, "Badan Usaha Pemesan")}</span>
          <span className="block text-xxs md:text-xs md:font-medium md:italic md:text-neutral-500">
            {t("BadanUsahaPemesan.optional", {}, "(Opsional)")}
          </span>
        </div>
        <div className="flex flex-col gap-y-3">
          <div className="flex h-[16px] flex-row items-center gap-[4px]">
            <Checkbox
              disabled={isEditPage}
              onChange={({ checked }) =>
                handleFirstTime(() => handleToggleCheckbox(checked))
              }
              // 25. 18 - Web - LB - 0001
              label={t(
                "BadanUsahaPemesan.checkboxLabel",
                {},
                "Centang jika kamu merupakan suatu badan usaha/perusahan"
              )}
              checked={isBusinessEntity || isModalOpen}
              value="isBusinessEntity"
            />
            <InfoTooltip className="w-[336px]" side="right">
              <p>
                {t(
                  "BadanUsahaPemesan.tooltipText",
                  {},
                  "Jika kamu mencentang opsi ini kamu akan dikenakan PPh 23 terhadap pembayaran sewa jasa angkut yang kamu lakukan"
                )}
              </p>
            </InfoTooltip>
          </div>
          {isBusinessEntity && name && taxId ? (
            <div
              className={cn(
                "ml-6 flex gap-x-2 rounded-md border p-3",
                isEditPage
                  ? "border-neutral-600 bg-neutral-200"
                  : "border-primary-700 bg-primary-50"
              )}
            >
              <IconComponent src="/icons/profil-perusahaan16.svg" />
              <div className="flex flex-1 flex-col py-1">
                <div className="flex w-full flex-col gap-y-3">
                  <h4 className="text-xs font-bold leading-[14.4px] text-neutral-900">
                    {name}
                  </h4>
                  <div className="flex items-center gap-x-2">
                    <IconComponent src="/icons/nomor-amandemen16.svg" />
                    <div>
                      <div className="text-xs font-medium leading-[14.4px] text-neutral-900">
                        {t("BadanUsahaPemesan.taxIdLabel", {}, "Nomor NPWP :")}
                      </div>
                      <div className="text-xs font-semibold leading-[14.4px] text-neutral-900">
                        {taxId}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {isEditPage ? null : (
                <button
                  className="flex items-center gap-x-2 self-start"
                  onClick={() => {
                    setModalType("edit");
                    setIsModalOpen(true);
                  }}
                >
                  <span className="text-xs font-medium leading-[14.4px] text-primary-700">
                    {t("BadanUsahaPemesan.editButton", {}, "Ubah")}
                  </span>
                  <IconComponent
                    className="icon-fill-primary-700"
                    src="/icons/edit16.svg"
                  />
                </button>
              )}
            </div>
          ) : null}
        </div>
      </FormContainer>
      <Modal
        open={isModalOpen}
        onOpenChange={(value) => {
          if (modalType === "create") {
            setField("businessEntity", {
              ...businessEntity,
              isBusinessEntity: false,
            });
          }
          setFormErrors({});
          setIsModalOpen(value);
        }}
        closeOnOutsideClick={false}
      >
        <ModalContent type="muatmuat">
          <div className="flex flex-col gap-y-4 px-6 py-8">
            <div className="flex w-[424px] justify-center">
              <h1 className="text-base font-bold leading-[19.2px] text-neutral-900">
                {t("BadanUsahaPemesan.modalTitle", {}, "Informasi Badan Usaha")}
              </h1>
            </div>
            {/* Form Container */}
            <div className="flex w-full flex-col items-start gap-3">
              {/* Field 1 - Nama Badan Usaha */}
              <div className="flex w-full flex-col gap-3">
                <label className="text-xs font-medium leading-[14.4px] text-neutral-600">
                  {t(
                    "BadanUsahaPemesan.companyNameLabel",
                    {},
                    "Nama Badan Usaha/Perusahaan*"
                  )}
                </label>
                <Input
                  name="name"
                  placeholder={t(
                    "BadanUsahaPemesan.companyNamePlaceholder",
                    {},
                    "Masukkan Nama Badan Usaha/Perusahaan"
                  )}
                  value={formData.name}
                  onChange={handleInputChange}
                  errorMessage={formErrors.name}
                />
              </div>

              {/* Field 2 - Nomor NPWP */}
              <div className="flex w-full flex-col gap-3">
                <label className="text-xs font-medium leading-[14.4px] text-neutral-600">
                  {t("BadanUsahaPemesan.taxIdFormLabel", {}, "Nomor NPWP*")}
                </label>
                <Input
                  name="taxId"
                  placeholder={t(
                    "BadanUsahaPemesan.taxIdPlaceholder",
                    {},
                    "Masukkan Nomor NPWP"
                  )}
                  value={formData.taxId}
                  onChange={handleInputChange}
                  errorMessage={formErrors.taxId}
                />
              </div>
            </div>

            {/* Button Container */}
            <div className="flex w-full items-center justify-center">
              <Button
                variant="muatparts-primary"
                onClick={handleSimpan}
                className="min-w-[112px]"
              >
                {t("BadanUsahaPemesan.saveButton", {}, "Simpan")}
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};
