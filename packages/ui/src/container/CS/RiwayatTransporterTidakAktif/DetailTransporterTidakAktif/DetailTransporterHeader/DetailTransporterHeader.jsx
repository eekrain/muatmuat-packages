import { useRouter } from "next/navigation";

import IconComponent from "@/components/IconComponent/IconComponent";

const DetailTransporterHeader = ({ transporter }) => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-3">
        <IconComponent
          onClick={() => router.back()}
          src="/icons/arrow-left24.svg"
          size="medium"
          className="text-primary-700"
        />
        <h1 className="text-xl font-bold text-neutral-900">
          Detail Transporter
        </h1>
      </div>
    </div>
  );
};

export default DetailTransporterHeader;
