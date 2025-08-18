import { Alert } from "@/components/Alert/Alert";
import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { MapContainer } from "@/components/MapContainer/MapContainer";

// --- Mock Data ---
const companyData = {
  registrant: {
    name: "Fernando Torres",
    title: "Chief Marketing Officer",
    whatsapp: "081234567910",
    email: "torres.marketing@mail.com",
  },
  company: {
    logoUrl: "https://picsum.photos/100?random=1",
    name: "PT Kalimantan Timur Jaya Sentosa Makmur Sejahtera Internasional",
    entity: "PT/ PT Tbk",
    phone: "0812-0987-6543",
  },
  location: {
    fullAddress:
      "Jl. Anggrek No. 123, RT 05 RW 09, Kel. Mekarsari, Kec. Cimanggis, Kota Depok, Provinsi Jawa Barat, Kode Pos 16452, Dekat Warung Bu Tini, belakang minimarket, sebelah bengkel motor, sekitar 200 meter dari halte Transdepok Mekarsari.",
    shortAddress:
      "Jl. Anggrek No. 123, RT 05 RW 09, Kel. Mekarsari, Kec. Cimanggis, Kota Depok, Provinsi Jawa Barat, Kode Pos 16452",
    district: "Cimanggis",
    city: "Depok",
    province: "Jawa Barat",
    postalCode: "16452",
    pinLocation: (
      <dd className="relative col-span-2 h-[180px] w-full overflow-hidden rounded-lg">
        <MapContainer
          coordinates={{
            latitude: -6.3937,
            longitude: 106.8286,
          }}
          className="h-full w-full rounded-lg"
          viewOnly={true}
          textLabel="Lokasi Perusahaan"
          draggableMarker={false}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Button variant="muattrans-primary">Lihat Lokasi</Button>
        </div>
      </dd>
    ),
    // mapImageUrl: "https://picsum.photos/400/200?random=2",
  },
  bank: {
    name: "Bank Central Asia (BCA)",
    accountNumber: "21454322",
    accountHolder: "Fernando Torres",
  },
};

// --- Reusable Detail Row Component ---
const DetailRow = ({
  label,
  value,
  valueClassName = "text-neutral-900",
  isStriped = false,
  isHeader = false,
}) => {
  if (isHeader) {
    return (
      <div className="px-4 py-4">
        <h3 className="text-base font-bold text-neutral-900">{label}</h3>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-3 gap-4 px-4 py-4 ${
        isStriped ? "bg-neutral-100" : "bg-white"
      }`}
    >
      <dt className="text-sm font-medium text-neutral-600">{label}</dt>
      <dd className={`col-span-2 text-sm font-semibold ${valueClassName}`}>
        {value}
      </dd>
    </div>
  );
};

// --- Main Page Component ---
const CompanyProfileInfo = () => {
  // Create a single array of all rows for continuous striping
  const allRows = [
    // Header and Informasi Pendaftar
    { type: "header", label: "Informasi Pendaftar" },
    {
      type: "data",
      label: "Nama Lengkap Pendaftar",
      value: companyData.registrant.name,
    },
    {
      type: "data",
      label: "Jabatan Pendaftar",
      value: companyData.registrant.title,
    },
    {
      type: "data",
      label: "No. Whatsapp Pendaftar",
      value: companyData.registrant.whatsapp,
    },
    {
      type: "data",
      label: "Email Pendaftar",
      value: companyData.registrant.email,
    },

    // Header and Informasi Perusahaan
    { type: "header", label: "Informasi Perusahaan" },
    {
      type: "data",
      label: "Logo Perusahaan",
      value: (
        <ImageComponent
          src={companyData.company.logoUrl}
          alt="Company Logo"
          width={72}
          height={72}
          className="rounded-full object-cover"
        />
      ),
    },
    { type: "data", label: "Nama Perusahaan", value: companyData.company.name },
    { type: "data", label: "Badan Usaha", value: companyData.company.entity },
    {
      type: "data",
      label: "No. Telepon Perusahaan",
      value: companyData.company.phone,
    },

    // Header and Lokasi Perusahaan
    { type: "header", label: "Lokasi Perusahaan" },
    { type: "data", label: "Alamat", value: companyData.location.fullAddress },
    { type: "data", label: "Lokasi", value: companyData.location.shortAddress },
    { type: "data", label: "Kecamatan", value: companyData.location.district },
    { type: "data", label: "Kota", value: companyData.location.city },
    { type: "data", label: "Provinsi", value: companyData.location.province },
    { type: "data", label: "Kode Pos", value: companyData.location.postalCode },
    {
      type: "data",
      label: "Titik Lokasi",
      value: companyData.location.pinLocation,
    },

    // Header and Informasi Rekening
    { type: "header", label: "Informasi Rekening Perusahaan" },
    { type: "data", label: "Nama Bank", value: companyData.bank.name },
    {
      type: "data",
      label: "Badan Usaha",
      value: companyData.bank.accountNumber,
    },
    {
      type: "data",
      label: "Nama Pemilik Rekening",
      value: companyData.bank.accountHolder,
    },
  ];

  return (
    <Card className="max-h-fit border-neutral-300 bg-white p-0">
      <div className="px-6 py-4">
        <h2 className="mb-1 text-xl font-bold text-neutral-900">
          Data Perusahaan
        </h2>

        <Alert
          variant="warning"
          className="-ms-4 mt-4 flex items-center bg-white"
        >
          <span className="text-sm font-medium text-neutral-800">
            Data Perusahaan akan ditampilkan pada profilmu untuk pengguna
            lainnya.
          </span>
        </Alert>
      </div>

      <div className="mt-2">
        {allRows.map((row, index) => {
          if (row.type === "header") {
            return (
              <DetailRow
                key={`header-${index}`}
                label={row.label}
                isHeader={true}
              />
            );
          }
          const dataRowIndex =
            allRows.slice(0, index + 1).filter((r) => r.type === "data")
              .length - 1;
          const isStriped = dataRowIndex % 2 === 0;
          return (
            <DetailRow
              key={`data-${index}`}
              label={row.label}
              value={row.value}
              isStriped={isStriped}
            />
          );
        })}
      </div>
    </Card>
  );
};

export default CompanyProfileInfo;
