"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { sub } from "date-fns";

import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { DriverStatusEnum } from "@/lib/constants/detailpesanan/driver-status.enum";
import { useLoadingAction } from "@/store/Shared/loadingStore";

import { LeftPanel } from "./LeftPanel/LeftPanel";
import { MapPanel } from "./MapPanel/MapPanel";

// Mock data untuk multiple drivers
const mockMultipleDriversData = {
  drivers: [
    {
      dataDriver: {
        driverId: "uuid-driver-1",
        name: "Wawan Setiawan",
        phoneNumber: "081234567891",
        profileImage: "https://picsum.photos/50?random=1",
        orderStatus: OrderStatusEnum.COMPLETED,
        driverStatus: DriverStatusEnum.UNLOADING.SELESAI.code,
        statusTitle: "Pesanan Selesai",
        licensePlate: "B 1234 CD",
      },
      statusDefinitions: [
        {
          mappedOrderStatus: OrderStatusEnum.COMPLETED,
          date: new Date().toISOString(),
          shippingEvidence: {
            packages: [
              "https://picsum.photos/400/300?random=4",
              "https://picsum.photos/400/300?random=5",
            ],
            pods: [
              "https://picsum.photos/400/300?random=42",
              "https://picsum.photos/400/300?random=43",
            ],
          },
        },
        {
          mappedOrderStatus: OrderStatusEnum.DOCUMENT_DELIVERY,
          date: new Date().toISOString(),
          shippingEvidence: {
            date: "",
            photo: ["https://picsum.photos/400/300?random=43"],
            noted: "",
          },
        },
        {
          mappedOrderStatus: OrderStatusEnum.PREPARE_DOCUMENT,
          date: new Date().toISOString(),
        },
        {
          mappedOrderStatus: OrderStatusEnum.UNLOADING,
          children: [
            {
              statusCode: `${DriverStatusEnum.UNLOADING.BONGKAR.code}_2`,
              statusName: "Sedang Bongkar di Lokasi 2",
              date: sub(new Date(), { hours: 1 }).toISOString(),
              requiresQRScan: true,
              requiresPhoto: true,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [
                  "https://picsum.photos/400/300?random=12",
                  "https://picsum.photos/400/300?random=13",
                ],
                pods: ["https://picsum.photos/400/300?random=14"],
              },
            },
            {
              statusCode: `${DriverStatusEnum.UNLOADING.ANTRI.code}_2`,
              statusName: "Antri di Lokasi Bongkar 2",
              date: sub(new Date(), { hours: 3 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: false,
              triggersWaitingFee: true,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },
            {
              statusCode: `${DriverStatusEnum.UNLOADING.TIBA.code}_2`,
              statusName: "Tiba di Lokasi Bongkar 2",
              date: sub(new Date(), { hours: 4 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: true,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [
                  "https://picsum.photos/400/300?random=10",
                  "https://picsum.photos/400/300?random=11",
                ],
                pods: [],
              },
            },
            {
              statusCode: `${DriverStatusEnum.UNLOADING.MENUJU.code}_2`,
              statusName: "Menuju Lokasi Bongkar 2",
              date: sub(new Date(), { hours: 5, minutes: 30 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: false,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },

            {
              statusCode: `${DriverStatusEnum.UNLOADING.BONGKAR.code}_1`,
              statusName: "Sedang Bongkar di Lokasi 1",
              date: sub(new Date(), { hours: 1 }).toISOString(),
              requiresQRScan: true,
              requiresPhoto: true,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [
                  "https://picsum.photos/400/300?random=12",
                  "https://picsum.photos/400/300?random=13",
                ],
                pods: ["https://picsum.photos/400/300?random=14"],
              },
            },
            {
              statusCode: `${DriverStatusEnum.UNLOADING.ANTRI.code}_1`,
              statusName: "Antri di Lokasi Bongkar 1",
              date: sub(new Date(), { hours: 3 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: false,
              triggersWaitingFee: true,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },
            {
              statusCode: `${DriverStatusEnum.UNLOADING.TIBA.code}_1`,
              statusName: "Tiba di Lokasi Bongkar 1",
              date: sub(new Date(), { hours: 4 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: true,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [
                  "https://picsum.photos/400/300?random=10",
                  "https://picsum.photos/400/300?random=11",
                ],
                pods: [],
              },
            },
            {
              statusCode: `${DriverStatusEnum.UNLOADING.MENUJU.code}_1`,
              statusName: "Menuju Lokasi Bongkar 1",
              date: sub(new Date(), { hours: 5, minutes: 30 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: false,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },
          ],
        },
        {
          mappedOrderStatus: OrderStatusEnum.LOADING,
          children: [
            {
              statusCode: `${DriverStatusEnum.LOADING.MUAT.code}_2`,
              statusName: "Sedang Muat di Lokasi 2",
              date: sub(new Date(), { hours: 1 }).toISOString(),
              requiresQRScan: true,
              requiresPhoto: true,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [
                  "https://picsum.photos/400/300?random=12",
                  "https://picsum.photos/400/300?random=13",
                ],
                pods: ["https://picsum.photos/400/300?random=14"],
              },
            },
            {
              statusCode: `${DriverStatusEnum.LOADING.ANTRI.code}_2`,
              statusName: "Antri di Lokasi Muat 2",
              date: sub(new Date(), { hours: 3 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: false,
              triggersWaitingFee: true,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },
            {
              statusCode: `${DriverStatusEnum.LOADING.TIBA.code}_2`,
              statusName: "Tiba di Lokasi Muat 2",
              date: sub(new Date(), { hours: 4 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: true,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [
                  "https://picsum.photos/400/300?random=10",
                  "https://picsum.photos/400/300?random=11",
                ],
                pods: [],
              },
            },
            {
              statusCode: `${DriverStatusEnum.LOADING.MENUJU.code}_2`,
              statusName: "Menuju Lokasi Muat 2",
              date: sub(new Date(), { hours: 5, minutes: 30 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: false,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },

            {
              statusCode: `${DriverStatusEnum.LOADING.MUAT.code}_1`,
              statusName: "Sedang Muat di Lokasi 1",
              date: sub(new Date(), { hours: 1 }).toISOString(),
              requiresQRScan: true,
              requiresPhoto: true,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [
                  "https://picsum.photos/400/300?random=12",
                  "https://picsum.photos/400/300?random=13",
                ],
                pods: ["https://picsum.photos/400/300?random=14"],
              },
            },
            {
              statusCode: `${DriverStatusEnum.LOADING.ANTRI.code}_1`,
              statusName: "Antri di Lokasi Muat 1",
              date: sub(new Date(), { hours: 3 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: false,
              triggersWaitingFee: true,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },
            {
              statusCode: `${DriverStatusEnum.LOADING.TIBA.code}_1`,
              statusName: "Tiba di Lokasi Muat 1",
              date: sub(new Date(), { hours: 4 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: true,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [
                  "https://picsum.photos/400/300?random=10",
                  "https://picsum.photos/400/300?random=11",
                ],
                pods: [],
              },
            },
            {
              statusCode: `${DriverStatusEnum.LOADING.MENUJU.code}_1`,
              statusName: "Menuju Lokasi Muat 1",
              date: sub(new Date(), { hours: 5, minutes: 30 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: false,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },
          ],
        },
      ],
    },
    {
      dataDriver: {
        driverId: "uuid-driver-2",
        name: "Hendra Gunawan",
        phoneNumber: "081234567892",
        profileImage: "https://picsum.photos/50?random=2",
        orderStatus: OrderStatusEnum.LOADING,
        driverStatus: DriverStatusEnum.LOADING.MUAT.code,
        statusTitle: "Sedang Muat di Lokasi 1",
        licensePlate: "B 5678 EF",
      },
      statusDefinitions: [
        {
          mappedOrderStatus: OrderStatusEnum.LOADING,
          children: [
            {
              statusCode: `${DriverStatusEnum.LOADING.MUAT.code}_1`,
              statusName: "Sedang Muat di Lokasi 1",
              date: sub(new Date(), { hours: 2 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: false,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },
            {
              statusCode: `${DriverStatusEnum.LOADING.ANTRI.code}_1`,
              statusName: "Antri di Lokasi Muat 1",
              date: sub(new Date(), { hours: 3 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: false,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },
            {
              statusCode: `${DriverStatusEnum.LOADING.TIBA.code}_1`,
              statusName: "Tiba di Lokasi Muat 1",
              date: sub(new Date(), { hours: 4 }).toISOString(),
              requiresQRScan: false,
              requiresPhoto: true,
              triggersWaitingFee: false,
              photoEvidences: {
                packages: [
                  "https://picsum.photos/400/300?random=20",
                  "https://picsum.photos/400/300?random=21",
                ],
                pods: [],
              },
            },
          ],
        },
      ],
    },
  ],
};

const DetailStatusArmada = () => {
  const params = useParams();
  const { setIsGlobalLoading } = useLoadingAction();
  const [isLoading, setIsLoading] = useState(true);
  const [dataDriverTimeline, setDataDriverTimeline] = useState(null);

  useEffect(() => {
    // Simulasi loading
    setIsLoading(true);

    // Debug: tampilkan semua driver yang tersedia
    console.log(
      "Available drivers:",
      mockMultipleDriversData.drivers.map((d) => ({
        driverId: d.dataDriver.driverId,
        name: d.dataDriver.name,
        status: d.dataDriver.statusTitle,
      }))
    );
    console.log("Current driverId from params:", params.driverId);

    // Simulasi delay API call
    const timer = setTimeout(() => {
      // Cari driver berdasarkan driverId dari params
      const selectedDriver = mockMultipleDriversData.drivers.find(
        (driver) => driver.dataDriver.driverId === params.driverId
      );

      // Jika tidak ada driverId di params, ambil driver pertama
      const driverData = selectedDriver || mockMultipleDriversData.drivers[0];

      console.log("Selected driver data:", driverData.dataDriver.name);
      setDataDriverTimeline(driverData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [params.driverId]);

  useEffect(() => {
    setIsGlobalLoading(isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <>
      <div className="mx-auto grid h-[calc(100dvh-92px)] grid-cols-[480px_1fr] overflow-hidden">
        <LeftPanel
          dataDriverTimeline={dataDriverTimeline}
          allDriversData={mockMultipleDriversData}
        />
        <MapPanel />
      </div>
    </>
  );
};

export default DetailStatusArmada;
