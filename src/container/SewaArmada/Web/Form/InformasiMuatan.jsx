import { useState } from "react";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import IconComponent from "@/components/IconComponent/IconComponent";
import { handleFirstTime } from "@/lib/utils/form";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

import { InformasiMuatanModal } from "../InformasiMuatan";
import { InformasiMuatanTable } from "../InformasiMuatan/InformasiMuatanTable";

export const InformasiMuatan = () => {
  const [isInformasiMuatanModalOpen, setIsInformasiMuatanModalOpen] =
    useState(false);
  const informasiMuatan = useSewaArmadaStore(
    (state) => state.formValues.informasiMuatan
  );
  const { setField } = useSewaArmadaActions();

  return (
    <>
      <FormContainer>
        <FormLabel required>Informasi Muatan</FormLabel>
        {informasiMuatan.length > 0 ? (
          <InformasiMuatanTable
            informasiMuatan={informasiMuatan}
            onClickUpdate={() => setIsInformasiMuatanModalOpen(true)}
          />
        ) : (
          <div
            className="flex h-8 flex-1 cursor-pointer items-center rounded-md border border-neutral-600 px-3"
            onClick={() =>
              handleFirstTime(() => setIsInformasiMuatanModalOpen(true))
            }
          >
            <IconComponent src="/icons/muatan16.svg" />
            <span className="ml-2 text-xs font-medium text-neutral-600">
              Masukkan Informasi Muatan
            </span>
          </div>
        )}
      </FormContainer>

      <InformasiMuatanModal
        open={isInformasiMuatanModalOpen}
        onOpenChange={setIsInformasiMuatanModalOpen}
        maxInformasiMuatan={5}
        onSaveInformasiMuatan={(data) => setField("informasiMuatan", data)}
        defaultValues={informasiMuatan}
      />
    </>
  );
};
