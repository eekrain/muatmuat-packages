import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import PageTitle from "@/components/PageTitle/PageTitle";

import DriverRatingTable from "./components/DriverRatingTable";

const RatingDriverPage = () => {
  const breadcrumbData = [
    { name: "Dashboard Real-time", href: "/dashboard/real-time" },
    { name: "Rating Driver Keseluruhan" },
  ];

  return (
    <div className="space-y-4 py-8">
      <BreadCrumb data={breadcrumbData} />
      <div className="flex w-full items-center justify-between">
        <PageTitle className={"!leading-0 mb-0 self-center"} withBack={true}>
          Rating Driver Keseluruhan
        </PageTitle>
        <Button
          iconLeft="/icons/download16.svg"
          variant="muattrans-primary"
          className="px-6 py-2"
        >
          <IconComponent src="/icons/download.svg" className="mr-2" />
          Unduh
        </Button>
      </div>
      <DriverRatingTable />
    </div>
  );
};

export default RatingDriverPage;
