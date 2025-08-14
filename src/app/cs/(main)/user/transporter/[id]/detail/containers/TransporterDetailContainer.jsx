"use client";

import { useEffect, useState } from "react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import {
  Tabs,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";
import { toast } from "@/lib/toast";

import DaftarArmadaTab from "./tabs/DaftarArmadaTab";
import DaftarDriverTab from "./tabs/DaftarDriverTab";
import DataTransporterTab from "./tabs/DataTransporterTab";
import RekapPembatalanTab from "./tabs/RekapPembatalanTab";
import RiwayatStatusTab from "./tabs/RiwayatStatusTab";

const TransporterDetailContainer = ({ transporterId }) => {
  // State management
  const [activeTab, setActiveTab] = useState("daftar-armada");
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "",
    data: null,
  });
  const [hubungiModalOpen, setHubungiModalOpen] = useState(false);
  const [transporterData, setTransporterData] = useState(null);

  // Mock fleet data
  const mockFleetData = [
    {
      id: "1",
      plateNumber: "L 8310 SH",
      description:
        "Ultra Long Wheelbase Heavy Duty 10x4 Axle Diesel Truck - Multi Axle Expandable Flatbed",
      driverName: "Rizky Pratama",
      vehicleBrand: "Mitsubishi Fuso Heavy Duty",
      vehicleType: "Commercial Diesel Truck Canter 4 Wheels",
      vehicleCategory: "Canter 74 HD",
      stnkExpiry: "20 Agu 2028",
      status: "Akan Muat Hari Ini",
      image: "/img/truck1.png",
    },
    {
      id: "2",
      plateNumber: "L 8310 SH",
      description: "Cont Diesel Double - Bet Terbuka",
      driverName: "Budi Setiawan",
      vehicleBrand: "Mitsubishi Fuso",
      vehicleType: "Commercial Diesel Truck",
      vehicleCategory: "Canter 74 HD",
      stnkExpiry: "20 Agu 2028",
      status: "Siap Menerima Order",
      image: "/img/truck1.png",
    },
    {
      id: "3",
      plateNumber: "L 8310 SH",
      description: "Medium Truck 6x2 - Tangki",
      driverName: "Arief Rahman",
      vehicleBrand: "Mitsubishi Fuso",
      vehicleType: "Commercial Diesel Truck",
      vehicleCategory: "Canter 74 HD",
      stnkExpiry: "20 Agu 2028",
      status: "Bertugas",
      image: "/img/truck1.png",
    },
    {
      id: "4",
      plateNumber: "L 8310 SH",
      description: "Cont Diesel Double - Dump",
      driverName: "",
      vehicleBrand: "Mitsubishi Fuso",
      vehicleType: "Commercial Diesel Truck",
      vehicleCategory: "Canter 74 HD",
      stnkExpiry: "20 Agu 2028",
      status: "Belum Dipasangkan",
      image: "/img/truck1.png",
    },
    {
      id: "5",
      plateNumber: "L 8310 SH",
      description: "Cont Diesel Double - Dump",
      driverName: "Fajar Nugroho",
      vehicleBrand: "Mitsubishi Fuso",
      vehicleType: "Commercial Diesel Truck",
      vehicleCategory: "Canter 74 HD",
      stnkExpiry: "29 Agu 2028",
      status: "Belum Dipasangkan",
      image: "/img/truck1.png",
    },
    {
      id: "6",
      plateNumber: "L 8310 SH",
      description: "Cont Diesel Double - Dump",
      driverName: "Hendro Wijaya",
      vehicleBrand: "Mitsubishi Fuso",
      vehicleType: "Commercial Diesel Truck",
      vehicleCategory: "Canter 74 HD",
      stnkExpiry: "29 Agu 2028",
      status: "Akan Muat Hari Ini",
      image: "/img/truck1.png",
    },
    {
      id: "7",
      plateNumber: "L 8310 SH",
      description: "Cont Diesel Double - Bet Terbuka",
      driverName: "Agus Salim",
      vehicleBrand: "Mitsubishi Fuso",
      vehicleType: "Commercial Diesel Truck",
      vehicleCategory: "Canter 74 HD",
      stnkExpiry: "20 Agu 2028",
      status: "Siap Menerima Order",
      image: "/img/truck1.png",
    },
    {
      id: "8",
      plateNumber: "L 8310 SH",
      description: "Medium Truck 6x2 - Tangki",
      driverName: "Yudi Hartono",
      vehicleBrand: "Mitsubishi Fuso",
      vehicleType: "Commercial Diesel Truck",
      vehicleCategory: "Canter 74 HD",
      stnkExpiry: "20 Agu 2028",
      status: "Bertugas",
      image: "/img/truck1.png",
    },
    {
      id: "9",
      plateNumber: "L 8310 SH",
      description: "Cont Diesel Double - Bet Terbuka",
      driverName: "Sandi Prabowo",
      vehicleBrand: "Mitsubishi Fuso",
      vehicleType: "Commercial Diesel Truck",
      vehicleCategory: "Canter 74 HD",
      stnkExpiry: "20 Agu 2028",
      status: "Bertugas",
      image: "/img/truck1.png",
    },
    {
      id: "10",
      plateNumber: "L 8310 SH",
      description:
        "Ultra Long Wheelbase Heavy Duty 10x4 Axle Diesel Truck - Multi Axle Expandable Flatbed",
      driverName: "",
      vehicleBrand: "Mitsubishi Fuso Heavy Duty",
      vehicleType: "Commercial Diesel Truck Canter 4 Wheels",
      vehicleCategory: "Canter 74 HD",
      stnkExpiry: "20 Agu 2028",
      status: "Belum Dipasangkan",
      image: "/img/truck1.png",
    },
  ];

  // Mock data for other tabs (empty for demonstration)
  const mockDriverData = [
    {
      id: "1",
      name: "Hans Friedrich Marc-André ter Stegen",
      phone: "0821-2089-9123",
      licenseType: "L 1239 CAM",
      experience: 5,
      assignedVehicle: "L 8310 SH",
      status: "Menunggu Jam Muat",
      avatar: "/img/driver1.jpg",
      vehicleType:
        "Ultra Long Wheelbase Heavy Duty 10x4 Axle Diesel Truck - Multi Axle Expandable Flatbed Modular Cargo Carrier for Oversized Materials and Equipment Transportation Needs",
    },
    {
      id: "2",
      name: "Dek Yasrul",
      phone: "0821-2089-9123",
      licenseType: "L 1249 CAM",
      experience: 3,
      assignedVehicle: "L 8311 SH",
      status: "Siap Menerima Order",
      avatar: "/img/driver2.jpg",
      vehicleType:
        "Ultra Long Wheelbase Heavy Duty 10x4 Axle Diesel Truck - Multi Axle Expandable Flatbed Modular Cargo Carrier for Oversized Materials and Equipment Transportation Needs",
    },
    {
      id: "3",
      name: "Dek Pedri",
      phone: "0821-2089-9123",
      licenseType: "L 1319 CAM",
      experience: 7,
      assignedVehicle: "L 8312 SH",
      status: "Bertugas",
      avatar: "/img/driver3.jpg",
      vehicleType:
        "Ultra Long Wheelbase Heavy Duty 10x4 Axle Diesel Truck - Multi Axle Expandable Flatbed Modular Cargo Carrier for Oversized Materials and Equipment Transportation Needs",
    },
    {
      id: "4",
      name: "Cubani",
      phone: "0821-2089-9123",
      licenseType: "-",
      experience: 2,
      assignedVehicle: "-",
      status: "Belum Dipasangkan",
      avatar: "/img/driver4.jpg",
      vehicleType: "-",
    },
    {
      id: "5",
      name: "Cek Levi",
      phone: "0821-2089-9123",
      licenseType: "L 1579 CAM",
      experience: 6,
      assignedVehicle: "L 8315 SH",
      status: "Nonaktif",
      avatar: "/img/driver5.jpg",
      vehicleType:
        "Ultra Long Wheelbase Heavy Duty 10x4 Axle Diesel Truck - Multi Axle Expandable Flatbed Modular Cargo Carrier for Oversized Materials and Equipment Transportation Needs",
    },
    {
      id: "6",
      name: "Ahmad Solihin",
      phone: "0812-3456-7890",
      licenseType: "L 1628 CAM",
      experience: 4,
      assignedVehicle: "L 8316 SH",
      status: "Siap Menerima Order",
      avatar: "/img/driver6.jpg",
      vehicleType:
        "Ultra Long Wheelbase Heavy Duty 10x4 Axle Diesel Truck - Multi Axle Expandable Flatbed Modular Cargo Carrier for Oversized Materials and Equipment Transportation Needs",
    },
    {
      id: "7",
      name: "Budi Santoso",
      phone: "0813-5678-9012",
      licenseType: "L 1729 CAM",
      experience: 8,
      assignedVehicle: "L 8317 SH",
      status: "Bertugas",
      avatar: "/img/driver7.jpg",
      vehicleType:
        "Ultra Long Wheelbase Heavy Duty 10x4 Axle Diesel Truck - Multi Axle Expandable Flatbed Modular Cargo Carrier for Oversized Materials and Equipment Transportation Needs",
    },
    {
      id: "8",
      name: "Candra Wijaya",
      phone: "0814-6789-0123",
      licenseType: "L 1830 CAM",
      experience: 3,
      assignedVehicle: "L 8318 SH",
      status: "Menunggu Jam Muat",
      avatar: "/img/driver8.jpg",
      vehicleType:
        "Ultra Long Wheelbase Heavy Duty 10x4 Axle Diesel Truck - Multi Axle Expandable Flatbed Modular Cargo Carrier for Oversized Materials and Equipment Transportation Needs",
    },
    {
      id: "9",
      name: "Dedi Kurniawan",
      phone: "0815-7890-1234",
      licenseType: "-",
      experience: 1,
      assignedVehicle: "-",
      status: "Belum Dipasangkan",
      avatar: "/img/driver9.jpg",
      vehicleType: "-",
    },
    {
      id: "10",
      name: "Eko Prasetyo",
      phone: "0816-8901-2345",
      licenseType: "L 1931 CAM",
      experience: 9,
      assignedVehicle: "L 8319 SH",
      status: "Bertugas",
      avatar: "/img/driver10.jpg",
      vehicleType:
        "Ultra Long Wheelbase Heavy Duty 10x4 Axle Diesel Truck - Multi Axle Expandable Flatbed Modular Cargo Carrier for Oversized Materials and Equipment Transportation Needs",
    },
    {
      id: "11",
      name: "Fajar Ramadhan",
      phone: "0817-9012-3456",
      licenseType: "L 2032 CAM",
      experience: 2,
      assignedVehicle: "L 8320 SH",
      status: "Nonaktif",
      avatar: "/img/driver11.jpg",
      vehicleType:
        "Ultra Long Wheelbase Heavy Duty 10x4 Axle Diesel Truck - Multi Axle Expandable Flatbed Modular Cargo Carrier for Oversized Materials and Equipment Transportation Needs",
    },
  ]; // Mock data for cancellations
  const mockCancellationData = [
    {
      orderId: "ORD-2024-001",
      date: "2024-01-15",
      origin: "Jakarta",
      destination: "Surabaya",
      reason: "Kendaraan mengalami kerusakan",
      cancelledBy: "Transporter",
    },
    {
      orderId: "ORD-2024-002",
      date: "2024-01-14",
      origin: "Bandung",
      destination: "Yogyakarta",
      reason: "Driver tidak tersedia",
      cancelledBy: "Transporter",
    },
    {
      orderId: "ORD-2024-003",
      date: "2024-01-13",
      origin: "Medan",
      destination: "Pekanbaru",
      reason: "Permintaan customer",
      cancelledBy: "Customer",
    },
    {
      orderId: "ORD-2024-004",
      date: "2024-01-12",
      origin: "Semarang",
      destination: "Solo",
      reason: "Cuaca buruk",
      cancelledBy: "Transporter",
    },
    {
      orderId: "ORD-2024-005",
      date: "2024-01-11",
      origin: "Palembang",
      destination: "Lampung",
      reason: "Masalah teknis",
      cancelledBy: "Transporter",
    },
  ];

  const mockPaymentData = [];
  const mockCompanyData = [];
  const mockHistoryData = [];

  useEffect(() => {
    // Mock data for different transporter statuses based on ID
    const mockTransporterVariations = {
      1: {
        id: "1",
        companyName:
          "PT Kalimantan Timur Jaya Sentosa Makmur Sejahtera Internasional",
        email: "contact.shipper@mail.com",
        picName: "Ahmad Maulana",
        picPhone: "No. HP : 0822-3100-1231",
        address:
          "Jl. Anggrek No. 123, RT 05 RW 09, Kel. Mekarsari, Kec. Cimanggis, Kota Depok, Provinsi Jawa Barat, Kode Pos 16951",
        status: "Aktif",
        location: "Depok",
        completedOrders: 124,
        joinDate: "2 Jan 2025",
        logo: "/img/kaltim.png",
      },
      2: {
        id: "2",
        companyName: "PT Transport Nusantara Logistics",
        email: "info@nusantaralogistics.com",
        picName: "Budi Santoso",
        picPhone: "No. HP : 0821-5500-9988",
        address: "Jl. Sudirman No. 45, Jakarta Pusat",
        status: "Non Aktif",
        location: "Jakarta",
        completedOrders: 89,
        joinDate: "15 Mar 2024",
        logo: "/img/kaltim.png",
      },
    };

    const mockTransporterData =
      mockTransporterVariations[transporterId] ||
      mockTransporterVariations["1"];

    // Simulate API call to fetch transporter data
    setTransporterData(mockTransporterData);
  }, [transporterId]);

  const openModal = (type, data) => {
    setModalState({ isOpen: true, type, data });
  };

  const openHubungiModal = () => {
    setHubungiModalOpen(true);
  };

  const closeHubungiModal = () => {
    setHubungiModalOpen(false);
  };

  const handleConfirmAction = () => {
    if (!modalState.data) return;

    if (modalState.type === "deactivate") {
      // Update the transporter status to Non Aktif
      setTransporterData((prevData) => ({
        ...prevData,
        status: "Non Aktif",
      }));
      toast.success("Berhasil menonaktifkan Transporter");
    } else if (modalState.type === "activate") {
      // Update the transporter status to Aktif
      setTransporterData((prevData) => ({
        ...prevData,
        status: "Aktif",
      }));
      toast.success("Berhasil mengaktifkan Transporter");
    }
    setModalState({ isOpen: false, type: "", data: null });
  };

  const renderConfirmationModal = () => {
    if (!modalState.isOpen || !modalState.data) return null;

    const commonProps = {
      isOpen: modalState.isOpen,
      setIsOpen: (val) => setModalState({ ...modalState, isOpen: val }),
      size: "small",
    };

    const isDeactivate = modalState.type === "deactivate";
    const modalConfig = {
      title: isDeactivate ? "Non Aktifkan Transporter" : "Aktifkan Transporter",
      actionText: isDeactivate ? "Ya, Non Aktifkan" : "Ya, Aktifkan",
      question: isDeactivate ? "menonaktifkan" : "mengaktifkan",
    };

    return (
      <ConfirmationModal
        {...commonProps}
        title={{ text: modalConfig.title }}
        description={{
          text: (
            <>
              Apakah kamu yakin ingin {modalConfig.question} Transporter{" "}
              <strong>{transporterData?.companyName}</strong>?
            </>
          ),
        }}
        confirm={{
          text: modalConfig.actionText,
          onClick: handleConfirmAction,
          classname:
            " border border-[--muat-trans-secondary-900] bg-neutral-50 text-[--muat-trans-secondary-900] hover:bg-[--muat-trans-secondary-50]",
        }}
        cancel={{
          text: "Kembali",
          classname:
            " bg-[--muat-trans-primary-400] text-neutral-900 hover:bg-[--muat-trans-primary-500] border-none",
          onClick: () => commonProps.setIsOpen(false),
        }}
      />
    );
  };

  // Reusable status indicator component
  const StatusIndicator = ({ status }) => {
    const isActive = status === "Aktif";
    return (
      <div className="flex items-center space-x-1">
        <div
          className={`aspect-square size-[6px] rounded-[100%] ${
            isActive ? "bg-success-500" : "bg-error-500"
          }`}
        />
        <p>{status}</p>
      </div>
    );
  };

  // Reusable statistics item component
  const StatisticItem = ({ value, label }) => (
    <div className="flex flex-col gap-2 px-3 text-center">
      <div className="text-base font-bold text-black">{value}</div>
      <div className="text-xs text-neutral-900">{label}</div>
    </div>
  );

  if (!transporterData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      {/* Transporter Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-start gap-3">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-[100%] border border-neutral-400 bg-white p-2">
            <img
              src={transporterData.logo}
              alt="logo"
              className="rounded-[100%] object-contain"
            />
          </div>
          <div className="space-y-3">
            <div>
              <h1 className="text-xl font-bold text-black">
                {transporterData.companyName}
              </h1>
              <div className="mt-2 flex items-center space-x-2 text-sm">
                <StatusIndicator status={transporterData.status} />
                <span>&bull;</span>
                <div className="flex items-center space-x-1">
                  <IconComponent
                    src="/icons/location.svg"
                    className="text-neutral-600"
                    width={16}
                    height={16}
                  />

                  <span className="font-medium text-neutral-900">
                    {transporterData.location}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="muattrans-primary-secondary"
              iconLeft={
                <IconComponent
                  src="/icons/chat16.svg"
                  className="text-black"
                  width={16}
                  height={16}
                />
              }
              onClick={openHubungiModal}
              className="text-black hover:bg-neutral-50"
            >
              Hubungi
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-8">
          <div className="grid grid-cols-2 items-center divide-x divide-neutral-400">
            <StatisticItem
              value={transporterData.completedOrders}
              label="Pesanan Selesai"
            />
            <StatisticItem
              value={transporterData.joinDate}
              label="Bergabung Sejak"
            />
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="">
        <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-neutral-200 px-6 pt-6">
            <TabsList className="">
              <TabsTriggerWithSeparator
                value="daftar-armada"
                activeColor="primary-700"
                className="!text-base"
              >
                Daftar Armada
              </TabsTriggerWithSeparator>
              <TabsTriggerWithSeparator
                value="daftar-driver"
                activeColor="primary-700"
                className="!text-base"
              >
                Daftar Driver
              </TabsTriggerWithSeparator>
              <TabsTriggerWithSeparator
                value="rekap-pembatalan"
                activeColor="primary-700"
                className="!text-base"
              >
                Rekap Pembatalan
              </TabsTriggerWithSeparator>
              <TabsTriggerWithSeparator
                value="data-transporter"
                activeColor="primary-700"
                className="!text-base"
              >
                Data Transporter
              </TabsTriggerWithSeparator>
              <TabsTriggerWithSeparator
                value="riwayat-status"
                activeColor="primary-700"
                showSeparator={false}
                className="!text-base"
              >
                Riwayat Status
              </TabsTriggerWithSeparator>
            </TabsList>
          </div>

          {/* Tab Content */}
          <DaftarArmadaTab mockFleetData={mockFleetData} />

          <DaftarDriverTab mockDriverData={mockDriverData} />
          <RekapPembatalanTab mockCancellationData={mockCancellationData} />
          <DataTransporterTab transporterData={transporterData} />
          <RiwayatStatusTab />
        </Tabs>
      </div>

      {/* Modals */}
      {renderConfirmationModal()}
      <HubungiModal
        isOpen={hubungiModalOpen}
        onClose={closeHubungiModal}
        transporterData={transporterData}
      />
    </div>
  );
};

export default TransporterDetailContainer;
