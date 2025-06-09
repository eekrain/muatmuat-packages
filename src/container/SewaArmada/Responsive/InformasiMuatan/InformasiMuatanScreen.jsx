"use client";

import { Fragment, useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import DropdownRadioBottomsheeet from "@/components/Dropdown/DropdownRadioBottomsheeet";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoBottomsheet } from "@/components/Form/InfoBottomsheet";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import RadioButton from "@/components/Radio/RadioButton";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { useSewaArmadaStore } from "@/store/forms/sewaArmadaStore";

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
      <div className="grid grid-cols-1 gap-2">
        {/* Section Tipe Muatan */}
        <FormContainer>
          {/* Header */}
          <FormLabel
            required
            tooltip={
              <InfoBottomsheet title="Tipe Muatan yang Akan Dikirimkan">
                {/* Usahakan content info di isi tanpa menggunakan custom className / style sama sekali */}
                {/* Tag yang di pake ngikutin di globals.scss di class .info-tooltip-content dan .info-bottomsheet-content, sekarang ada ul li b p (biar pendek) */}
                {/* Supaya content yang ada di dalam bottomsheet ini bisa di simpan di module multibahasa, artinya konten ini dinamis */}
                {/* Nantinya bakal di render pake dangerouslySetInnerHTML={{ __html: children }} di komponen InfoBottomsheet / InfoTooltip */}
                <ul>
                  <li>
                    <b>Bahan Mentah :</b> Material atau komponen yang belum
                    diproses.
                  </li>
                  <li>
                    <b>Barang Setengah Jadi :</b> Produk yang telah mengalami
                    beberapa tahap proses tapi belum selesai.
                  </li>
                  <li>
                    <b>Barang Jadi :</b> Produk akhir yang siap untuk digunakan
                    atau dijual.
                  </li>
                  <li>
                    <b>Lainnya :</b> Bahan / barang yang tidak sesuai dengan
                    jenis diatas, namun tetap memiliki fungsi dalam proses
                    produksi atau distribusi.
                  </li>
                </ul>
                <p>
                  Pemilihan tipe muatan yang tepat akan membantu dalam
                  pengelolaan dan pengiriman.
                </p>
              </InfoBottomsheet>
            }
          >
            Tipe Muatan
          </FormLabel>

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
        </FormContainer>

        {/* Section Jenis Muatan */}
        <FormContainer>
          <FormLabel
            required
            tooltip={
              <InfoBottomsheet title="Tipe Muatan yang Akan Dikirimkan">
                <ul>
                  <li>
                    <b>Padat:</b> Muatan yang berbentuk solid.
                  </li>
                  <li>
                    <b>Cair:</b> Muatan dalam bentuk cairan, biasanya
                    membutuhkan penanganan khusus.
                  </li>
                  <li>
                    <b>Curah:</b> Muatan yang dikirim secara massal, seperti
                    biji-bijian atau pasir.
                  </li>
                  <li>
                    <b>Kendaraan:</b> Muatan berupa alat transportasi yang perlu
                    diangkut.
                  </li>
                  <li>
                    <b>Container:</b> Muatan yang dikemas dalam suatu container.
                  </li>
                </ul>
                <p>
                  Pemilihan jenis muatan yang tepat akan membantu dalam
                  pengelolaan dan pengiriman.
                </p>
              </InfoBottomsheet>
            }
          >
            Tipe Muatan
          </FormLabel>

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
        </FormContainer>

        {/* Section Sertifikasi Halal Logistik */}
        <FormContainer>
          <FormLabel
            required
            tooltip={
              <InfoBottomsheet title="Tipe Muatan yang Akan Dikirimkan">
                <p>
                  Pilih opsi ini jika pengiriman memerlukan pengelolaan rantai
                  pasok yang memastikan produk tetap sesuai prinsip halal, mulai
                  dari transportasi hingga penyimpanan
                </p>
              </InfoBottomsheet>
            }
          >
            Sertifikasi Halal Logistik
          </FormLabel>

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
        </FormContainer>

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
                <FormContainer className="p-0">
                  <FormLabel>Nama Muatan</FormLabel>
                  <Input
                    type="text"
                    placeholder="Masukkan Muatan"
                    name="nama_muatan"
                    disabled={true}
                    icon={{
                      left: "/icons/search.svg",
                      right: "/icons/chevron-down.svg",
                    }}
                    className="w-full"
                    appearance={{
                      inputClassName: "bg-neutral-200 text-neutral-600",
                    }}
                    value={namaMuatan}
                    onChange={(e) => setNamaMuatan(e.target.value)}
                  />
                </FormContainer>

                {/* Berat Muatan Field */}
                <FormContainer className="p-0">
                  <FormLabel
                    required
                    tooltip={
                      <InfoBottomsheet title="Tipe Muatan yang Akan Dikirimkan">
                        <p>
                          Pilih opsi ini jika pengiriman memerlukan pengelolaan
                          rantai pasok yang memastikan produk tetap sesuai
                          prinsip halal, mulai dari transportasi hingga
                          penyimpanan
                        </p>
                      </InfoBottomsheet>
                    }
                  >
                    Berat Muatan
                  </FormLabel>

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
                </FormContainer>

                {/* Dimensi Muatan Field */}
                <FormContainer className="p-0">
                  <FormLabel
                    tooltip={
                      <InfoBottomsheet title="Tipe Muatan yang Akan Dikirimkan">
                        <ul>
                          <li>
                            <b>Panjang :</b> Ukuran terpanjang dari muatan.
                          </li>
                          <li>
                            <b>Lebar :</b> Ukuran terlebar dari muatan.
                          </li>
                          <li>
                            <b>Tinggi :</b> Ukuran tertinggi dari muatan
                          </li>
                        </ul>
                        <p>
                          Pengisian dimensi yang tepat akan membantu dalam
                          pengelolaan dan pengiriman.
                        </p>
                      </InfoBottomsheet>
                    }
                  >
                    Dimensi Muatan
                  </FormLabel>

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
                </FormContainer>

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

      <ResponsiveFooter className="flex gap-3">
        <Button
          variant="muatparts-primary"
          className="flex-1"
          onClick={hanldeSelectNamaMuatan}
          type="button"
        >
          Tambah Nama Muatan
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};

export default InformasiMuatanScreen;
