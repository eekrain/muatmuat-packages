import { useState } from "react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import Input from "@/components/Form/Input";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { handleFirstTime } from "@/lib/utils/form";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

export const BadanUsahaPemesan = () => {
  const businessEntity = useSewaArmadaStore(
    (state) => state.formValues.businessEntity
  );
  const isBusinessEntity = useSewaArmadaStore(
    (state) => state.formValues.businessEntity.isBusinessEntity
  );
  // const name = useSewaArmadaStore(
  //   (state) => state.formValues.businessEntity.name
  // );
  // const taxId = useSewaArmadaStore(
  //   (state) => state.formValues.businessEntity.taxId
  // );

  const { setField } = useSewaArmadaActions();

  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setField("businessEntity", {
      isBusinessEntity: checked,
      name: "",
      taxId: "",
    });
    if (checked) {
      setIsModalOpen(true);
    } else {
      setFormData({
        name: "",
        taxId: "",
      });
    }
  };

  const handleSimpan = () => {
    const newErrors = {};
    const { name, taxId } = formData;
    if (!name) {
      newErrors.name = "Nama badan usaha/perusahaan wajib diisi";
    } else if (name.length < 3) {
      newErrors.name = "Nama badan usaha/perusahaan minimal 3 karakter";
    } else if (/[^a-zA-Z]/.test(name)) {
      newErrors.name = "Nama badan usaha/perusahaan tidak valid";
    }

    if (!taxId) {
      newErrors.taxId = "Nomor NPWP wajib diisi";
    } else if (taxId.length < 15) {
      newErrors.taxId = "Nomor NPWP minimal 15 digit";
    } else if (taxId.length > 15) {
      newErrors.taxId = "Nomor NPWP maksimal 16 digit";
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
        <FormLabel variant="small">Tipe Pemesan</FormLabel>
        <div className="flex h-[16px] flex-row items-center gap-[4px]">
          <Checkbox
            onChange={({ checked }) =>
              handleFirstTime(() => handleToggleCheckbox(checked))
            }
            label="Centang jika kamu adalah suatu perusahaan/badan usaha"
            checked={isBusinessEntity}
            value="isBusinessEntity"
          />
          {/* <IconComponent src="/icons/info16.svg" width={16} height={16} /> */}
          <InfoTooltip className="w-[336px]" side="right">
            <p>
              Jika kamu mencentang opsi ini kamu akan dikenakan PPh 23 terhadap
              pembayaran sewa jasa angkut yang kamu lakukan
            </p>
          </InfoTooltip>
        </div>
      </FormContainer>
      <Modal
        open={isModalOpen}
        onOpenChange={(value) => {
          setField("businessEntity", {
            ...businessEntity,
            isBusinessEntity: false,
          });
          setFormErrors({});
          setIsModalOpen(value);
        }}
        closeOnOutsideClick={false}
      >
        <ModalContent type="muatmuat">
          <div className="flex flex-col gap-y-4 px-6 py-8">
            <div className="flex w-[424px] justify-center">
              <h1 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
                Informasi Badan Usaha
              </h1>
            </div>
            {/* Form Container */}
            <div className="flex w-full flex-col items-start gap-3">
              {/* Field 1 - Nama Badan Usaha */}
              <div className="flex w-full flex-col gap-3">
                <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                  Nama Badan Usaha/Perusahaan*
                </label>
                <Input
                  name="name"
                  placeholder="Masukkan Nama Badan Usaha/Perusahaan"
                  value={formData.name}
                  onChange={handleInputChange}
                  errorMessage={formErrors.name}
                />
              </div>

              {/* Field 2 - Nomor NPWP */}
              <div className="flex w-full flex-col gap-3">
                <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                  Nomor NPWP*
                </label>
                <Input
                  name="taxId"
                  placeholder="Masukkan Nomor NPWP"
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
                Simpan
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};
