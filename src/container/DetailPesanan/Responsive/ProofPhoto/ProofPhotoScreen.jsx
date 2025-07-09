import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
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
        <PhotoGrid />
      </div>
    </FormResponsiveLayout>
  );
};
export default ProofPhotoScreen;
