import { usePathname } from "next/navigation";

import { FormContainer } from "@/components/Form/Form";
import { TagInput } from "@/components/Form/TagInput";

import { handleFirstTime } from "@/lib/utils/form";

import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

export const NoDeliveryOrder = () => {
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const deliveryOrderNumbers = useSewaArmadaStore(
    (state) => state.formValues.deliveryOrderNumbers
  );
  const { setField } = useSewaArmadaActions();

  return (
    <FormContainer>
      <div className="text-sm font-semibold leading-[1.1] text-neutral-900 md:h-4 md:w-[174px] md:text-xs md:font-medium md:leading-[1.2] md:text-neutral-600">
        <span>No. Delivery Order (DO)</span>
        <span className="block text-xxs md:text-xs md:font-medium md:italic md:text-neutral-500">
          (Opsional)
        </span>
      </div>
      <div className="flex-1">
        <TagInput
          disabled={isEditPage}
          tags={deliveryOrderNumbers}
          onTagsChange={(value) =>
            handleFirstTime(() => setField("deliveryOrderNumbers", value))
          }
          placeholder="Masukkan No. Delivery Order (DO)"
        />
      </div>
    </FormContainer>
  );
};
