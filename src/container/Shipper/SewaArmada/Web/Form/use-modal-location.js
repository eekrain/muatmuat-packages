import { usePathname } from "next/navigation";
import { useState } from "react";

import { useSewaArmadaActions } from "@/store/Shipper/forms/sewaArmadaStore";

const defaultModalConfig = {
  open: false,
  formMode: "muat",
  allSelectedLocations: [],
  defaultValues: null,
  onSubmit: () => {},
};

const MODE_MAP = {
  muat: "lokasiMuat",
  bongkar: "lokasiBongkar",
};

export const useModalLocation = () => {
  const [modalConfig, setModalConfig] = useState(defaultModalConfig);
  const { updateLokasi, setField } = useSewaArmadaActions();
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");

  const handleOpenModalLocation = ({
    formMode,
    allSelectedLocations,
    defaultValues,
    index,
  }) => {
    setModalConfig({
      open: true,
      formMode,
      allSelectedLocations,
      defaultValues,
      onSubmit: (newData) => {
        updateLokasi(MODE_MAP[formMode], index, newData);
        if (!isEditPage) {
          setField("truckTypeId", null);
        }
      },
      index,
    });
  };
  const handleCloseModalLocation = () => setModalConfig(defaultModalConfig);

  return {
    modalConfig,
    handleOpenModalLocation,
    handleCloseModalLocation,
  };
};
