import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

const ModalUbahTransporter = ({ open, onClose }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [selectedArmada, setSelectedArmada] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  if (!open) return null;

  const transporterList = [
    {
      id: 1,
      name: "PT Siba Surya",
      cocok: 3,
      aktif: 1,
      nonaktif: 2,
      status: "rekomendasi",
      armada: [
        {
          id: "A1",
          rekomendasi: true,
          nopol: "L 1111 LBA",
          driver: "Noel Gallagher",
          aktif: true,
          jarak: "1 km",
          lokasi: "Kec. Lowokwaru, Kota Malang",
        },
        {
          id: "A2",
          rekomendasi: false,
          nopol: "L 2222 LBA",
          driver: "Rizky Aditya Pratama",
          aktif: true,
          jarak: "3 km",
          lokasi: "Kec. Lowokwaru, Kota Malang",
        },
      ],
    },
    {
      id: 2,
      name: "CV Moga Jaya Abadi",
      cocok: 2,
      aktif: 1,
      nonaktif: 1,
      status: "menolak",
      armada: [
        {
          id: "B1",
          rekomendasi: false,
          nopol: "AE 3333 LBA",
          driver: "Budi Santoso",
          aktif: false,
          jarak: "5 km",
          lokasi: "Kec. Blimbing, Kota Malang",
        },
      ],
    },
    {
      id: 2,
      name: "CV Moga Jaya Abadi",
      cocok: 2,
      aktif: 1,
      nonaktif: 1,
      status: "menolak",
      armada: [
        {
          id: "B1",
          rekomendasi: false,
          nopol: "AE 3333 LBA",
          driver: "Budi Santoso",
          aktif: false,
          jarak: "5 km",
          lokasi: "Kec. Blimbing, Kota Malang",
        },
      ],
    },
    {
      id: 2,
      name: "CV Moga Jaya Abadi",
      cocok: 2,
      aktif: 1,
      nonaktif: 1,
      status: "menolak",
      armada: [
        {
          id: "B1",
          rekomendasi: false,
          nopol: "AE 3333 LBA",
          driver: "Budi Santoso",
          aktif: false,
          jarak: "5 km",
          lokasi: "Kec. Blimbing, Kota Malang",
        },
      ],
    },
    {
      id: 2,
      name: "CV Moga Jaya Abadi",
      cocok: 2,
      aktif: 1,
      nonaktif: 1,
      status: "menolak",
      armada: [
        {
          id: "B1",
          rekomendasi: false,
          nopol: "AE 3333 LBA",
          driver: "Budi Santoso",
          aktif: false,
          jarak: "5 km",
          lokasi: "Kec. Blimbing, Kota Malang",
        },
      ],
    },
    {
      id: 2,
      name: "CV Moga Jaya Abadi",
      cocok: 2,
      aktif: 1,
      nonaktif: 1,
      status: "menolak",
      armada: [
        {
          id: "B1",
          rekomendasi: false,
          nopol: "AE 3333 LBA",
          driver: "Budi Santoso",
          aktif: false,
          jarak: "5 km",
          lokasi: "Kec. Blimbing, Kota Malang",
        },
      ],
    },
  ];

  if (showDetail) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div className="relative w-[700px] rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-center">
            <h2 className="text-[16px] font-bold text-neutral-900">
              Informasi Perubahan Transporter
            </h2>
            <button
              onClick={onClose}
              className="absolute right-2 top-2 text-primary-700 hover:text-primary-800"
            >
              <IconComponent src="/icons/close24.svg" className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4 rounded-lg border border-neutral-400 bg-neutral-50 p-4">
            <div className="flex items-center gap-4">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-muat-trans-primary-400">
                <IconComponent
                  src="/icons/transporter14.svg"
                  className="inline-block h-4 w-4 text-muat-trans-secondary-900"
                />
              </div>
              <span className="text-xs font-bold">Perubahan Transporter</span>
            </div>
            <div className="mb-6 mt-3 flex gap-4 border-t border-neutral-400 pt-3">
              <div className="mr-6 flex-1 border-r border-neutral-400 pr-6">
                <div>
                  <div className="mb-4 text-xs font-medium text-neutral-600">
                    Transporter Awal
                  </div>
                  <div className="mb-1 flex items-center gap-2">
                    <img
                      src="/logo-placeholder.png"
                      alt="Logo"
                      className="h-12 w-12 rounded-full border"
                    />
                    <div className="space-y-1">
                      <p className="text-xs font-bold">CV Moga Jaya Abadi</p>
                      <div className="space-x-1">
                        <IconComponent
                          src="/icons/call16.svg"
                          className="ml-1 inline-block h-4 w-4 text-muat-trans-secondary-900"
                        />
                        <span className="text-xs font-medium">
                          0812-3456-7890
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-4 text-xs font-medium text-neutral-600">
                    Armada Awal
                  </div>
                  <div className="mb-1 flex items-center gap-2">
                    <img
                      src="/logo-placeholder.png"
                      alt="Logo"
                      className="h-12 w-12 rounded-full border"
                    />
                    <div className="space-y-1">
                      <p className="text-xs font-bold">AE 1111 LBA</p>
                      <div className="space-x-1">
                        <IconComponent
                          src="/icons/profile16.svg"
                          className="ml-1 inline-block h-4 w-4 text-muat-trans-secondary-900"
                        />
                        <span className="text-xs font-medium">
                          Malik Ganteng
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div>
                  <div className="mb-4 text-xs font-medium text-neutral-600">
                    Transporter Baru
                  </div>
                  <div className="mb-1 flex items-center gap-2">
                    <img
                      src="/logo-placeholder.png"
                      alt="Logo"
                      className="h-12 w-12 rounded-full border"
                    />
                    <div className="space-y-1">
                      <p className="text-xs font-bold">CV Moga Jaya Abadi</p>
                      <div className="space-x-1">
                        <IconComponent
                          src="/icons/call16.svg"
                          className="ml-1 inline-block h-4 w-4 text-muat-trans-secondary-900"
                        />
                        <span className="text-xs font-medium">
                          0812-3456-7890
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-4 text-xs font-medium text-neutral-600">
                    Armada Baru
                  </div>
                  <div className="mb-1 flex items-center gap-2">
                    <img
                      src="/logo-placeholder.png"
                      alt="Logo"
                      className="h-12 w-12 rounded-full border"
                    />
                    <div className="space-y-1">
                      <p className="text-xs font-bold">AE 1111 LBA</p>
                      <div className="space-x-1">
                        <IconComponent
                          src="/icons/profile16.svg"
                          className="ml-1 inline-block h-4 w-4 text-muat-trans-secondary-900"
                        />
                        <span className="text-xs font-medium">
                          Malik Ganteng
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setShowDetail(false)}
              variant="muattrans-primary-secondary"
            >
              Kembali
            </Button>
            <Button onClick={onClose} variant="muattrans-primary">
              Kirim Perubahan
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="relative w-[700px] rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-center">
          <h2 className="text-[16px] font-bold text-neutral-900">
            Ubah Transporter
          </h2>
          <button
            onClick={onClose}
            className="absolute right-2 top-2 text-primary-700 hover:text-primary-800"
          >
            <IconComponent src="/icons/close24.svg" className="h-5 w-5" />
          </button>
        </div>

        <Input
          placeholder="Cari No. Polisi / Nama Driver / Transporter "
          icon={{ left: "/icons/search.svg" }}
          className="w-full text-sm"
        />

        <p className="mb-4 mt-3 text-xs font-bold">
          Pilih 1 unit armada untuk ditugaskan
        </p>

        <div className="max-h-[266px] space-y-3 overflow-y-auto">
          {transporterList.map((t) => (
            <div
              key={t.id}
              className="relative overflow-hidden rounded-lg border border-neutral-400 bg-neutral-100"
            >
              {t.status === "rekomendasi" && (
                <span className="absolute right-0 top-0 rounded-bl bg-success-400 px-11 py-[6px] text-xs font-semibold text-white">
                  Rekomendasi
                </span>
              )}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="transporter"
                    onChange={() => setSelectedTransporter(t)}
                    checked={selectedTransporter?.id === t.id}
                  />
                  <img
                    src="/logo-placeholder.png"
                    alt="Logo"
                    className="h-14 w-14 rounded-full border"
                  />
                  <div className="space-y-2">
                    <div className="text-xs font-bold">{t.name}</div>
                    <div className="text-xs font-medium">
                      {t.cocok} Armada Yang Cocok
                    </div>
                    <div className="flex gap-3 text-[10px] font-medium">
                      <span className="flex items-center gap-1">
                        <IconComponent
                          src="/icons/transporter12.svg"
                          className="inline-block h-3 w-3"
                        />
                        {t.aktif} Armada Aktif
                      </span>
                      <span className="flex items-center gap-1">
                        <IconComponent
                          src="/icons/transporter12.svg"
                          className="inline-block h-3 w-3"
                        />{" "}
                        {t.nonaktif} Armada Nonaktif
                      </span>
                    </div>
                    {t.status === "menolak" && (
                      <span className="text-xs font-bold text-error-400">
                        Transporter Menolak
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() =>
                      setExpandedId(expandedId === t.id ? null : t.id)
                    }
                    variant="muattrans-primary-secondary"
                  >
                    Hubungi
                  </Button>
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === t.id ? null : t.id)
                    }
                  >
                    <IconComponent
                      src="/icons/chevron-down.svg"
                      className={`h-6 w-6 transition-transform ${
                        expandedId === t.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {expandedId === t.id && (
                <div className="space-y-2 bg-neutral-50">
                  {t.armada.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between border-t border-neutral-400 bg-white p-4"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="armada"
                          onChange={() => setSelectedArmada(a)}
                          checked={selectedArmada?.id === a.id}
                        />
                        <img
                          src="/truck-placeholder.png"
                          alt="Truck"
                          className="h-14 w-14 rounded border"
                        />
                        <div className="space-y-2">
                          {a.rekomendasi && (
                            <div className="inline-block text-xs font-bold text-success-400">
                              Rekomendasi
                            </div>
                          )}
                          <div className="text-xs font-semibold text-neutral-800">
                            <span className="text-xs font-bold text-neutral-900">
                              {a.nopol}
                            </span>{" "}
                            - {a.driver}
                          </div>
                          <div className="text-[10px] text-neutral-600">
                            <IconComponent
                              src="/icons/lokasi20.svg"
                              className="mr-1 inline-block h-[14px] w-[14px] text-muat-trans-secondary-900"
                            />
                            {a.jarak} dari lokasi muat -{" "}
                            <span className="font-medium text-neutral-900">
                              {a.lokasi}
                            </span>
                          </div>
                        </div>
                      </div>
                      {a.aktif && (
                        <button
                          type="button"
                          className={cn(
                            "rounded-md bg-success-400 px-8 py-2 text-xs font-semibold text-success-50"
                          )}
                        >
                          Aktif
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="muattrans-error-secondary" onClick={onClose}>
            Batalkan Armada
          </Button>
          <div className="flex gap-3">
            <Button onClick={onClose} variant="muattrans-primary-secondary">
              Batal
            </Button>
            <Button
              onClick={() => setShowDetail(true)}
              variant="muattrans-primary"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalUbahTransporter;
