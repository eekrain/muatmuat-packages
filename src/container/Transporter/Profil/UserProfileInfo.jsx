// Assuming IconComponent is available
import Link from "next/link";

import IconComponent from "@/components/IconComponent/IconComponent";

/**
 * A reusable component to display a labeled piece of data with an edit link.
 * @param {object} props
 * @param {string} props.label - The label for the field (e.g., "Email").
 * @param {string} props.value - The value to display.
 * @param {string} [props.href="#"] - The link for the edit action.
 */
const EditableField = ({ label, value, href = "#" }) => (
  <div className="flex flex-col gap-1">
    <span className="mb-3 text-xs font-medium text-neutral-600">{label}</span>
    <div className="flex items-center gap-3">
      <span className="text-xs text-neutral-900">{value}</span>
      <Link href={href}>
        <div className="flex cursor-pointer items-center gap-1 text-sm text-primary-700 hover:text-primary-800">
          Ubah
          <IconComponent
            src="/icons/pencil-outline.svg" // Using an appropriate icon from the project
            alt="Edit"
            width={16}
            height={16}
          />
        </div>
      </Link>
    </div>
  </div>
);

/**
 * Displays user profile information including avatar, contact details, and password.
 */
const UserProfileInfo = ({ userProfile }) => {
  // Mock data to populate the component
  const userData = {
    initials: "DT",
    whatsapp: "0823212345840", // Example data
    email: "public.relation.mrsby@midtownight.com", // Example data
  };

  return (
    <>
      <div className="flex items-center gap-8 p-5 align-middle">
        {/* Left Section: Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-700">
            <span className="text-4xl font-bold text-white">
              {userData.initials}
            </span>
          </div>
          <Link href="#">
            <span className="cursor-pointer text-sm font-semibold text-primary-700 hover:underline">
              Ubah Foto
            </span>
          </Link>
        </div>

        {/* Right Section: User Details */}
        <div className="">
          <div className="flex flex-col gap-3">
            <h2 className="mb-1 text-xl font-bold text-neutral-900">
              {userProfile.name}
            </h2>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-x-10 gap-y-6 pt-2">
            <EditableField label="No. Whatsapp" value={userData.whatsapp} />
            <EditableField label="Email" value={userData.email} />
            <EditableField label="Password" value="********" />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileInfo;
