import { useRouter } from "next/navigation";

import IconComponent from "@/components/IconComponent/IconComponent";

import ButtonDownloadDO from "../LacakArmada/components/ButtonDownloadDO";

const DetailPesananHeader = ({ activeTab }) => {
  const router = useRouter();
  return (
    <div className="flex h-6 items-center justify-between">
      <div className="flex items-center gap-x-3">
        <IconComponent
          onClick={() => router.back()}
          src="/icons/arrow-left24.svg"
          size="medium"
          className="text-primary-700"
        />
        <h1 className="text-xl font-bold text-neutral-900">Detail Pesanan</h1>
      </div>
      {activeTab === "lacak-armada" && <ButtonDownloadDO />}
    </div>
  );
};

export default DetailPesananHeader;
