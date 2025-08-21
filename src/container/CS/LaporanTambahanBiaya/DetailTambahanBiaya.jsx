import Link from "next/link";
import { useState } from "react";

// import { TimelineContainer, TimelineContentAddress, TimelineItem } from '@/components/Timeline';
import { ChevronDown, ChevronUp } from "lucide-react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Card from "@/components/Card/Card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";
import IconComponent from "@/components/IconComponent/IconComponent";
import { ModalDetailOverloadMuatan } from "@/components/Modal/ModalDetailOverloadMuatan";
import { ModalDetailWaktuTunggu } from "@/components/Modal/ModalDetailWaktuTunggu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/Tabs/Tabs";

import RingkasanPesanan from "./RingkasanPesanan";
import RiwayatHubungiTable from "./RiwayatHubungiTable";

// --- Mock Data ---

const breadcrumbData = [
  { name: "Laporan Tambahan Biaya", href: "#" },
  { name: "Selesai", href: "#" },
  { name: "Detail Tambahan Biaya", href: "#" },
];

const contactHistory = {
  contactedBy: "CS Daffa Toldo",
  lastContact: "02 Jan 2025 18:00 WIB",
  contactCount: 5,
};

const orderInfo = {
  orderNumber: "MT25A001A",
  status: "Selesai",
  fleetCount: 3,
  shipper: {
    name: "PT. Almas International (AIRI)",
    phone: "0812-4321-6666",
    address: "Kec. Tegalsari, Kota Surabaya",
  },
  transporter: [
    {
      name: "PT. Siba Surya",
      phone: "0246-5844-60",
      address: "Kec. Tegalsari, Kota Surabaya",
      fleet: "2 Unit",
    },
    {
      name: "CV. Moga Jaya Abadi",
      phone: "0246-5844-60",
      address: "Kec. Tegalsari, Kota Surabaya",
      fleet: "1 Unit",
    },
  ],
};

const orderSummary = {
  fleetInfo: {
    type: "Colt Diesel Engkel - Box",
    needs: "3 Unit",
    image: "https://picsum.photos/64/64?random=truck",
  },
  loadTime: "03 Okt 2024 18:00 WIB",
  route: [
    {
      type: "muat",
      address:
        "Graha Airs, Jl. Kedungdoro 8B, Kedungdoro, Kec. Tegalsari, Kota Surabaya, Jawa Timur 60261",
    },
    {
      type: "bongkar",
      address:
        "Jalan Perusahaan Raya No.46, Banjararum, Singosari, Malang, Jawa Timur, 65153, Indonesia",
    },
  ],
  loadInfo: {
    totalWeight: "1.000 kg",
    items: [{ name: "Besi Baja", weight: "1.000 kg", dimensions: "1x2x5 m" }],
  },
};

const paymentSummaryData = {
  paymentTime: "06 Jun 2024 19:00 WIB",
  paymentOption: "BCA Virtual Account",
  waitingFee: 200000,
  overloadFee: 100000,
  otherFee: 10000,
  total: 310000,
};

const driversWaitingTime = [
  {
    name: "Noel Gallagher",
    durasiTotal: "14 jam",
    plateNumber: "B 1234 CD",
    transporter: "CV. Moga Jaya Abadi",
    data: [
      {
        detail: "Lokasi muat 1 : 1 Jam 30 Menit",
        startDate: "2025-08-19T08:00:00",
        endDate: "2025-08-19T09:30:00",
        totalPrice: 100000,
      },
      {
        detail: "Lokasi muat 2 : 1 Jam 30 Menit",
        startDate: "2025-08-19T08:00:00",
        endDate: "2025-08-19T09:30:00",
        totalPrice: 100000,
      },
      {
        detail: "Lokasi Bongkar 1 : 1 Jam 30 Menit",
        startDate: "2025-08-19T08:00:00",
        endDate: "2025-08-19T09:30:00",
        totalPrice: 100000,
      },
      {
        detail: "Lokasi Bongkar 2 : 1 Jam 30 Menit",
        startDate: "2025-08-19T08:00:00",
        endDate: "2025-08-19T09:30:00",
        totalPrice: 100000,
      },
    ],
  },
  {
    name: "Liam Gallagher",
    durasiTotal: "16 jam",
    plateNumber: "B 1234 CD",
    transporter: "CV. Moga Jaya Abadi",
    data: [
      {
        detail: "Lokasi muat 1 : 1 Jam 30 Menit",
        startDate: "2025-08-19T08:00:00",
        endDate: "2025-08-19T09:30:00",
        totalPrice: 100000,
      },
      {
        detail: "Lokasi muat 2 : 1 Jam 30 Menit",
        startDate: "2025-08-19T08:00:00",
        endDate: "2025-08-19T09:30:00",
        totalPrice: 100000,
      },
      {
        detail: "Lokasi Bongkar 1 : 1 Jam 30 Menit",
        startDate: "2025-08-19T08:00:00",
        endDate: "2025-08-19T09:30:00",
        totalPrice: 100000,
      },
      {
        detail: "Lokasi Bongkar 2 : 1 Jam 30 Menit",
        startDate: "2025-08-19T08:00:00",
        endDate: "2025-08-19T09:30:00",
        totalPrice: 100000,
      },
    ],
  },
];

