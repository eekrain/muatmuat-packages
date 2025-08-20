import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { StepperContainer, StepperItem } from "@/components/Stepper/Stepper";
import { TabsContent } from "@/components/Tabs/Tabs";
import {
  OrderStatusEnum,
  OrderStatusIcon,
} from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";

// Mock data to demonstrate the component's functionality with multiple items.
const mockArmadaItems = [
  {
    id: 1,
    locationLabel: "Menuju ke Lokasi Muat 1",
    hasSos: true,
    licensePlate: "AE 1111 LBA",
    driverName: "Noel Gallagher",
    truckImage: "https://picsum.photos/200?random=1",
    // status object can be used for the stepper later
    status: { activeIndex: 1 },
  },
  {
    id: 2,
    locationLabel: "Menuju ke Lokasi Muat 2",
    hasSos: true,
    licensePlate: "AE 1111 LBA",
    driverName: "Noel Gallagher",
    truckImage: "https://picsum.photos/200?random=2",
    status: { activeIndex: 1 },
  },
  {
    id: 3,
    locationLabel: "Menuju ke Lokasi Bongkar 1",
    hasSos: false,
    licensePlate: "AE 1111 LBA",
    driverName: "Noel Gallagher",
    truckImage: "https://picsum.photos/200?random=3",
    status: { activeIndex: 2 },
  },
];

/**
 * Renders a single armada status item.
 * This is a sub-component used by LacakArmadaCard.
 */
const ArmadaStatusItem = ({ item }) => {
  return (
    <div className="flex flex-col gap-4 bg-white p-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-6 items-center justify-center rounded-md bg-primary-50 px-2 text-xs font-semibold text-primary-700"
        >
          {item.locationLabel}
        </button>
        {item.hasSos && (
          <span className="flex h-6 items-center rounded-md bg-error-400 px-2 text-xs font-semibold text-error-50">
            SOS
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={item.truckImage}
            alt={`Truk ${item.licensePlate}`}
            className="h-14 w-14 rounded-lg border border-neutral-500 object-cover"
          />
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-neutral-900">
              {item.licensePlate}
            </p>
            <div className="flex items-center gap-1 text-xs font-medium text-neutral-900">
              <IconComponent
                src="/icons/profile16.svg"
                className="size-4 text-muat-trans-secondary-900"
              />
              <span>{item.driverName}</span>
            </div>
          </div>
        </div>

        <div className="w-[742px] pr-4 text-center text-neutral-500">
          <StepperContainer activeIndex={1} totalStep={6}>
            {[
              {
                label: "Pesanan Terkonfirmasi",
                status: OrderStatusEnum.SCHEDULED_FLEET,
                icon: OrderStatusIcon.SCHEDULED_FLEET,
              },
              {
                label: "Proses Muat",
                status: OrderStatusEnum.LOADING,
                icon: OrderStatusIcon.LOADING,
              },
              {
                label: "Proses Bongkar",
                status: OrderStatusEnum.UNLOADING,
                icon: OrderStatusIcon.UNLOADING,
              },
              {
                label: "Dokumen Sedang Disiapkan",
                status: OrderStatusEnum.PREPARE_DOCUMENT,
                icon: OrderStatusIcon.PREPARE_DOCUMENT,
              },
              {
                label: "Proses Pengiriman Dokumen",
                status: OrderStatusEnum.DOCUMENT_DELIVERY,
                icon: OrderStatusIcon.DOCUMENT_DELIVERY,
              },
              {
                label: "Selesai",
                status: OrderStatusEnum.COMPLETED,
                icon: OrderStatusIcon.COMPLETED,
              },
            ].map((step, index) => (
              <StepperItem key={step.label} step={step} index={index} />
            ))}
          </StepperContainer>
        </div>
      </div>
    </div>
  );
};

/**
 * A card component to track multiple armada statuses for a single transporter.
 * @param {Object} props - The component props.
 * @param {Array} [props.armadaItems=mockArmadaItems] - An array of armada item data.
 */
export const TabLacakArmada = ({ armadaItems = mockArmadaItems }) => {
  const totalSos = armadaItems.filter((item) => item.hasSos).length;

  return (
    <TabsContent className="flex flex-col gap-y-4" value="lacak-armada">
      <div className="w-full max-w-[1200px] rounded-xl bg-white p-6 shadow-[0px_4px_11px_rgba(65,65,65,0.25)]">
        <div className="flex flex-col gap-6">
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-neutral-900">
                Lacak Armada
              </h1>
              {totalSos > 0 && (
                <>
                  <span className="flex h-6 items-center rounded-md bg-error-400 px-2 py-1 text-xs font-semibold text-error-50">
                    SOS{totalSos > 1 ? `: ${totalSos} Unit` : ""}
                  </span>
                  <a href="#" className="text-xs font-medium text-primary-700">
                    Lihat SOS
                  </a>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="muattrans-primary-secondary"
                className="h-8 min-w-[160px] !rounded-full !text-sm"
              >
                Ubah Transporter
              </Button>
              <Button
                variant="muattrans-primary"
                className="h-8 min-w-[174px] !rounded-full !text-sm"
              >
                Lihat Posisi Armada
              </Button>
            </div>
          </div>

          {/* Armada Items Container */}
          <div className="overflow-hidden rounded-xl border border-neutral-400">
            {/* Transporter Header */}
            <div className="flex items-center gap-4 bg-neutral-100 p-4">
              <div className="flex flex-1 items-center gap-4">
                <img
                  src="https://picsum.photos/200"
                  alt="Logo PT. Siba Surya"
                  className="size-10 rounded-full border border-neutral-500"
                />
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-bold text-neutral-900">
                    PT. Siba Surya
                  </p>
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-900">
                    <div className="flex items-center gap-1">
                      <IconComponent
                        src="/icons/transporter16.svg"
                        className="size-4 text-muat-trans-secondary-900"
                      />
                      <span>{armadaItems.length} Unit</span>
                    </div>
                    <div className="size-0.5 rounded-full bg-neutral-600" />
                    <div className="flex items-center gap-1">
                      <IconComponent
                        src="/icons/marker-outline.svg"
                        className="size-4 text-muat-trans-secondary-900"
                      />
                      <span>Kec. Tegalsari, Kota Surabaya</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="muattrans-primary"
                className="h-8 min-w-[105px] !rounded-full !text-sm"
              >
                Hubungi
              </Button>
            </div>

            {/* List of Armada Items */}
            <div className="divide-y divide-neutral-400">
              {armadaItems.map((item) => (
                <ArmadaStatusItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};
