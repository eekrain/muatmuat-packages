import { Info } from "lucide-react";

import { Alert } from "@/components/Badge/Alert";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lighbox";
import SearchBarResponsiveLayout from "@/layout/ResponsiveLayout/SearchBarResponsiveLayout";

const JenisCarrierScreen = () => {
  return (
    <SearchBarResponsiveLayout placeholder="Cari Nama Muatan">
      <div className="bg-neutral-200">
        {/* Recommended Section */}
        <div className="mb-2 bg-white p-5">
          <div className="mb-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <h2 className="text-[14px] font-bold leading-[15px] text-black">
                  Rekomendasi Carrier Sesuai Muatan
                </h2>
                <Info size={16} className="text-neutral-700" />
              </div>
            </div>

            {/* Recommended Carriers List */}
            <div className="space-y-4">
              {recommendedCarriers.map((carrier, index) => (
                <div key={carrier.id}>
                  <CarrierItem carrier={carrier} />
                  {index < recommendedCarriers.length - 1 && (
                    <hr className="my-4 border-neutral-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Not Recommended Section */}
        <div className="bg-white p-5">
          <div className="mb-6">
            {/* Section Title */}
            <h2 className="mb-4 text-[14px] font-bold leading-[15px] text-black">
              Tidak Direkomendasikan
            </h2>

            <Alert variant="warning" className="mb-4">
              Pilihan carrier di bawah ini berisiko melebihi batas dimensi atau
              tidak sesuai dengan informasi muatan
            </Alert>

            {/* Not Recommended Carriers List */}
            <div className="space-y-4">
              {notRecommendedCarriers.map((carrier, index) => (
                <div key={carrier.id}>
                  <CarrierItem carrier={carrier} />
                  {index < notRecommendedCarriers.length - 1 && (
                    <hr className="my-4 border-neutral-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SearchBarResponsiveLayout>
  );
};

export default JenisCarrierScreen;

const CarrierItem = ({ carrier }) => (
  <div className="flex items-center gap-3 py-2">
    <LightboxProvider
      className="size-[68px]"
      title={carrier.name}
      images={carrier.images}
    >
      <LightboxPreview image={carrier.image} alt={carrier.name} />
    </LightboxProvider>
    <h3 className="text-[14px] font-bold leading-[15px] text-black">
      {carrier.name}
    </h3>
  </div>
);

const recommendedCarriers = [
  {
    id: 1,
    name: "Box",
    image: "https://picsum.photos/100?random=1",
    type: "recommended",
  },
  {
    id: 2,
    name: "Bak Terbuka",
    image: "https://picsum.photos/100?random=2",
    type: "recommended",
  },
  {
    id: 3,
    name: "Flat Bed",
    image: "https://picsum.photos/100?random=3",
    type: "recommended",
  },
  {
    id: 4,
    name: "Wingbox",
    image: "https://picsum.photos/100?random=4",
    type: "recommended",
  },
];

const notRecommendedCarriers = [
  {
    id: 5,
    name: "Reefer",
    image: "https://picsum.photos/100?random=5",
    type: "not-recommended",
  },
  {
    id: 6,
    name: "Tangki",
    image: "https://picsum.photos/100?random=6",
    type: "not-recommended",
  },
  {
    id: 7,
    name: "Towing",
    image: "https://picsum.photos/100?random=7",
    type: "not-recommended",
  },
];
