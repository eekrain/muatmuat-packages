import { usePathname } from "next/navigation";
import { useState } from "react";

import { ChevronRight } from "lucide-react";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import IconComponent from "@/components/IconComponent/IconComponent";

import { InformasiMuatanModal } from "@/container/Shipper/SewaArmada/Web/InformasiMuatan";
import { InformasiMuatanTable } from "@/container/Shipper/SewaArmada/Web/InformasiMuatan/InformasiMuatanTable";

import { useTranslation } from "@/hooks/use-translation";

import { compareArraysByNameOnly } from "@/lib/utils/array";
import { handleFirstTime } from "@/lib/utils/form";

import { useSelectArmadaModalAction } from "@/store/Shipper/forms/selectArmadaModalStore";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

export const InformasiMuatan = ({ onFetchTrucks }) => {
  const [isInformasiMuatanModalOpen, setIsInformasiMuatanModalOpen] =
    useState(false);
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const informasiMuatan = useSewaArmadaStore(
    (state) => state.formValues.informasiMuatan
  );
  const truckTypeId = useSewaArmadaStore(
    (state) => state.formValues.truckTypeId
  );
  const { setField } = useSewaArmadaActions();
  const { setIsOpen, setIsDimensionOrWeightChanged, setType } =
    useSelectArmadaModalAction();
  const { t } = useTranslation();

  return (
    <>
      <FormContainer>
        <FormLabel required>
          {t("InformasiMuatan.title", {}, "Informasi Muatan")}
        </FormLabel>
        {informasiMuatan.length > 0 ? (
          <InformasiMuatanTable
            informasiMuatan={informasiMuatan}
            onClickUpdate={() => setIsInformasiMuatanModalOpen(true)}
            disableUpdateButton={isEditPage}
          />
        ) : (
          <div
            className="flex h-8 flex-1 cursor-pointer items-center justify-between rounded-md border border-neutral-600 px-3"
            onClick={() =>
              handleFirstTime(() => setIsInformasiMuatanModalOpen(true))
            }
          >
            <div className="flex items-center gap-2">
              <IconComponent
                src="/icons/muatan16.svg"
                className="text-neutral-700"
              />
              <span className="ml-2 text-xs font-medium text-neutral-600">
                {t(
                  "InformasiMuatan.placeholder",
                  {},
                  "Masukkan Informasi Muatan"
                )}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-700" />
          </div>
        )}
      </FormContainer>

      <InformasiMuatanModal
        open={isInformasiMuatanModalOpen}
        onOpenChange={setIsInformasiMuatanModalOpen}
        maxInformasiMuatan={10}
        onSaveInformasiMuatan={async (data) => {
          if (
            truckTypeId &&
            JSON.stringify(informasiMuatan) !== JSON.stringify(data)
          ) {
            if (compareArraysByNameOnly(informasiMuatan, data)) {
              await onFetchTrucks({
                informasiMuatan: data,
              });
              setType("truckTypeId");
              setIsDimensionOrWeightChanged(true);
              setIsOpen(true);
            } else {
              setField("carrierId", null);
              setField("truckTypeId", null);
            }
          }
          setField("informasiMuatan", data);
        }}
        defaultValues={informasiMuatan}
      />
    </>
  );
};
