"use client";

import { useState } from "react";

import Checkbox from "@/components/Checkbox/Checkbox";
import IconComponent from "@/components/IconComponent/IconComponent";
import Input from "@/components/Input/Input";
import RadioButton from "@/components/Radio/RadioButton";

import {
  FormLabel,
  FormLabelContainer,
  FormLabelInfoTooltip,
} from "../FormLabel/FormLabel";

const InformasiMuatanScreen = () => {
  // State Management
  const [tipeMuatan, setTipeMuatan] = useState("");
  const [jenisMuatan, setJenisMuatan] = useState("");
  const [halalCertification, setHalalCertification] = useState(false);
  const [namaMuatan, setNamaMuatan] = useState("");
  const [beratMuatan, setBeratMuatan] = useState("");
  const [dimensiP, setDimensiP] = useState("");
  const [dimensiL, setDimensiL] = useState("");
  const [dimensiT, setDimensiT] = useState("");

  const [tempInformasiMuatan, setTempInformasiMuatan] = useState({
    tipeMuatan: "",
    jenisMuatan: "",
    sertifikasiHalal: false,
  });

  // Handler Functions
  const handleTempInformasiMuatanChange = (field, value) => {
    setTempInformasiMuatan((prevState) => ({ ...prevState, [field]: value }));
  };
  const handleTipeMuatanChange = (data) => {
    setTipeMuatan(data.value);
  };

  const handleJenisMuatanChange = (data) => {
    setJenisMuatan(data.value);
  };

  const handleHalalCertificationChange = (data) => {
    setHalalCertification(data.checked);
  };

  const handleAddMuatan = () => {
    // Add functionality here
    console.log("Add muatan clicked");
  };

  return (
    <div className="mt-[62px] flex min-h-screen w-full flex-col gap-2 bg-neutral-200">
      {/* Section Tipe Muatan */}
      <div className="flex flex-col gap-y-4 bg-white px-4 py-5">
        {/* Header */}
        <FormLabelContainer>
          <FormLabel className="font-bold" title="Tipe Muatan" />
          <FormLabelInfoTooltip title="Tipe Muatan yang Akan Dikirimkan">
            <div className="flex flex-col gap-y-4 px-4 py-6">
              {/* Main Content Area - Frame 42239 */}
              <ul style={{ marginLeft: "16px", listStyleType: "disc" }}>
                <li className="text-[14px] font-medium leading-[15.4px]">
                  <span className="font-bold">Bahan Mentah :</span> Material
                  atau komponen yang belum diproses
                </li>

                <li className="text-[14px] font-medium leading-[15.4px]">
                  <span className="font-bold">Barang Setengah Jadi :</span>{" "}
                  Produk yang telah mengalami beberapa tahap proses tapi belum
                  selesai.
                </li>

                <li className="text-[14px] font-medium leading-[15.4px]">
                  <span className="font-bold">Barang Jadi :</span> Produk akhir
                  yang siap untuk digunakan atau dijual.
                </li>

                <li className="text-[14px] font-medium leading-[15.4px]">
                  <span className="font-bold">Lainnya :</span> Barang / barang
                  yang tidak sesuai jenis diatas, namun memiliki nilai ekonomis
                  dan fungsi dalam proses produksi atau distribusi.
                </li>
              </ul>

              {/* Bottom Text Area - Frame 42240 */}
              <span className="text-center text-[14px] font-medium leading-[15.4px] text-neutral-900">
                Pemilihan tipe muatan yang tepat akan membantu dalam pengelolaan
                dan pengiriman.
              </span>
            </div>
          </FormLabelInfoTooltip>
        </FormLabelContainer>

        {/* Radio Button Group */}
        <div className="flex flex-col gap-4">
          <RadioButton
            name="tipeMuatan"
            label="Bahan Mentah"
            checked={tempInformasiMuatan.tipeMuatan === "bahan_mentah"}
            onClick={(data) =>
              handleTempInformasiMuatanChange("tipeMuatan", data.value)
            }
            value="bahan_mentah"
          />
          <RadioButton
            name="tipeMuatan"
            label="Barang Setengah Jadi"
            checked={tempInformasiMuatan.tipeMuatan === "barang_setengah_jadi"}
            onClick={(data) =>
              handleTempInformasiMuatanChange("tipeMuatan", data.value)
            }
            value="barang_setengah_jadi"
          />
          <RadioButton
            name="tipeMuatan"
            label="Barang Jadi"
            checked={tempInformasiMuatan.tipeMuatan === "barang_jadi"}
            onClick={(data) =>
              handleTempInformasiMuatanChange("tipeMuatan", data.value)
            }
            value="barang_jadi"
          />
          <RadioButton
            name="tipeMuatan"
            label="Lainnya"
            checked={tempInformasiMuatan.tipeMuatan === "lainnya"}
            onClick={(data) =>
              handleTempInformasiMuatanChange("tipeMuatan", data.value)
            }
            value="lainnya"
          />
        </div>
      </div>

      {/* Section Jenis Muatan */}
      <div className="flex flex-col gap-4 bg-white px-4 py-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <h3 className="text-[14px] font-bold leading-[15px] text-black">
              Jenis Muatan*
            </h3>
            <IconComponent
              src="/icons/info.svg"
              height={16}
              width={16}
              classname="icon-gray"
            />
          </div>
          <span className="text-[12px] font-semibold leading-[13px] text-primary-700 opacity-0">
            Reset Pilihan
          </span>
        </div>

        {/* Radio Button Group */}
        <div className="flex flex-col gap-4">
          <RadioButton
            name="jenisMuatan"
            label="Padat"
            checked={tempInformasiMuatan.jenisMuatan === "padat"}
            onClick={(data) =>
              handleTempInformasiMuatanChange("jenisMuatan", data.value)
            }
            value="padat"
          />
          <RadioButton
            name="jenisMuatan"
            label="Cair"
            checked={tempInformasiMuatan.jenisMuatan === "cair"}
            onClick={(data) =>
              handleTempInformasiMuatanChange("jenisMuatan", data.value)
            }
            value="cair"
          />
          <RadioButton
            name="jenisMuatan"
            label="Curah"
            checked={tempInformasiMuatan.jenisMuatan === "curah"}
            onClick={(data) =>
              handleTempInformasiMuatanChange("jenisMuatan", data.value)
            }
            value="curah"
          />
          <RadioButton
            name="jenisMuatan"
            label="Kendaraan"
            checked={tempInformasiMuatan.jenisMuatan === "kendaraan"}
            onClick={(data) =>
              handleTempInformasiMuatanChange("jenisMuatan", data.value)
            }
            value="kendaraan"
          />
          <RadioButton
            name="jenisMuatan"
            label="Container"
            checked={tempInformasiMuatan.jenisMuatan === "container"}
            onClick={(data) =>
              handleTempInformasiMuatanChange("jenisMuatan", data.value)
            }
            value="container"
          />
        </div>
      </div>

      {/* Section Sertifikasi Halal Logistik */}
      <div className="flex flex-col gap-4 bg-white px-4 py-5">
        {/* Header */}
        <div className="flex items-center gap-1">
          <h3 className="text-[14px] font-bold leading-[15px] text-black">
            Sertifikasi Halal Logistik
          </h3>
          <span className="text-[10px] font-semibold leading-[12px] text-black">
            (Opsional)
          </span>
          <IconComponent
            src="/icons/info.svg"
            height={16}
            width={16}
            classname="icon-gray"
          />
        </div>

        {/* Checkbox Section */}
        <div className="flex gap-1">
          <Checkbox
            checked={tempInformasiMuatan.sertifikasiHalal}
            onChange={handleHalalCertificationChange}
            label="Centang opsi jika pengiriman memerlukan armada dengan sertifikat halal logistik"
            value="halal_certification"
            classname="w-full"
          />
        </div>
      </div>

      {/* Section Input Data Muatan */}
      <div className="flex flex-col gap-6 bg-white px-4 py-5">
        {/* Nama Muatan Field */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[14px] font-semibold leading-[15px] text-black">
            Nama Muatan*
          </h3>
          <Input
            type="text"
            placeholder="Masukkan Muatan"
            name="nama_muatan"
            disabled={true}
            icon={{
              left: "/icons/search.svg",
              right: "/icons/chevron-down.svg",
            }}
            classname="w-full"
            classInput="bg-neutral-200 text-neutral-600"
            value={namaMuatan}
            changeEvent={(e) => setNamaMuatan(e.target.value)}
          />
        </div>

        {/* Berat Muatan Field */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1">
            <h3 className="text-[14px] font-semibold leading-[15px] text-black">
              Berat Muatan*
            </h3>
            <IconComponent
              src="/icons/info.svg"
              height={16}
              width={16}
              classname="icon-gray"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <Input
              type="number"
              placeholder="0"
              name="berat_muatan"
              classname="flex-1"
              classInput="bg-neutral-200 text-neutral-600"
              value={beratMuatan}
              changeEvent={(e) => setBeratMuatan(e.target.value)}
            />
            <Input
              type="text"
              value="kg"
              disabled={true}
              icon={{
                right: "/icons/chevron-down.svg",
              }}
              classname="w-16"
              classInput="bg-neutral-200 text-center text-neutral-600"
            />
          </div>
        </div>

        {/* Dimensi Muatan Field */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1">
            <h3 className="text-[14px] font-semibold leading-[15px] text-black">
              Dimensi Muatan
            </h3>
            <span className="text-[10px] font-semibold leading-[12px] text-black">
              (Opsional)
            </span>
            <IconComponent
              src="/icons/info.svg"
              height={16}
              width={16}
              classname="icon-gray"
            />
          </div>

          <div className="flex items-center gap-2.5">
            {/* Custom Dimension Input */}
            <div className="flex flex-1 items-center gap-2 rounded-md border border-neutral-600 bg-neutral-200 p-3">
              <input
                type="number"
                placeholder="p"
                className="w-full bg-transparent text-center text-[14px] font-semibold text-neutral-600 outline-none placeholder:text-neutral-600"
                value={dimensiP}
                onChange={(e) => setDimensiP(e.target.value)}
              />
              <span className="text-[12px] font-semibold text-neutral-600">
                x
              </span>
              <input
                type="number"
                placeholder="l"
                className="w-full bg-transparent text-center text-[14px] font-semibold text-neutral-600 outline-none placeholder:text-neutral-600"
                value={dimensiL}
                onChange={(e) => setDimensiL(e.target.value)}
              />
              <span className="text-[12px] font-semibold text-neutral-600">
                x
              </span>
              <input
                type="number"
                placeholder="t"
                className="w-full bg-transparent text-center text-[14px] font-semibold text-neutral-600 outline-none placeholder:text-neutral-600"
                value={dimensiT}
                onChange={(e) => setDimensiT(e.target.value)}
              />
            </div>

            <Input
              type="text"
              value="m"
              disabled={true}
              icon={{
                right: "/icons/chevron-down.svg",
              }}
              classname="w-16"
              classInput="bg-neutral-200 text-center text-neutral-600"
            />
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <button
            onClick={handleAddMuatan}
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-neutral-600 bg-white transition-colors hover:bg-neutral-50"
          >
            <IconComponent
              src="/icons/plus.svg"
              height={16}
              width={16}
              classname="icon-gray"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InformasiMuatanScreen;
