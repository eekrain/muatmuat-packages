import IconComponent from "@/components/IconComponent/IconComponent";
import ResponsiveSection from "@/components/Section/ResponsiveSection";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { cn } from "@/lib/utils";

const LoadTimeSection = () => {
  return (
    <ResponsiveSection
      appearance={{ titleClassname: "text-base font-bold" }}
      title="Waktu Muat"
    >
      <span className="text-xs font-medium leading-[1.1]">
        06 Jun 2024 11:00 WIB s/d 06 Jun 2024 12:00 WIB
      </span>
    </ResponsiveSection>
  );
};

const LocationPicDetailSection = ({ type }) => {
  const headers = {
    muat: "Detail PIC Lokasi Muat",
    bongkar: "Detail PIC Lokasi Bongkar",
  };
  const titles = {
    muat: "Lokasi Muat",
    bongkar: "Lokasi Bongkar",
  };
  const locations = {
    muat: [
      {
        address:
          "Jl. Ngagel No.128, Ngagel, Kec. Wonokromo, Surabaya, Jawa Timur 60246",
        details:
          "Sebelah bakso presiden, gedung warna kuning, pagar warna hitam, ada mobil grandmax",
        picName: "Siti Nurmala",
        picPhone: "0813-9860-0000",
      },
      {
        address:
          "Jl. Ambengan No.51, Pacar Keling, Kec. Genteng, Surabaya, Jawa Timur 60272",
        details: "gedung warna kuning, pagar warna hitam",
        picName: "Sari",
        picPhone: "0812-8874-0230",
      },
      // {
      //   address:
      //     "Jl. Ambengan No.51, Pacar Keling, Kec. Genteng, Surabaya, Jawa Timur 60272",
      //   details: "gedung warna kuning, pagar warna hitam",
      //   picName: "Sari",
      //   picPhone: "0812-8874-0230",
      // },
    ],
    bongkar: [
      {
        address:
          "Jl. Raya Darmo No.23, Keputran, Kec. Tegalsari, Surabaya, Jawa Timur 60265",
        details: "gedung warna putih, sebelah bank BCA, ada pos satpam",
        picName: "Budi Santoso",
        picPhone: "0856-4321-9876",
      },
      // {
      //   address:
      //     "Jl. Pemuda No.15, Embong Kaliasin, Kec. Genteng, Surabaya, Jawa Timur 60271",
      //   details: "gedung perkantoran lantai 3, lobby warna abu-abu",
      //   picName: "Linda Wijaya",
      //   picPhone: "0878-5544-3322",
      // },
    ],
  };
  return (
    <ResponsiveSection
      appearance={{ titleClassname: "text-base font-bold" }}
      title={headers[type]}
    >
      {locations[type].map((location, key) => {
        const locationItems = [
          {
            icon: "/icons/lokasi20.svg",
            value: location.address,
          },
          {
            icon: "/icons/topik-amandemen20.svg",
            value: location.details,
          },
          {
            icon: "/icons/profile20.svg",
            value: location.picName,
          },
          {
            icon: "/icons/call20.svg",
            value: location.picPhone,
          },
        ];
        return (
          <div
            className={cn(
              "flex flex-col gap-y-4",
              locations[type].length - 1 === key
                ? ""
                : "border-b border-neutral-400 pb-6"
            )}
            key={key}
          >
            <h3 className="text-sm font-semibold leading-[1.1]">
              {titles[type]}
            </h3>
            {locationItems.map((item, itemKey) => (
              <div className={cn("flex items-center gap-x-2")} key={itemKey}>
                <div className="flex size-5 items-center">
                  <IconComponent
                    className="text-muat-trans-secondary-900"
                    src={item.icon}
                    width={20}
                    height={20}
                  />
                </div>
                <span className="text-xs font-medium leading-[1.1]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        );
      })}
    </ResponsiveSection>
  );
};

const DetailSebelumPerubahanScreen = () => {
  return (
    <FormResponsiveLayout
      title={{
        label: "Detail Sebelum Perubahan",
      }}
    >
      <div className="flex flex-col gap-y-2 bg-neutral-200">
        <LoadTimeSection />
        <LocationPicDetailSection type="muat" />
        <LocationPicDetailSection type="bongkar" />
      </div>
    </FormResponsiveLayout>
  );
};

export default DetailSebelumPerubahanScreen;
