"use client";

import { Fragment, useEffect, useState } from "react";

import Checkbox from "@/components/Checkbox/Checkbox";
import DropdownRadioBottomsheeet from "@/components/Dropdown/DropdownRadioBottomsheeet";
import FooterOneButton from "@/components/Footer/OneButton";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import RadioButton from "@/components/Radio/RadioButton";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { useSewaArmadaStore } from "@/store/forms/sewaArmadaStore";

import {
  FormLabel,
  FormLabelContainer,
  FormLabelInfoTooltip,
} from "../FormLabel/FormLabel";

const InformasiMuatanScreen = () => {
  const namaMuatanOptions = [
    { value: "71b8881a-66ff-454d-a0c6-66b26b84628d", label: "Furniture Kayu" },
    {
      value: "0c57b52d-7e63-46c8-b779-c5697242b471",
      label: "Elektronik Rumah Tangga",
    },
    {
      value: "949c658e-b4d6-4ca2-8d2f-d69bf1594c4f",
      label: "Peralatan dan Kebutuhan Kantor",
    },
    {
      value: "38015672-0dab-4523-bda8-867893c95cfb",
      label: "Produk Makanan Kemasan",
    },
    {
      value: "bb93259b-eefb-4915-aff0-3d1f5a3ab241",
      label: "Produk Minuman Kemasan",
    },
  ];
  const beratMuatanOptions = [
    {
      label: "kg",
      value: "kg",
    },
    {
      label: "Liter",
      value: "liter",
    },
    {
      label: "Ton",
      value: "ton",
    },
  ];
  const dimensiMuatanOptions = [
    {
      label: "m",
      value: "m",
    },
    {
      label: "cm",
      value: "cm",
    },
  ];
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  const { formValues, setField, orderType, setOrderType } =
    useSewaArmadaStore();
  // State Management
  const [tipeMuatan, setTipeMuatan] = useState("");
  const [jenisMuatan, setJenisMuatan] = useState("");
  const [sertifikasiHalal, setSertifikasiHalal] = useState(false);
  const [namaMuatan, setNamaMuatan] = useState("");
  const [beratMuatan, setBeratMuatan] = useState("");
  const [dimensiP, setDimensiP] = useState("");
  const [dimensiL, setDimensiL] = useState("");
  const [dimensiT, setDimensiT] = useState("");

  const [tempInformasiMuatan, setTempInformasiMuatan] = useState({
    tipeMuatan: "",
    jenisMuatan: "",
    sertifikasiHalal: false,
    informasiMuatan: [
      {
        namaMuatan: null,
        beratMuatan: { berat: 0, unit: "kg" },
        dimensiMuatan: { panjang: 0, lebar: 0, tinggi: 0, unit: "m" },
      },
    ],
  });
  console.log("temo", tempInformasiMuatan, params);
  useEffect(() => {
    console.log("BABA2", params.namaMuatan, params.key);
    if (params.namaMuatan && params.key !== undefined) {
      console.log("BABA");
      setTempInformasiMuatan((prev) => ({
        ...prev,
        informasiMuatan: prev.informasiMuatan.map((muatan, i) => {
          console.log(
            "test",
            i === params.key
              ? { ...muatan, namaMuatan: params.namaMuatan }
              : muatan
          );
          return i === params.key
            ? { ...muatan, namaMuatan: params.namaMuatan }
            : muatan;
        }),
      }));
    }
  }, [JSON.stringify(params.namaMuatan), params.key]);

  useEffect(() => {
    const data = {
      tipeMuatan: formValues.tipeMuatan,
      jenisMuatan: formValues.jenisMuatan,
      sertifikasiHalal: formValues.sertifikasiHalal,
      informasiMuatan: [
        {
          namaMuatan: null,
          beratMuatan: { berat: 0, unit: "kg" },
          dimensiMuatan: { panjang: 0, lebar: 0, tinggi: 0, unit: "m" },
        },
      ],
    };
    setTempInformasiMuatan(data);
  }, [
    formValues.tipeMuatan,
    formValues.jenisMuatan,
    formValues.sertifikasiHalal,
  ]);

  // Handler Functions
  const handleTempInformasiMuatanChange = (field, value) => {
    setTempInformasiMuatan((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleAddMuatan = () => {
    setTempInformasiMuatan((prev) => ({
      ...prev,
      informasiMuatan: [
        ...prev.informasiMuatan,
        {
          namaMuatan: null,
          beratMuatan: { berat: 0, unit: "kg" },
          dimensiMuatan: { panjang: 0, lebar: 0, tinggi: 0, unit: "m" },
        },
      ],
    }));
  };

  const handleRemoveMuatan = (index) => {
    setTempInformasiMuatan((prev) => ({
      ...prev,
      informasiMuatan: prev.informasiMuatan.filter((_, i) => i !== index),
    }));
  };

  const handleChangeBeratMuatan = (index, key, value) => {
    setTempInformasiMuatan((prev) => ({
      ...prev,
      informasiMuatan: prev.informasiMuatan.map((muatan, i) => {
        if (key === "berat") {
          return i === index
            ? {
                ...muatan,
                beratMuatan: {
                  ...muatan.beratMuatan,
                  [key]: value.replace(/\D/g, ""),
                },
              }
            : muatan;
        }
        return i === index
          ? { ...muatan, beratMuatan: { ...muatan.beratMuatan, [key]: value } }
          : muatan;
      }),
    }));
  };

  const handleChangeDimensiMuatan = (index, key, value) => {
    setTempInformasiMuatan((prev) => ({
      ...prev,
      informasiMuatan: prev.informasiMuatan.map((muatan, i) => {
        if (key === "berat") {
          return i === index
            ? {
                ...muatan,
                dimensiMuatan: {
                  ...muatan.dimensiMuatan,
                  [key]: value.replace(/\D/g, ""),
                },
              }
            : muatan;
        }
        return i === index
          ? {
              ...muatan,
              dimensiMuatan: { ...muatan.dimensiMuatan, [key]: value },
            }
          : muatan;
      }),
    }));
  };

  const handleSaveInformasiMuatan = () => {
    // toast.error("Terdapat field yang kosong");
  };

  return (
    <FormResponsiveLayout
      title={{
        label: "Informasi Muatan",
      }}
    >
      <div className="mb-16 flex w-full flex-col gap-y-2 bg-neutral-200">
        {/* Section Tipe Muatan */}
        <div className="flex flex-col gap-y-4 bg-white px-4 py-5">
          {/* Header */}
          <FormLabelContainer>
            <FormLabel className="font-bold" title="Tipe Muatan" />
            <FormLabelInfoTooltip title="Tipe Muatan yang Akan Dikirimkan">
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
            </FormLabelInfoTooltip>
          </FormLabelContainer>

          {/* Radio Button Group */}
          <div className="flex flex-col gap-y-4">
            <RadioButton
              name="tipeMuatan"
              label="Bahan Mentah"
              checked={tempInformasiMuatan.tipeMuatan === "bahan-mentah"}
              onClick={(data) =>
                handleTempInformasiMuatanChange("tipeMuatan", data.value)
              }
              value="bahan-mentah"
            />
            <RadioButton
              name="tipeMuatan"
              label="Barang Setengah Jadi"
              checked={
                tempInformasiMuatan.tipeMuatan === "barang-setengah-jadi"
              }
              onClick={(data) =>
                handleTempInformasiMuatanChange("tipeMuatan", data.value)
              }
              value="barang-setengah-jadi"
            />
            <RadioButton
              name="tipeMuatan"
              label="Barang Jadi"
              checked={tempInformasiMuatan.tipeMuatan === "barang-jadi"}
              onClick={(data) =>
                handleTempInformasiMuatanChange("tipeMuatan", data.value)
              }
              value="barang-jadi"
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
          <FormLabelContainer>
            <FormLabel className="font-bold" title="Jenis Muatan" />
            <FormLabelInfoTooltip title="Informasi Jenis Muatan">
              {/* Main Content Area - Frame 42239 */}
              <ul style={{ marginLeft: "16px", listStyleType: "disc" }}>
                <li className="text-[14px] font-medium leading-[15.4px]">
                  <span className="font-bold">Padat :</span> Muatan yang
                  berbentuk solid.
                </li>

                <li className="text-[14px] font-medium leading-[15.4px]">
                  <span className="font-bold">Cair :</span> Muatan dalam bentuk
                  cairan, biasanya membutuhkan penanganan khusus.
                </li>

                <li className="text-[14px] font-medium leading-[15.4px]">
                  <span className="font-bold">Curah :</span> Muatan yang dikirim
                  secara massal, seperti biji-bijian atau pasir.
                </li>

                <li className="text-[14px] font-medium leading-[15.4px]">
                  <span className="font-bold">Kendaraan :</span> Muatan berupa
                  alat transportasi yang perlu diangkut.
                </li>

                <li className="text-[14px] font-medium leading-[15.4px]">
                  <span className="font-bold">Container :</span> Muatan yang
                  dikemas dalam suatu container.
                </li>
              </ul>

              {/* Bottom Text Area - Frame 42240 */}
              <span className="text-center text-[14px] font-medium leading-[15.4px] text-neutral-900">
                Pemilihan jenis muatan yang tepat akan membantu dalam
                pengelolaan dan pengiriman.
              </span>
            </FormLabelInfoTooltip>
          </FormLabelContainer>

          {/* Radio Button Group */}
          <div className="flex flex-col gap-y-4">
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
          <FormLabelContainer>
            <FormLabel
              className="font-bold"
              title="Sertifikasi Halal Logistik"
              required={false}
            />
            <FormLabelInfoTooltip title="Sertifikasi Halal Logistik">
              {/* Main Content Area - Frame 42239 */}
              <span className="text-[14px] font-medium leading-[15.4px] text-neutral-900">
                Pilih opsi ini jika pengiriman memerlukan pengelolaan rantai
                pasok yang memastikan produk tetap sesuai prinsip halal, mulai
                dari transportasi hingga penyimpanan
              </span>
            </FormLabelInfoTooltip>
          </FormLabelContainer>

          {/* Checkbox Section */}
          <div className="flex gap-1">
            <Checkbox
              checked={tempInformasiMuatan.sertifikasiHalal}
              onChange={handleTempInformasiMuatanChange}
              label="Centang opsi jika pengiriman memerlukan armada dengan sertifikat halal logistik"
              value="halal_certification"
              className="w-full"
            />
          </div>
        </div>

        {/* Section Input Data Muatan */}
        <div className="flex flex-col gap-6 bg-white px-4 py-5">
          {tempInformasiMuatan.informasiMuatan.map((item, key) => {
            const isLastItem =
              tempInformasiMuatan.informasiMuatan.length - 1 === key;
            const formattedBeratMuatan = item.beratMuatan.berat
              ? new Intl.NumberFormat("id-ID").format(item.beratMuatan.berat)
              : "";
            const selectedNamaMuatan = item.namaMuatan
              ? namaMuatanOptions.find(
                  (option) => option.value === item.namaMuatan.value
                )
              : null;
            console.log("nama", namaMuatanOptions, item.namaMuatan);
            const namaMuatanLabel = selectedNamaMuatan?.label ?? "Pilih Muatan";
            return (
              <Fragment key={key}>
                {/* Nama Muatan Field */}
                <div className="flex flex-col gap-y-4">
                  <FormLabelContainer>
                    <FormLabel className="font-semibold" title="Nama Muatan" />
                  </FormLabelContainer>
                  <button
                    className={
                      "flex h-8 items-center justify-between rounded-md border border-neutral-600 bg-neutral-50 px-3"
                    }
                    onClick={() => navigation.push("/CariNamaMuatan", { key })}
                  >
                    <div className="flex items-center gap-x-2">
                      <IconComponent src="/icons/muatan16.svg" />
                      <span className="text-[14px] font-semibold leading-[15.4px] text-neutral-600">
                        {namaMuatanLabel}
                      </span>
                    </div>
                    <IconComponent src="/icons/chevron-right.svg" />
                  </button>
                </div>

                {/* Berat Muatan Field */}
                <div className="flex flex-col gap-y-4">
                  <FormLabelContainer>
                    <FormLabel className="font-semibold" title="Berat Muatan" />
                    <FormLabelInfoTooltip title="Berat Muatan">
                      {/* Main Content Area - Frame 42239 */}
                      <span className="text-[14px] font-medium leading-[15.4px] text-neutral-900">
                        Masukkan berat keseluruhan atau total dari seluruh
                        muatan yang akan dikirim.
                      </span>
                    </FormLabelInfoTooltip>
                  </FormLabelContainer>

                  <div className="flex items-center gap-2.5">
                    <Input
                      placeholder="0"
                      className="flex-1"
                      value={formattedBeratMuatan}
                      onChange={(e) =>
                        handleChangeBeratMuatan(key, "berat", e.target.value)
                      }
                    />
                    <DropdownRadioBottomsheeet
                      className="w-[65px]"
                      title="Berat Muatan"
                      options={beratMuatanOptions}
                      value={item.beratMuatan.unit}
                      onChange={(value) =>
                        handleChangeBeratMuatan(key, "unit", value)
                      }
                    />
                  </div>
                </div>

                {/* Dimensi Muatan Field */}
                <div className="flex flex-col gap-y-4">
                  <FormLabelContainer>
                    <FormLabel
                      className="font-semibold"
                      title="Dimensi Muatan"
                      required={false}
                    />
                    <FormLabelInfoTooltip title="Dimensi Muatan yang Akan Dikirimkan">
                      {/* Main Content Area - Frame 42239 */}
                      <ul style={{ marginLeft: "16px", listStyleType: "disc" }}>
                        <li className="text-[14px] font-medium leading-[15.4px]">
                          <span className="font-bold">Panjang :</span> Ukuran
                          terpanjang dari muatan.
                        </li>

                        <li className="text-[14px] font-medium leading-[15.4px]">
                          <span className="font-bold">Lebar :</span> Ukuran
                          terlebar dari muatan.
                        </li>

                        <li className="text-[14px] font-medium leading-[15.4px]">
                          <span className="font-bold">Tinggi :</span> Ukuran
                          tertinggi dari muatan.
                        </li>
                      </ul>

                      {/* Bottom Text Area - Frame 42240 */}
                      <span className="text-center text-[14px] font-medium leading-[15.4px] text-neutral-900">
                        Pengisian dimensi yang tepat akan membantu dalam
                        pengelolaan dan pengiriman.
                      </span>
                    </FormLabelInfoTooltip>
                  </FormLabelContainer>

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

                    <DropdownRadioBottomsheeet
                      className="w-[65px]"
                      title="Dimensi Muatan"
                      options={dimensiMuatanOptions}
                      value={item.dimensiMuatan.unit}
                      onChange={(value) =>
                        handleChangeDimensiMuatan(key, "unit", value)
                      }
                    />
                  </div>
                </div>

                {/* Add and Remove Button */}
                <div
                  className={`flex justify-end ${isLastItem ? "" : "border-b border-b-neutral-400 pb-6"}`}
                >
                  <div className="flex items-center gap-x-5">
                    <button onClick={() => handleRemoveMuatan(key)}>
                      <IconComponent
                        src="/icons/min-square32.svg"
                        height={32}
                        width={32}
                      />
                    </button>
                    {isLastItem ? (
                      <button onClick={handleAddMuatan}>
                        <IconComponent
                          src="/icons/plus-square32.svg"
                          height={32}
                          width={32}
                        />
                      </button>
                    ) : null}
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
      <FooterOneButton
        buttonTitle="Simpan"
        onClick={handleSaveInformasiMuatan}
      />
    </FormResponsiveLayout>
  );
};

export default InformasiMuatanScreen;
