import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { cn } from "@/lib/utils";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

import FleetOrderConfirmationModal from "../FleetOrderConfirmationModal/FleetOrderConfirmationModal";

export const SummaryPanel = () => {
  const paymentMethods = [
    {
      title: "Transfer Virtual Account",
      icon: "/icons/transfer24.svg",
      options: [
        {
          id: "bca",
          name: "BCA Virtual Account",
          icon: "/icons/bca24.svg",
        },
        {
          id: "mandiri",
          name: "Mandiri Virtual Account",
          icon: "/icons/bca24.svg",
        },
        {
          id: "bni",
          name: "BNI Virtual Account",
          icon: "/icons/bca24.svg",
        },
        {
          id: "bri",
          name: "BRI Virtual Account",
          icon: "/icons/bca24.svg",
        },
        {
          id: "bsi",
          name: "BSI Virtual Account",
          icon: "/icons/bca24.svg",
        },
        {
          id: "permata",
          name: "Permata Virtual Account",
          icon: "/icons/bca24.svg",
        },
        {
          id: "cimb",
          name: "CIMB Virtual Account",
          icon: "/icons/bca24.svg",
        },
      ],
    },
  ];

  const router = useRouter();

  const jenisTruk = useSewaArmadaStore((state) => state.formValues.jenisTruk);
  const bantuanTambahan = useSewaArmadaStore(
    (state) => state.formValues.bantuanTambahan
  );
  const isCompany = useSewaArmadaStore((state) => state.formValues.isCompany);
  const opsiPembayaran = useSewaArmadaStore(
    (state) => state.formValues.opsiPembayaran
  );
  const { setField, validateForm } = useSewaArmadaActions();

  const [isOpsiPembayaranModalOpen, setIsOpsiPembayaranModalOpen] =
    useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set([0])); // Initialize with first category expanded
  const [isModalConfirmationOpen, setIsModalConfirmationOpen] = useState(false);

  const toggleSection = (categoryKey) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryKey)) {
        newSet.delete(categoryKey);
      } else {
        newSet.add(categoryKey);
      }
      return newSet;
    });
  };

  const handleSelectPaymentMethod = (paymentMethod) => {
    setField("opsiPembayaran", paymentMethod);
    setIsOpsiPembayaranModalOpen(false);
  };

  const handleValidateFleetOrder = () => {
    const isValidForm = validateForm();
    if (isValidForm) {
      setIsModalConfirmationOpen(true);
    }
  };

  const handleOrderFleet = () => {
    alert("Hore Berhasil Sewa Armada :)");
    setIsModalConfirmationOpen(false);
    router.push("/daftarpesanan/detailpesanan/1");
  };

  const selectedOpsiPembayaran = opsiPembayaran
    ? paymentMethods
        .flatMap((method) => method.options || [])
        .find((item) => item.id === opsiPembayaran.id)
    : null;

  const detailPesanan = [
    {
      title: "Biaya Lainnya",
      items: [
        {
          label: "Admin Layanan",
          cost: 10000,
        },
        // Conditional item using spread operator
        ...(isCompany
          ? [
              {
                label: "Pajak",
                cost: 21300,
              },
            ]
          : []),
      ],
    },
  ];

  // Method: Using flatMap and reduce
  const totalCost = detailPesanan
    .flatMap((section) => section.items)
    .reduce((total, item) => total + item.cost, 0);

  return (
    <>
      <Card className="shadow-muat flex w-[338px] flex-col gap-6 rounded-xl border-none bg-white">
        <div className="flex flex-col gap-y-6 px-5 pt-6">
          <h3 className="text-base font-bold text-black">
            Ringkasan Transaksi
          </h3>

          <div className="scrollbar-custombadanusaha mr-[-12px] flex max-h-[263px] flex-col gap-y-6 overflow-y-auto pr-2">
            <div className="flex h-10 items-center gap-2 rounded-md border border-primary-700 bg-primary-50 px-3 py-2">
              <div className="relative h-6 w-6">
                <Image
                  src="/icons/voucher24.svg"
                  alt="Voucher"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs font-medium text-black">
                Makin hemat pakai voucher
              </span>
              <IconComponent
                src="/icons/chevron-right.svg"
                width={16}
                height={16}
                className="ml-auto"
              />
            </div>
            {/* Nanti ganti dengan kondisi kalo sdh ada detail pesanan */}
            {true ? (
              <>
                <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
                  Detail Pesanan
                </span>
                {detailPesanan.map(({ title, items }, key) => (
                  <div className="flex flex-col gap-y-3" key={key}>
                    <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
                      {title}
                    </span>
                    {items.map(({ label, cost }, key) => (
                      <div
                        className="flex items-center justify-between"
                        key={key}
                      >
                        <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                          {label}
                        </span>
                        <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                          {`Rp${cost.toLocaleString("id-ID")}`}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </>
            ) : null}
          </div>
        </div>

        <div className="shadow-muat flex flex-col gap-y-6 rounded-b-xl px-5 py-6">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-black">Total</span>
            <span className="text-base font-bold text-black">
              Rp
              {bantuanTambahan ? "105.000" : totalCost.toLocaleString("id-ID")}
            </span>
          </div>
          {jenisTruk &&
            (selectedOpsiPembayaran ? (
              <div className="flex flex-col gap-y-4">
                <button
                  className="flex h-8 items-center justify-between rounded-md border border-neutral-600 px-3"
                  onClick={() => setIsOpsiPembayaranModalOpen(true)}
                >
                  <div className="flex items-center gap-x-2">
                    <IconComponent src={selectedOpsiPembayaran.icon} />
                    <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                      {selectedOpsiPembayaran.name}
                    </span>
                  </div>
                  <IconComponent src="/icons/chevron-right.svg" />
                </button>
                <Button
                  variant="muatparts-primary"
                  onClick={handleValidateFleetOrder}
                >
                  Lanjut Pembayaran
                </Button>
              </div>
            ) : (
              <Button
                variant="muatparts-primary"
                onClick={() => setIsOpsiPembayaranModalOpen(true)}
              >
                Pilih Opsi Pembayaran
              </Button>
            ))}
        </div>
      </Card>

      {/* MODAL OPSI PEMBAYARAN */}
      <Modal
        open={isOpsiPembayaranModalOpen}
        onOpenChange={setIsOpsiPembayaranModalOpen}
        closeOnOutsideClick={false}
      >
        <ModalContent>
          <div className="flex flex-col gap-y-4 px-6 py-8">
            <div className="flex w-[424px] justify-center">
              <h1 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
                Opsi Pembayaran
              </h1>
            </div>
            {/* Content Container */}
            <div className="mr-[-16px] flex max-h-[321px] flex-col overflow-y-auto pr-[11px]">
              {/* Section Title */}
              <h2 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
                Semua Metode
              </h2>

              {/* Payment Options List */}
              {paymentMethods.map((paymentMethod, categoryKey) => {
                const isExpanded = expandedCategories.has(categoryKey);

                return (
                  <div key={categoryKey}>
                    <div
                      className="flex h-12 w-full cursor-pointer items-center justify-between border-b border-neutral-400 px-0 py-3"
                      onClick={() => toggleSection(categoryKey)}
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent src={paymentMethod.icon} size="medium" />
                        <span className="text-[12px] font-bold leading-[14.4px] text-neutral-900">
                          {paymentMethod.title}
                        </span>
                      </div>
                      <IconComponent
                        src="/icons/chevron-down.svg"
                        className={cn(
                          "transition-transform duration-300",
                          isExpanded ? "rotate-180" : "rotate-0"
                        )}
                      />
                    </div>

                    {/* Payment Method Options */}
                    <div
                      className={`w-full overflow-hidden transition-all duration-300 ${
                        isExpanded
                          ? "max-h-[calc(100vh_-_124px)] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="flex flex-col pl-8">
                        {paymentMethod.options.map((option, optionKey) => (
                          <button
                            key={optionKey}
                            className="flex h-12 w-[392px] cursor-pointer items-center justify-between border-b border-neutral-400 px-0 py-3 hover:bg-neutral-50"
                            onClick={() => handleSelectPaymentMethod(option)}
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded border">
                                <IconComponent
                                  src={option.icon}
                                  width={20}
                                  height={20}
                                  className="object-contain"
                                />
                              </div>
                              <span className="text-[12px] font-semibold leading-[14.4px] text-neutral-900">
                                {option.name}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ModalContent>
      </Modal>

      <FleetOrderConfirmationModal
        isOpen={isModalConfirmationOpen}
        setIsOpen={setIsModalConfirmationOpen}
        onOrderFleet={handleOrderFleet}
      />
    </>
  );
};
