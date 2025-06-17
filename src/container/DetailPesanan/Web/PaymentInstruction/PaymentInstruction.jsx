import { useState } from "react";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export const PaymentInstruction = ({ dataPaymentInstruction }) => {
  const [expandedItem, setExpandedItem] = useState(0); // First item expanded by default

  const paymentMethods = [
    {
      title: "ATM",
      content: (
        <div className="px-3 pb-4 pr-11">
          <div className="text-[12px] font-normal leading-[14.4px] text-[#1B1B1B]">
            <ol className="list-inside list-decimal space-y-1">
              <li>Masukkan Kartu ATM BCA & PIN</li>
              <li>
                Pilih menu Transaksi Lainnya {">"} Transfer {">"} Virtual
                Account
              </li>
              <li>Masukkan Nomor Virtual Account di atas</li>
              <li>
                Di halaman konfirmasi, pastikan detail pembayaran sudah sesuai
                seperti No. VA, Nama Perus/Produk, dan Total Tagihan
              </li>
              <li>Masukkan Jumlah Transfer sesuai dengan Total Tagihan</li>
              <li>Ikuti instruksi untuk menyelesaikan transaksi</li>
              <li>Simpan struk transaksi sebagai bukti pembayaran</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      title: "Internet Banking",
      content: (
        <div className="px-3 pb-4 pr-11">
          <div className="text-[12px] font-normal leading-[14.4px] text-[#1B1B1B]">
            Instruksi untuk Internet Banking akan ditampilkan di sini.
          </div>
        </div>
      ),
    },
    {
      title: "Mobile Banking (m-BCA)",
      content: (
        <div className="px-3 pb-4 pr-11">
          <div className="text-[12px] font-normal leading-[14.4px] text-[#1B1B1B]">
            Instruksi untuk Mobile Banking akan ditampilkan di sini.
          </div>
        </div>
      ),
    },
    {
      title: "Kantor Bank BCA",
      content: (
        <div className="px-3 pb-4 pr-11">
          <div className="text-[12px] font-normal leading-[14.4px] text-[#1B1B1B]">
            Instruksi untuk pembayaran di Kantor Bank BCA akan ditampilkan di
            sini.
          </div>
        </div>
      ),
    },
  ];

  const toggleAccordion = (index) => {
    setExpandedItem(expandedItem === index ? -1 : index);
  };

  return (
    <div
      className="flex h-auto w-[338px] flex-col gap-6 rounded-xl bg-white p-6"
      style={{
        boxShadow: "0px 4px 11px rgba(65, 65, 65, 0.25)",
      }}
    >
      {/* Header */}
      <h2 className="text-[16px] font-bold leading-[19.2px] text-black">
        Cara Pembayaran
      </h2>

      {/* Accordion Container */}
      <div className="flex h-auto w-full flex-col">
        {dataPaymentInstruction.map((method, index) => (
          <div key={index} className="w-full">
            {/* Accordion Header */}
            <div
              className={`flex cursor-pointer flex-row items-center justify-center gap-2.5 border-b border-[#C4C4C4] bg-white px-4 transition-all duration-300 ease-in-out ${expandedItem === index ? "py-3 pb-6" : "py-3"} ${index === paymentMethods.length - 1 && expandedItem !== index ? "border-b-0" : ""} `}
              onClick={() => toggleAccordion(index)}
            >
              <span className="flex-1 text-[14px] font-medium leading-[16.8px] text-black">
                {method.title}
              </span>

              {/* Icon */}
              <div className="flex h-6 w-6 items-center justify-center">
                <ChevronDown
                  className={cn(
                    "h-3 w-3 border-black transition-all duration-300 ease-in-out",
                    expandedItem === index && "rotate-180"
                  )}
                  style={{
                    transformOrigin: "center",
                  }}
                />
              </div>
            </div>

            {/* Accordion Content */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                expandedItem === index
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              )}
            >
              <div className="border-b border-[#C4C4C4] bg-white">
                <div className="px-3 pb-4 pr-11 pt-3">
                  <div className="text-[12px] font-normal leading-[14.4px] text-[#1B1B1B]">
                    <ol className="list-decimal space-y-1 pl-6">
                      {method.item.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
