import { useEffect } from "react";

import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import SearchBarResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/SearchBarResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { searchFilter } from "@/lib/utils/filter";
import { useInformasiMuatanStore } from "@/store/Shipper/forms/informasiMuatanStore";
import { useResponsiveSearchStore } from "@/store/Shipper/zustand/responsiveSearchStore";

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

const CariNamaMuatanScreen = () => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  const { searchValue, setSearchValue } = useResponsiveSearchStore();
  const { updateInformasiMuatan } = useInformasiMuatanStore();

  useEffect(() => {
    setSearchValue("");
  }, []);

  const handleSelectNamaMuatan = (namaMuatan) => {
    updateInformasiMuatan(params.index, "namaMuatan", namaMuatan);
    navigation.pop();
  };

  const handleTambahNamaMuatan = () => {
    alert("not implemented");
  };

  const filtereNamaMuatanOptions = searchFilter(
    searchValue,
    namaMuatanOptions,
    "label"
  );

  return (
    <SearchBarResponsiveLayout placeholder="Cari Nama Muatan">
      {filtereNamaMuatanOptions.length > 0 ? (
        <div className="flex min-h-[calc(100vh_-_126px)] flex-col gap-y-4 bg-neutral-100 px-4 py-5">
          {filtereNamaMuatanOptions.map((item, key) => {
            const isLastItem = filtereNamaMuatanOptions.length - 1 === key;
            return (
              <button
                className={`${isLastItem ? "" : "border-b border-b-neutral-400 pb-4"} flex`}
                key={key}
                onClick={() => handleSelectNamaMuatan(item)}
              >
                <span className="text-sm font-semibold leading-[15.4px] text-neutral-900">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-[calc(100vh_-_126px)] items-center justify-center">
          <DataNotFound
            className="gap-y-3.5"
            textClass="leading-[14px] !text-sm"
            title={
              <>
                Keyword
                <br />
                Tidak Ditemukan
              </>
            }
            width={127}
            height={109}
          />
        </div>
      )}

      <ResponsiveFooter className="flex gap-3">
        <Button
          variant="muatparts-primary"
          className="flex-1"
          onClick={handleTambahNamaMuatan}
          type="button"
        >
          Tambah Nama Muatan
        </Button>
      </ResponsiveFooter>
    </SearchBarResponsiveLayout>
  );
};

export default CariNamaMuatanScreen;
