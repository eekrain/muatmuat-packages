import { useTranslation } from "@/hooks/use-translation";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { DriverStatusLabel } from "@/lib/constants/detailpesanan/driver-status.enum";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";

import { PhotoGrid } from "./components/PhotoGrid";

const getStatusCodeMeta = (statusCode) => {
  const splitted = statusCode.split("_");
  let index = null;
  // Remote the last element if it's a number
  if (!isNaN(Number(splitted[splitted.length - 1]))) {
    index = Number(splitted[splitted.length - 1]);
    splitted.pop();
  }

  return {
    statusCode: splitted.join("_"),
    index,
  };
};

const ProofPhotoScreen = () => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  const { t } = useTranslation();
  const getFormTitle = () => {
    if (params?.driverStatusItem?.statusCode.startsWith("MENUJU_")) {
      return t(
        "labelLihatBuktiMuatBarangPOD",
        {},
        "Bukti Bongkar Barang & POD"
      );
    }

    const { statusCode, index } = getStatusCodeMeta(
      params?.driverStatusItem?.statusCode
    );

    return t(
      "labelBuktiStatus",
      {
        statusName: `${DriverStatusLabel[statusCode]}${
          index > 0 ? ` ${index}` : ""
        }`,
      },
      "Bukti Tiba di Lokasi Bongkar 2"
    );
  };

  const getTitle = (mode) => {
    if (!params?.driverStatusItem) return "";

    if (!params?.driverStatusItem?.beforeStatusCode?.includes("SEDANG")) {
      const { statusCode, index } = getStatusCodeMeta(
        params?.driverStatusItem?.statusCode
      );
      return t(
        "labelBuktiStatus",
        {
          statusName:
            DriverStatusLabel[statusCode] + (index > 0 ? ` ${index}` : ""),
        },
        "Bukti Tiba di Lokasi Bongkar 2"
      );
    }

    const { statusCode, index } = getStatusCodeMeta(
      params.driverStatusItem?.beforeStatusCode
    );

    if (mode === "packages") {
      if (statusCode.includes("MUAT")) {
        return index > 0
          ? t(
              "labelBuktiMuatBarangMulti",
              { index },
              "Bukti Muat Barang di Lokasi 1"
            )
          : t("labelBuktiMuatBarang", {}, "Bukti Muat Barang");
      } else {
        return index > 0
          ? t(
              "labelBuktiBongkarBarangMulti",
              { index },
              "Bukti Bongkar Barang di Lokasi 1"
            )
          : t("labelBuktiBongkarBarang", {}, "Bukti Bongkar Barang");
      }
    } else if (mode === "pods") {
      if (statusCode.includes("MUAT")) {
        return index > 0
          ? t("labelPODMuatMulti", { index }, "Bukti POD Muat di Lokasi 1")
          : t("labelPODMuat", {}, "Bukti POD Muat");
      } else {
        return index > 0
          ? t(
              "labelPODBongkarMulti",
              { index },
              "Bukti POD Bongkar di Lokasi 1"
            )
          : t("labelPODBongkar", {}, "Bukti POD Bongkar");
      }
    }

    return "";
  };

  return (
    <FormResponsiveLayout
      title={{
        label: getFormTitle(),
      }}
      onClickBackButton={() => navigation.pop()}
    >
      <div className="mb-16 space-y-2 bg-neutral-200">
        {params?.driverStatusItem?.photoEvidences?.packages &&
        params?.driverStatusItem?.photoEvidences?.packages?.length ? (
          <PhotoGrid
            title={getTitle("packages")}
            photos={params?.driverStatusItem?.photoEvidences?.packages}
          />
        ) : null}
        {params?.driverStatusItem?.photoEvidences?.pods &&
        params?.driverStatusItem?.photoEvidences?.pods?.length ? (
          <PhotoGrid
            title={getTitle("pods")}
            photos={params?.driverStatusItem?.photoEvidences?.pods}
          />
        ) : null}
      </div>
    </FormResponsiveLayout>
  );
};
export default ProofPhotoScreen;
