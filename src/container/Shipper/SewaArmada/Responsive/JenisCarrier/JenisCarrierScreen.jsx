import { Fragment, useMemo } from "react";

import { Alert } from "@/components/Badge/Alert";
import { InfoBottomsheet } from "@/components/Form/InfoBottomsheet";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import SearchBarResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/SearchBarResponsiveLayout";
import { cn } from "@/lib/utils";
import { useResponsiveSearchStore } from "@/store/Shipper/zustand/responsiveSearchStore";

const JenisCarrierScreen = () => {
  const searchValue = useResponsiveSearchStore((s) => s.searchValue);

  const filteredCarriers = useMemo(() => {
    const mergedCarriers = [...recommendedCarriers, ...notRecommendedCarriers];

    return mergedCarriers.filter((carrier) =>
      carrier.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue]);

  return (
    <SearchBarResponsiveLayout
      placeholder="Cari Jenis Carrier"
      className={cn(
        Boolean(searchValue) && filteredCarriers.length > 0 && "bg-white"
      )}
    >
      {Boolean(searchValue) && filteredCarriers.length > 0 ? (
        <div className="p-5">
          <div className="flex flex-col gap-4">
            {filteredCarriers.map((carrier, index) => (
              <Fragment key={carrier.id}>
                <CarrierItem carrier={carrier} />
                {index < filteredCarriers.length - 1 && (
                  <hr className="border-neutral-400" />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-2 bg-white p-5">
            <div className="mb-6">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <h2 className="mt-0.5 text-[14px] font-bold leading-[15px] text-black">
                    Rekomendasi Carrier Sesuai Muatan
                  </h2>
                  <InfoBottomsheet title="Rekomendasi Carrier">
                    Berikut adalah rekomendasi carrier berdasarkan informasi
                    muatan yang kamu isi.
                  </InfoBottomsheet>
                </div>
              </div>

              {/* Recommended Carriers List */}
              <div className="flex flex-col gap-4">
                {recommendedCarriers.map((carrier, index) => (
                  <Fragment key={carrier.id}>
                    <CarrierItem carrier={carrier} />
                    {index < recommendedCarriers.length - 1 && (
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
              <h2 className="mb-4 text-[14px] font-bold leading-[15px] text-black">
                Tidak Direkomendasikan
              </h2>

              <Alert variant="warning" className="mb-4">
                Pilihan carrier di bawah ini berisiko melebihi batas dimensi
                atau tidak sesuai dengan informasi muatan
              </Alert>

              {/* Not Recommended Carriers List */}
              <div className="flex flex-col gap-4">
                {notRecommendedCarriers.map((carrier, index) => (
                  <Fragment key={carrier.id}>
                    <CarrierItem carrier={carrier} />
                    {index < notRecommendedCarriers.length - 1 && (
                      <hr className="border-neutral-400" />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </SearchBarResponsiveLayout>
  );
};

export default JenisCarrierScreen;

const CarrierItem = ({ carrier }) => {
  return (
    <div className="flex items-center gap-3">
      <LightboxProvider
        className="size-[68px]"
        title={carrier.name}
        image={carrier.image}
      >
        <LightboxPreview image={carrier.image} alt={carrier.name} />
      </LightboxProvider>
      <h3 className="text-[14px] font-bold leading-[15px] text-black">
        {carrier.name}
      </h3>
    </div>
  );
};

const recommendedCarriers = [
  {
    id: 1,
    name: "Box",
    image: "https://picsum.photos/500/300?random=1",
    type: "recommended",
  },
  {
    id: 2,
    name: "Bak Terbuka",
    image: "https://picsum.photos/500/300?random=2",
    type: "recommended",
  },
  {
    id: 3,
    name: "Flat Bed",
    image: "https://picsum.photos/500/300?random=3",
    type: "recommended",
  },
  {
    id: 4,
    name: "Wingbox",
    image: "https://picsum.photos/500/300?random=4",
    type: "recommended",
  },
];

const notRecommendedCarriers = [
  {
    id: 5,
    name: "Reefer",
    image: "https://picsum.photos/500/300?random=5",
    type: "not-recommended",
  },
  {
    id: 6,
    name: "Tangki",
    image: "https://picsum.photos/500/300?random=6",
    type: "not-recommended",
  },
  {
    id: 7,
    name: "Towing",
    image: "https://picsum.photos/500/300?random=7",
    type: "not-recommended",
  },
];
