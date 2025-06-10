import { useState } from "react";

import { useSewaArmadaStore } from "@/store/forms/sewaArmadaStore";

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
  const updateLokasi = useSewaArmadaStore((state) => state.updateLokasi);

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