// --- Helper Components ---

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-neutral-600">{label}</span>
    <span className="mt-2 text-sm font-bold text-neutral-900">{value}</span>
  </div>
);

const ContactDetail = ({ icon, name, phone, address, fleet }) => (
  <div className="flex items-start gap-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100">
      <IconComponent
        src={icon}
        width={20}
        height={20}
        className="text-neutral-600"
      />
    </div>
    <div className="flex flex-col">
      <p className="text-sm font-semibold text-neutral-900">{name}</p>
      <div className="mt-1 flex items-center gap-2 text-xs text-neutral-600">
        {fleet && (
          <>
            <IconComponent
              src="/icons/transporter12.svg"
              width={16}
              height={16}
              className="text-neutral-600"
            />
            <span>{fleet}</span>
          </>
        )}
        <span className="h-1 w-1 rounded-full bg-neutral-400"></span>
        <div className="flex items-center justify-between gap-1">
          <IconComponent
            src="/icons/phone16.svg"
            width={16}
            height={16}
            className="text-neutral-600"
          />
          {phone}
        </div>
        <span className="h-1 w-1 rounded-full bg-neutral-400"></span>
        <div className="flex items-center justify-between gap-1">
          <IconComponent
            src="/icons/marker-outline.svg"
            width={16}
            height={16}
            className="text-neutral-600"
          />
          {address}
        </div>
      </div>
    </div>
  </div>
);

