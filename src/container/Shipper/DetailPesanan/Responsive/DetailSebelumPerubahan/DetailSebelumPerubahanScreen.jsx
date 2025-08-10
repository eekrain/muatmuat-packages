import IconComponent from "@/components/IconComponent/IconComponent";
import ResponsiveSection from "@/components/Section/ResponsiveSection";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";

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
        icon: "/icons/lokasi20.svg",
        value:
          "Jl. Ngagel Jaya No.128, Ngagel, Kec. Wonokromo, Surabaya, Jawa Timur 60246",
      },
      {
        icon: "/icons/topik-amandemen20.svg",
        value:
          "Sebelah bakso presiden, gedung warna kuning, pagar warna hitam, ada mobil grandmax",
      },
      {
        icon: "/icons/profile20.svg",
        value: "Adam Sugeng Probokusumo",
      },
      {
        icon: "/icons/call20.svg",
        value: "0812-3193-1031",
      },
    ],
    bongkar: [
      {
        icon: "/icons/lokasi20.svg",
        value:
          "Jl. S. Supriadi No.74, Sukun, Kec. Sukun, Kota Malang, Jawa Timur 65148",
      },
      {
        icon: "/icons/topik-amandemen20.svg",
        value: "Pagar hijau lumut",
      },
      {
        icon: "/icons/profile20.svg",
        value: "Humam Husairi",
      },
      {
        icon: "/icons/call20.svg",
        value: "0812-3773-9909",
      },
    ],
  };
  return (
    <ResponsiveSection
      appearance={{ titleClassname: "text-base font-bold" }}
      title={headers[type]}
    >
      <div className="flex flex-col gap-y-4">
        <h3 className="text-sm font-semibold leading-[1.1]">{titles[type]}</h3>
        {locations[type].map((item, key) => (
          <div className="flex items-center gap-x-2" key={key}>
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
