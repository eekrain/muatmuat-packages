import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
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
        <div className="w-[340px] rounded-xl bg-white p-6 shadow-lg">
          <p>pt kaltim</p>
        </div>
        <div className="w-full">
          <p>/miji ni boos</p>
        </div>
      </div>
    </div>
  );
};

export default DetailTransporter;
