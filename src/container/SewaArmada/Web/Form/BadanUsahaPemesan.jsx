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
  const isCompany = useSewaArmadaStore((state) => state.formValues.isCompany);
  const companyName = useSewaArmadaStore(
    (state) => state.formValues.companyName
  );
  const companyNpwp = useSewaArmadaStore(
    (state) => state.formValues.companyNpwp
  );
  const { setField } = useSewaArmadaActions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    companyNpwp: "",
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
    setField("isCompany", checked);
    if (checked) {
      setFormData({ companyName, companyNpwp });
      setIsModalOpen(true);
    } else {
      setField("companyName", "");
      setField("companyNpwp", "");
    }
  };

  const handleSimpan = () => {
    const newErrors = {};
    const { companyName, companyNpwp } = formData;
    if (!companyName) {
      newErrors.companyName = "Nama badan usaha/perusahaan wajib diisi";
    } else if (companyName.length < 3) {
      newErrors.companyName = "Nama badan usaha/perusahaan minimal 3 karakter";
    } else if (/[^a-zA-Z]/.test(companyName)) {
      newErrors.companyName = "Nama badan usaha/perusahaan tidak valid";
    }

    if (!companyNpwp) {
      newErrors.companyNpwp = "Nomor NPWP wajib diisi";
    } else if (companyNpwp.length < 15) {
      newErrors.companyNpwp = "Nomor NPWP minimal 15 digit";
    } else if (companyNpwp.length > 15) {
      newErrors.companyNpwp = "Nomor NPWP maksimal 16 digit";
    }

    if (Object.keys(newErrors).length === 0) {
      setField("companyName", companyName);
      setField("companyNpwp", companyNpwp);
      setIsModalOpen(false);
    } else {
      setFormErrors(newErrors);
    }
  };
  // setField("isCompany", e.checked)
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
            checked={isCompany}
            value="is_company"
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
          setIsModalOpen(value);
          setField("isCompany", false);
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
                  name="companyName"
                  placeholder="Masukkan Nama Badan Usaha/Perusahaan"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  errorMessage={formErrors.companyName}
                />
              </div>

              {/* Field 2 - Nomor NPWP */}
              <div className="flex w-full flex-col gap-3">
                <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                  Nomor NPWP*
                </label>
                <Input
                  name="companyNpwp"
                  placeholder="Masukkan Nomor NPWP"
                  value={formData.companyNpwp}
                  onChange={handleInputChange}
                  errorMessage={formErrors.companyNpwp}
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
