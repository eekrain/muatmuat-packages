import { useRouter } from "next/navigation";

import { ChevronDown } from "lucide-react";

import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";

const TransporterTableActions = ({ row, onOpenModal, onOpenHubungiModal }) => {
  const router = useRouter();

  const renderActionItems = (row) => {
    switch (row.status) {
      case "ACTIVE":
        return (
          <>
            <SimpleDropdownItem
              onClick={() => router.push(`/user/transporter/${row.id}/detail`)}
            >
              Detail
            </SimpleDropdownItem>
            <SimpleDropdownItem onClick={() => onOpenHubungiModal(row)}>
              Hubungi
            </SimpleDropdownItem>
            <SimpleDropdownItem
              className={"text-red-500"}
              onClick={() => onOpenModal("deactivate", row)}
            >
              Non Aktifkan
            </SimpleDropdownItem>
          </>
        );
      case "NON_ACTIVE":
        return (
          <>
            <SimpleDropdownItem
              onClick={() => router.push(`/user/transporter/${row.id}/detail`)}
            >
              Detail
            </SimpleDropdownItem>
            <SimpleDropdownItem onClick={() => onOpenHubungiModal(row)}>
              Hubungi
            </SimpleDropdownItem>
            <SimpleDropdownItem onClick={() => onOpenModal("activate", row)}>
              Aktifkan
            </SimpleDropdownItem>
          </>
        );
      case "VERIFICATION_PENDING":
        return (
          <>
            <SimpleDropdownItem
              onClick={() => router.push(`/user/transporter/${row.id}/detail`)}
            >
              Detail
            </SimpleDropdownItem>
            <SimpleDropdownItem onClick={() => onOpenHubungiModal(row)}>
              Hubungi
            </SimpleDropdownItem>
          </>
        );
      case "VERIFICATION_REJECTED":
        return (
          <>
            <SimpleDropdownItem onClick={() => onOpenModal("resend", row)}>
              Kirim Verifikasi Ulang
            </SimpleDropdownItem>
            <SimpleDropdownItem
              onClick={() => router.push(`/user/transporter/${row.id}/detail`)}
            >
              Detail
            </SimpleDropdownItem>
            <SimpleDropdownItem onClick={() => onOpenHubungiModal(row)}>
              Hubungi
            </SimpleDropdownItem>
            <SimpleDropdownItem
              className={"text-red-500"}
              onClick={() => onOpenModal("delete", row)}
            >
              Hapus
            </SimpleDropdownItem>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SimpleDropdown>
      <SimpleDropdownTrigger asChild>
        <button className="flex h-8 flex-row items-center justify-between gap-2 rounded-md border border-neutral-400 bg-white px-3 py-2 shadow-sm transition-colors duration-150 hover:border-primary-700 hover:bg-gray-50 focus:outline-none">
          <span className="text-xs font-medium leading-tight text-black">
            Aksi
          </span>
          <ChevronDown className="h-3 w-3 text-neutral-700" />
        </button>
      </SimpleDropdownTrigger>
      <SimpleDropdownContent className="w-[180px]" align="end">
        {renderActionItems(row)}
      </SimpleDropdownContent>
    </SimpleDropdown>
  );
};

export default TransporterTableActions;
