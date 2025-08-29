import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";
import IconComponent from "@/components/IconComponent/IconComponent";

// Import separated components
import AcceptChangeComponent from "./AcceptChangeComponent";
import CancellationResponseComponent from "./CancellationResponseComponent";
import ChangeDetailsResponseComponent from "./ChangeDetailsResponseComponent";
import DriverChangeComponent from "./DriverChangeComponent";
import TimelineItem from "./TimelineItem";
import VehicleChangeComponent from "./VehicleChangeComponent";

function CardRiwayatPerubahan({ dataOrderDetail }) {
  console.log(dataOrderDetail);
  return (
    <div className="border-netral-400 w-full rounded-xl border px-4 py-5">
      <div className="relative space-y-6">
        <TimelineItem>
          <div className="flex flex-shrink-0 items-center gap-3">
            <span className="block h-4 w-4 rounded-full bg-muat-trans-primary-400"></span>
            <p className="text-xs font-medium text-neutral-600">
              12 Agu 2025 10:00 WIB
            </p>
          </div>
          <div className="w-full">
            <p className="mb-3 text-xs font-medium">
              <span className="font-semibold">Kamu</span> telah melakukan
              perubahan armada sebagai respons atas perubahan pesanan dari
              shipper.
            </p>
            <Collapsible
              defaultOpen
              className="rounded-lg border border-neutral-400"
            >
              <CollapsibleTrigger className="rounded-t-md bg-neutral-100 px-6 hover:no-underline">
                {({ open }) => (
                  <>
                    <h3 className="font-semibold">Detail Respon Perubahan</h3>

                    <div className="flex items-center gap-2 font-medium text-primary-700">
                      <p>{open ? "Sembunyikan" : "Lihat Detail"}</p>
                      <IconComponent
                        src="/icons/chevron-down.svg"
                        className={`h-5 w-5 transition-transform duration-300 ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </>
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="m-4 rounded-lg border border-neutral-400 p-4">
                  {/* component perubahan driver */}
                  <DriverChangeComponent
                    previousDriver={{
                      name: "Noel Gallagher",
                      avatar: "/img/avatar.png",
                      status: "Sedang Muat",
                    }}
                    newDriver={{
                      name: "Muhammad Rizky Ramadhani",
                      avatar: "/img/avatar2.png",
                    }}
                    vehicle={{
                      plateNumber: "AE 1111 LBA",
                      type: "Colt Diesel Double - Bak Terbuka",
                      image: "/img/depan.png",
                    }}
                  />
                  {/* component terima perubahan */}
                  <AcceptChangeComponent
                    vehicle={{
                      plateNumber: "B 2222 XYZ",
                      driverName: "Muhammad Rizky Ramadhani Pratama",
                      image: "/img/depan.png",
                    }}
                  />
                  {/* component perubahan vehicle - searching for replacement */}
                  <VehicleChangeComponent
                    previousVehicle={{
                      plateNumber: "B 2222 XYZ",
                      driverName: "Muhammad Rizky Ramadhani Pratama",
                      status: "Armada Dijadwalkan",
                      image: "/img/depan.png",
                    }}
                    newVehicle={null}
                    isSearchingReplacement={true}
                  />
                  <CancellationResponseComponent
                    vehicle={{
                      plateNumber: "AE 1111 LBA",
                      driverName: "Noel Gallagher",
                      status: "Armada Dijadwalkan",
                      image: "/img/depan.png",
                    }}
                    steps={[
                      {
                        label: "Armada Dijadwalkan",
                        isCompleted: true,
                        icon: "/icons/info-pra-tender.svg",
                      },
                      {
                        label: "Dibatalkan",
                        status: "CANCELED",
                        isCompleted: true,
                        isActive: true,
                        icon: "/icons/silang-white.svg",
                      },
                    ]}
                    activeIndex={1}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </TimelineItem>
        <TimelineItem isLast>
          <div className="flex flex-shrink-0 items-center gap-3">
            <span className="block h-4 w-4 rounded-full bg-neutral-400"></span>
            <p className="text-xs font-medium text-neutral-600">
              12 Agu 2025 08:00 WIB
            </p>
          </div>
          <div className="w-full">
            <p className="mb-3 text-xs font-medium">
              <span className="font-semibold">Shipper</span> telah melakukan
              perubahan pesanan.
            </p>
            <Collapsible
              defaultOpen
              className="rounded-lg border border-neutral-400"
            >
              <CollapsibleTrigger className="rounded-t-md bg-neutral-100 px-6 hover:no-underline">
                {({ open }) => (
                  <>
                    <h3 className="font-semibold">Detail Perubahan Shipper</h3>

                    <div className="flex items-center gap-2 font-medium text-primary-700">
                      <p>{open ? "Sembunyikan" : "Lihat Detail"}</p>
                      <IconComponent
                        src="/icons/chevron-down.svg"
                        className={`h-5 w-5 transition-transform duration-300 ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </>
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ChangeDetailsResponseComponent
                  changeDetails={{
                    changeType: "LOCATION_AND_TIME",
                    originalData: {
                      loadTimeStart: "2024-08-15T08:00:00Z",
                      loadTimeEnd: "2024-08-15T10:00:00Z",
                      estimatedDistance: 250,
                      locations: [
                        {
                          locationType: "PICKUP",
                          fullAddress:
                            "PT. Indofood Sukses Makmur Tbk, Jl. Sudirman Kav. 76-78, Jakarta Selatan 12910",
                          name: "Gudang Indofood Jakarta",
                          sequence: 1,
                          latitude: -6.2088,
                          longitude: 106.8456,
                        },
                        {
                          locationType: "PICKUP",
                          fullAddress:
                            "PT. Unilever Indonesia Tbk, Jl. BSD Boulevard Barat, BSD City, Tangerang 15345",
                          name: "Gudang Unilever BSD",
                          sequence: 2,
                          latitude: -6.3019,
                          longitude: 106.6478,
                        },
                        {
                          locationType: "DROPOFF",
                          fullAddress:
                            "Hypermart Surabaya, Jl. Ahmad Yani No. 288, Surabaya 60235",
                          name: "Hypermart Surabaya",
                          sequence: 3,
                          latitude: -7.2575,
                          longitude: 112.7521,
                        },
                      ],
                    },
                    requestedChanges: {
                      loadTimeStart: "2024-08-16T09:00:00Z",
                      loadTimeEnd: "2024-08-16T11:00:00Z",
                      estimatedDistance: 280,
                      locations: [
                        {
                          locationType: "PICKUP",
                          fullAddress:
                            "PT. Mayora Indah Tbk, Jl. Gatot Subroto Kav. 27, Jakarta Selatan 12950",
                          name: "Gudang Mayora Jakarta",
                          sequence: 1,
                          latitude: -6.2297,
                          longitude: 106.8261,
                        },
                        {
                          locationType: "PICKUP",
                          fullAddress:
                            "PT. Nestle Indonesia, Jl. TB Simatupang Kav. 88, Jakarta Selatan 12520",
                          name: "Gudang Nestle Jakarta",
                          sequence: 2,
                          latitude: -6.287,
                          longitude: 106.7962,
                        },
                        {
                          locationType: "DROPOFF",
                          fullAddress:
                            "Giant Hypermarket Bandung, Jl. Gatot Subroto No. 289, Bandung 40263",
                          name: "Giant Hypermarket Bandung",
                          sequence: 3,
                          latitude: -6.9175,
                          longitude: 107.6191,
                        },
                      ],
                    },
                    incomeAdjustment: {
                      hasAdjustment: true,
                      originalAmount: 2500000,
                      adjustedAmount: 2750000,
                    },
                  }}
                  formatDateTimeRange={(start, end) => {
                    if (!start || !end) return "N/A";
                    return `${new Date(start).toLocaleDateString("id-ID")} ${new Date(start).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} - ${new Date(end).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
                  }}
                  formatDistance={(distance) => {
                    if (!distance) return "0 km";
                    return `${distance} km`;
                  }}
                  formatCurrency={(amount) => {
                    if (!amount) return "Rp 0";
                    return `Rp ${amount.toLocaleString("id-ID")}`;
                  }}
                  t={(key, params, fallback) => fallback || key}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </TimelineItem>
      </div>
    </div>
  );
}

export default CardRiwayatPerubahan;
