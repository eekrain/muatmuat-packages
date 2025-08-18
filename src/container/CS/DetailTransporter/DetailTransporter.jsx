import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import DetailTransporterHeader from "@/container/CS/DetailTransporter/DetailTransporterHeader/DetailTransporterHeader";

// import komponen detail ringkasan dan tabel armada nonaktif jika sudah ada
// import RingkasanTransporter from "@/container/CS/DetailTransporter/RingkasanTransporter/RingkasanTransporter";
// import ArmadaNonaktifTable from "@/container/CS/DetailTransporter/ArmadaNonaktifTable/ArmadaNonaktifTable";

const DetailTransporter = ({ breadcrumbData }) => {
  // TODO: fetch data transporter detail by params.transporterId
  const transporter = {
    name: "PT Kaltim Jaya Makmur",
    logoUrl: "/icons/company-placeholder.svg",
    // ...data lain
  };

  return (
    <div className="mx-6 max-w-[1200px] py-6">
      <BreadCrumb data={breadcrumbData} maxWidth={111} />
      <div className="my-4 flex gap-x-6">
        <div className="w-[340px] min-w-[320px]">
          <DetailTransporterHeader transporter={transporter} />
        </div>
      </div>
      <div className="flex h-[234px] w-full gap-4">
        <div className="flex w-[340px] flex-col gap-6 rounded-xl bg-white p-6 shadow-lg">
          <div className="flex gap-4">
            <div className="h-14 w-14 rounded-full border border-neutral-400"></div>
            <div className="flex h-14 w-[220px] flex-col justify-center">
              <p className="text-xs font-bold text-neutral-900">Tiba Surya</p>
              <p className="text-xs font-medium text-error-400">
                Admin Terdeteksi Sering Idle (5/7 Order){" "}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <p className="text-xs font-medium text-neutral-600">
              Admin terdeteksi melewatkan permintaan terlalu banyak dalam waktu
              1 jam terakhir, hubungi transporter agar admin lebih aktif dan
              responsif terhadap permintaan dari shipper.
            </p>
          </div>
          <div className="flex justify-between gap-3">
            <Button
              variant="muattrans-primary-secondary"
              className="h-8 w-[180px] rounded-[24px] px-4 text-[14px] font-semibold"
            >
              Hubungi
            </Button>
            <Button
              variant="muattrans-warning"
              className="h-8 w-[180px] rounded-[24px] px-4 text-[14px] font-semibold text-[#461B02]"
            >
              Selesaikan
            </Button>
          </div>
        </div>
        <div className="w-full">
          <p>/miji ni boos</p>
        </div>
      </div>
    </div>
  );
};

export default DetailTransporter;
