import { Fragment, useMemo } from "react";

import { Alert } from "@/components/Alert/Alert";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { InfoBottomsheet } from "@/components/Form/InfoBottomsheet";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";

import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { cn } from "@/lib/utils";

import SearchBarResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/SearchBarResponsiveLayout";
import { useSewaArmadaActions } from "@/store/Shipper/forms/sewaArmadaStore";
import { useResponsiveSearchStore } from "@/store/Shipper/zustand/responsiveSearchStore";

const JenisCarrierScreen = ({ carriers }) => {
  const searchValue = useResponsiveSearchStore((s) => s.searchValue);
  const navigation = useResponsiveNavigation();

  const filteredCarriers = useMemo(() => {
    if (!carriers?.recommendedCarriers || !carriers?.nonRecommendedCarriers)
      return [];

    const mergedCarriers = [
      ...(carriers?.recommendedCarriers || []),
      ...(carriers?.nonRecommendedCarriers || []),
    ];

    return mergedCarriers.filter((carrier) =>
      carrier.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, carriers]);

  const { setField } = useSewaArmadaActions();
  const handleClick = (carrier) => {
    setField("carrierId", carrier.carrierId);
    navigation.popTo("/");
  };

  return (
    <SearchBarResponsiveLayout
      placeholder="Cari Jenis Carrier"
      className={cn(
        Boolean(searchValue) && filteredCarriers.length > 0 && "bg-white"
      )}
    >
      {Boolean(searchValue) && filteredCarriers.length === 0 ? (
        <div className="grid h-full items-center justify-center">
          <DataNotFound
            className="gap-y-3.5"
            textClass="leading-[14px] !text-sm"
            title={
              <>
                Keyword
                <br />
                Tidak Ditemukan
              </>
            }
            width={127}
            height={109}
          />
        </div>
      ) : Boolean(searchValue) && filteredCarriers.length > 0 ? (
        <div className="p-5">
          <div className="flex flex-col gap-4">
            {filteredCarriers.map((carrier, index) => (
              <Fragment key={carrier.carrierId}>
                <CarrierItem
                  carrier={carrier}
                  onClick={() => handleClick(carrier)}
                />
                {index < filteredCarriers.length - 1 && (
                  <hr className="border-neutral-400" />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      ) : carriers?.recommendedCarriers || carriers?.nonRecommendedCarriers ? (
        <>
          <div className="mb-2 bg-white p-5">
            <div className="mb-6">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <h2 className="text-sm font-bold leading-[15px] text-black">
                    Rekomendasi Carrier Sesuai Muatan
                  </h2>
                  <InfoBottomsheet
                    title="Rekomendasi Carrier"
                    className="mt-0.5"
                  >
                    Berikut adalah rekomendasi carrier berdasarkan informasi
                    muatan yang kamu isi.
                  </InfoBottomsheet>
                </div>
              </div>

              {/* Recommended Carriers List */}
              <div className="flex flex-col gap-4">
                {carriers?.recommendedCarriers.map((carrier, index) => (
                  <Fragment key={carrier.carrierId}>
                    <CarrierItem
                      carrier={carrier}
                      onClick={() => handleClick(carrier)}
                    />
                    {index !== carriers?.recommendedCarriers.length - 1 && (
                      <hr className="border-neutral-400" />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-5">
            <div className="mb-6">
              {/* Section Title */}
              <h2 className="mb-4 text-sm font-bold leading-[15px] text-black">
                Tidak Direkomendasikan
              </h2>

              <Alert variant="warning" className="mb-6">
                Pilihan carrier di bawah ini berisiko melebihi batas dimensi
                atau tidak sesuai dengan informasi muatan
              </Alert>

              {/* Not Recommended Carriers List */}
              <div className="flex flex-col gap-4">
                {carriers?.nonRecommendedCarriers.map((carrier, index) => (
                  <Fragment key={carrier.carrierId}>
                    <CarrierItem
                      carrier={carrier}
                      onClick={() => handleClick(carrier)}
                    />
                    {index !== carriers?.nonRecommendedCarriers.length - 1 && (
                      <hr className="border-neutral-400" />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-full flex-col">
          <Alert variant="warning" className="h-[52px] pl-3 pr-6">
            Untuk sementara kami belum menyediakan carrier yang sesuai dengan
            informasi berat dan dimensi muatan yang kamu isikan.
          </Alert>
          <DataNotFound
            className="flex-1 gap-y-3"
            textClass="leading-[14px] !text-sm"
            title={"Tidak ada rekomendasi carrier"}
            width={94}
            height={76}
            type="data"
          />
        </div>
      )}
    </SearchBarResponsiveLayout>
  );
};

export default JenisCarrierScreen;

const CarrierItem = ({ carrier, onClick = () => {} }) => {
  return (
    <button
      className="flex items-center gap-3"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(carrier.id);
      }}
    >
      <LightboxProvider
        className="size-[68px]"
        title={carrier.name}
        image={carrier.image}
      >
        <LightboxPreview image={carrier.image} alt={carrier.name} />
      </LightboxProvider>
      <h3 className="text-sm font-bold leading-[15px] text-black">
        {carrier.name}
      </h3>
    </button>
  );
};
