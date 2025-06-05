import { useEffect } from "react";

import FooterOneButton from "@/components/Footer/OneButton";
import { ModalPostalCodeResponsive } from "@/components/LocationManagement/Responsive/ModalPostalCodeResponsive";
import { MapContainer } from "@/components/LocationManagement/common/MapContainer";
import { useLocation } from "@/hooks/use-location";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { useLocationFormStore } from "@/store/forms/locationFormStore";

export const PinPointMap = () => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  const { formValues, setField, setLocationCoordinatesOnly } =
    useLocationFormStore();

  const {
    isModalPostalCodeOpen,
    setIsModalPostalCodeOpen,
    searchLocationByPostalCode,
    setSearchLocationByPostalCode,
    postalCodeAutoCompleteResult,
    onSelectPostalCode,
    coordinates,
    setCoordinates,
  } = useLocation({
    onAddressSelected: (data) => {
      setField("dataLokasi", data);
    },
    setPICName: (name) => {
      setField("namaPIC", name);
    },
    setNoHPPIC: (noHPPIC) => {
      setField("noHPPIC", noHPPIC);
    },
    setLocationCoordinatesOnly,
  });

  useEffect(() => {
    if (!params?.dataLokasi?.district) {
      if (params?.dataLokasi?.postalCode)
        setSearchLocationByPostalCode(params?.dataLokasi.postalCode);
      setIsModalPostalCodeOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.dataLokasi?.district]);

  return (
    <FormResponsiveLayout
      title={{
        label: params?.dataLokasi?.location?.name,
        className: "text-sm font-semibold line-clamp-1 break-all",
      }}
    >
      <MapContainer
        viewOnly={false}
        coordinates={coordinates}
        onPositionChange={setCoordinates}
        className="h-[calc(100vh-62px)] w-full"
      />

      <ModalPostalCodeResponsive
        open={isModalPostalCodeOpen}
        searchValue={searchLocationByPostalCode}
        setSearchValue={setSearchLocationByPostalCode}
        options={postalCodeAutoCompleteResult}
        onSelectPostalCode={onSelectPostalCode}
        onOpenChange={setIsModalPostalCodeOpen}
      />

      <FooterOneButton
        buttonTitle="Simpan"
        onClick={() => alert("test")}
        className="bg-transparent"
      />
    </FormResponsiveLayout>
  );
};
