import { useState } from "react";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import IconComponent from "@/components/IconComponent/IconComponent";

export const AsuransiBarang = () => {
  const [isAsuransiModalOpen, setIsAsuransiModalOpen] = useState(false);

  return (
    <FormContainer>
      <FormLabel optional>Asuransi Barang</FormLabel>
      <div
        className="flex h-[32px] flex-1 cursor-pointer items-center justify-between rounded-md border border-neutral-600 bg-white px-3"
        onClick={() => setIsAsuransiModalOpen(true)}
      >
        <div className="flex items-center gap-x-2">
          <IconComponent src="/icons/shield20.svg" width={20} height={20} />
          <span className="leading-[12px] text-xs font-medium text-neutral-900">
            Gratis perlindungan hingga Rp10.000.000
          </span>
        </div>
        <IconComponent
          src="/icons/chevron-right.svg"
          width={16}
          height={16}
          className="icon-gray"
        />
      </div>
    </FormContainer>
  );
};
