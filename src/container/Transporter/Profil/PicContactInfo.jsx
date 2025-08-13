import { Alert } from "@/components/Alert/Alert";
import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";

// --- Mock Data for PIC Contacts ---
const picData = [
  {
    id: 1,
    name: "Tralalero Tralala",
    role: "Staff Marketing",
    phone: "081234561111",
  },
  {
    id: 2,
    name: "Bombardino Crocodilo",
    role: "Staff Marketing",
    phone: "081234562222",
  },
  {
    id: 3,
    name: "Tung Sahur",
    role: "Staff Customer Service",
    phone: "081234563333",
  },
];

/**
 * Renders a single striped row for a PIC contact in a table-like format.
 * @param {object} props
 * @param {number} props.index - The index of the PIC for numbering.
 * @param {object} props.pic - The PIC data object.
 * @param {boolean} props.isStriped - Determines if the row has a background color.
 */
const PicContactRow = ({ index, pic, isStriped }) => (
  <div
    className={`grid grid-cols-[1fr,2fr,2fr,2fr,auto] items-center gap-x-4 px-9 py-4 ${
      isStriped ? "bg-neutral-100" : "bg-white"
    }`}
  >
    {/* PIC Number and Icon */}
    <div className="flex items-center gap-3 text-sm font-medium text-neutral-600">
      <IconComponent
        src="/icons/user16.svg"
        alt="PIC Icon"
        width={24}
        height={24}
      />
      <span>PIC {index + 1}</span>
    </div>

    {/* PIC Details */}
    <span className="text-sm font-semibold text-neutral-900">{pic.name}</span>
    <span className="text-sm font-medium text-neutral-600">{pic.role}</span>
    <span className="text-sm font-medium text-neutral-900">{pic.phone}</span>

    {/* Action Icons */}
    <div className="me-7 flex items-center justify-end gap-4">
      <button
        aria-label={`Copy phone number for ${pic.name}`}
        className="text-primary-700 transition-opacity hover:opacity-80"
      >
        <IconComponent
          src="/icons/salin.svg"
          alt="Copy Icon"
          width={20}
          height={20}
        />
      </button>
      <button
        aria-label={`Contact ${pic.name} on WhatsApp`}
        className="text-primary-700 transition-opacity hover:opacity-80"
      >
        <IconComponent
          src="/icons/verify-whatsapp.svg"
          alt="WhatsApp Icon"
          width={20}
          height={20}
        />
      </button>
    </div>
  </div>
);

/**
 * A card component displaying a list of PIC Transporter contacts in a structured table.
 */
const PicContactInfo = () => {
  return (
    <Card className="max-h-fit border-neutral-400 bg-white p-0">
      {/* Header Section */}
      <div className="flex items-start justify-between p-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-neutral-900">
            Data Kontak PIC Transporter
          </h2>
          <Alert
            variant="warning"
            className="flex items-center gap-2 bg-transparent p-0"
          >
            <IconComponent
              src="/icons/megaphone.svg"
              alt="Information Icon"
              width={16}
              height={16}
              className="text-yellow-500"
            />
            <span className="text-xs font-medium text-neutral-800">
              Data PIC Transporter akan ditampilkan pada profilmu di pengguna
              lainnya untuk menghubungi kamu
            </span>
          </Alert>
        </div>
        <Button variant="muattrans-primary" className="flex-shrink-0 px-8 py-2">
          Ubah Data
        </Button>
      </div>

      {/* Contacts Table Section */}
      <div className="mt-2 border-t border-neutral-200">
        {picData.map((pic, index) => (
          <PicContactRow
            key={pic.id}
            index={index}
            pic={pic}
            isStriped={index % 2 === 0} // Apply striping to odd rows (1, 3, 5...)
          />
        ))}
      </div>
    </Card>
  );
};

export default PicContactInfo;
