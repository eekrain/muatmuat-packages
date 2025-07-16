import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

import { PhotoGrid } from "./components/PhotoGrid";

const ProofPhotoScreen = () => {
  const navigation = useResponsiveNavigation();

  return (
    <FormResponsiveLayout
      title={{
        label: "Bukti Tiba di Lokasi Muat 1",
      }}
      onClickBackButton={() => navigation.pop()}
    >
      <div className="mb-16 space-y-2 bg-neutral-200">
        <PhotoGrid title={"Bukti Muat Barang di Lokasi 1"} />
        <PhotoGrid title={"POD Muat di Lokasi 1"} />
      </div>
    </FormResponsiveLayout>
  );
};
export default ProofPhotoScreen;