const DetailTambahanBiaya = ({ breadcrumbData }) => {
  const [isPicExpanded, setIsPicExpanded] = useState(false);
  const [isPaymentDetailExpanded, setIsPaymentDetailExpanded] = useState(true);
  const [isModalOverloadMuatanOpen, setIsModalOverloadMuatanOpen] =
    useState(true);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("Rp", "Rp");
  };

  return (
    <>
      <div className="min-h-screen bg-neutral-100 p-8 font-sans">
        <header>
          <BreadCrumb data={breadcrumbData} />
          <div className="mt-4 flex items-center gap-4">
            <Link href="/laporan/tambahan-biaya" className="p-1">
              <IconComponent
                src="/icons/arrow-left24.svg"
                width={24}
                height={24}
                className="text-primary-700"
              />
            </Link>
            <h1 className="text-xl font-bold text-neutral-900">
              Detail Tambahan Biaya
            </h1>
          </div>
        </header>

        <main className="mt-6">
          <Tabs defaultValue="ringkasan-pesanan">
            <TabsList className="flex w-4/12 justify-start text-primary-700">
              <TabsTrigger value="ringkasan-pesanan" activeColor="primary-700">
                Ringkasan Pesanan
              </TabsTrigger>
              <TabsTrigger value="riwayat-hubungi" activeColor="primary-700">
                Riwayat Hubungi
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ringkasan-pesanan" className="mt-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column */}
                <div className="flex flex-col gap-6 lg:col-span-2">
                  <Card className="border-0 p-6">
                    <div className="grid grid-cols-1 justify-between gap-4 sm:grid-cols-3">
                      <InfoItem
                        label="Telah Dihubungi Oleh"
                        value={contactHistory.contactedBy}
                      />
                      <InfoItem
                        label="Terakhir Dihubungi"
                        value={contactHistory.lastContact}
                      />
                      <InfoItem
                        label="Jumlah Dihubungi"
                        value={`${contactHistory.contactCount} Kali`}
                      />
                    </div>
                  </Card>

                  <Card className="border-0 p-6">
                    <div className="flex flex-col gap-y-4">
                      <div className="grid grid-cols-1 items-start justify-between gap-4 sm:grid-cols-3">
                        <InfoItem
                          label="No. Pesanan"
                          value={orderInfo.orderNumber}
                        />
                        <div className="flex flex-col">
                          <span className="text-xs text-neutral-600">
                            Status Pesanan
                          </span>
                          <BadgeStatusPesanan
                            variant="success"
                            className="mt-1 w-fit"
                          >
                            <p>{orderInfo.status}</p>
                          </BadgeStatusPesanan>
                        </div>
                        <InfoItem
                          label="Jumlah Armada"
                          value={`${orderInfo.fleetCount} Unit`}
                        />
                      </div>
                      <div className="flex flex-col gap-y-4 rounded-lg border border-neutral-200 p-6">
                        <div className="flex flex-col gap-4">
                          <h3 className="text-sm font-semibold text-neutral-900">
                            Informasi Shipper
                          </h3>
                          <ContactDetail
                            icon="/icons/business-user.svg"
                            name={orderInfo.shipper.name}
                            phone={orderInfo.shipper.phone}
                            address={orderInfo.shipper.address}
                          />
                        </div>
                        <hr className="border-neutral-200" />
                        <div className="flex flex-col gap-4">
                          <h3 className="text-sm font-semibold text-neutral-900">
                            Informasi Transporter
                          </h3>
                          {orderInfo.transporter.map((transporter, index) => (
                            <ContactDetail
                              key={index}
                              icon="/icons/truck-02.svg"
                              name={transporter.name}
                              phone={transporter.phone}
                              address={transporter.address}
                              fleet={transporter.fleet}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                  {true && <RingkasanPesanan />}
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-8 h-fit border-0">
                    <Collapsible
                      open={isPaymentDetailExpanded}
                      onOpenChange={setIsPaymentDetailExpanded}
                    >
                      <CollapsibleTrigger className="flex w-full items-center justify-between p-6">
                        <h2 className="text-base font-bold text-neutral-900">
                          Ringkasan Pembayaran
                        </h2>
                        {isPaymentDetailExpanded ? (
                          <ChevronUp className="h-5 w-5 text-neutral-600" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-neutral-600" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-6 pb-6">
                        <div className="space-y-3 border-b border-neutral-200 pb-4">
                          <h3 className="text-sm font-semibold text-neutral-900">
                            Detail Pesanan
                          </h3>
                          <div className="flex justify-between text-xs">
                            <span className="text-neutral-600">
                              Waktu Pembayaran
                            </span>
                            <span className="font-semibold text-neutral-900">
                              {paymentSummaryData.paymentTime}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-600">
                              Opsi Pembayaran
                            </span>
                            <div className="flex items-center gap-1">
                              <IconComponent
                                src="/icons/bca.svg"
                                width={24}
                                height={16}
                              />
                              <span className="font-semibold text-neutral-900">
                                {paymentSummaryData.paymentOption}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    <div className="space-y-4 px-6 pb-6 pt-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">
                            Biaya Waktu Tunggu
                          </span>
                          <span className="font-semibold text-neutral-900">
                            {formatCurrency(paymentSummaryData.waitingFee)}
                          </span>
                        </div>
                        <p className="-mt-1 text-xs text-neutral-600">
                          Nominal biaya waktu tunggu (setelah free 12 jam)
                        </p>

                        <div className="flex justify-center text-center">
                          <ModalDetailWaktuTunggu
                            drivers={driversWaitingTime}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">
                            Biaya Overload Muatan
                          </span>
                          <span className="font-semibold text-neutral-900">
                            {formatCurrency(paymentSummaryData.overloadFee)}
                          </span>
                        </div>
                        <p className="-mt-1 text-xs text-neutral-600">
                          Nominal Overload Muatan (2.000 kg)
                        </p>
                        <div className="flex justify-center text-center">
                          <ModalDetailOverloadMuatan
                            drivers={[
                              {
                                driverName:
                                  "Alex Johnson (L 1234 CAM, CV Moga Jaya Abadi)",
                                amount: 100000,
                                overloadWeight: "1.000 kg",
                              },
                              // {
                              //     driverName: "Liam Gallagher",
                              //     amount: 200000,
                              //     overloadWeight: "2.000 kg",
                              // },
                            ]}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-neutral-600">Biaya Lainnya</p>
                          <p className="text-xs text-neutral-600">
                            Admin Layanan
                          </p>
                        </div>
                        <span className="font-semibold text-neutral-900">
                          {formatCurrency(paymentSummaryData.otherFee)}
                        </span>
                      </div>

                      <hr className="border-dashed border-neutral-300" />

                      <div className="flex justify-between text-base font-bold text-neutral-900">
                        <span>Total Tambahan Biaya</span>
                        <span>{formatCurrency(paymentSummaryData.total)}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="riwayat-hubungi">
              <div className="mt-6 text-center">
                <RiwayatHubungiTable />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default DetailTambahanBiaya;
