import BadgeStatus from "@/components/Badge/BadgeStatus";
import Table from "@/components/Table/Table";
import { useTranslation } from "@/hooks/use-translation";
import { TransporterStatus } from "@/lib/constants/CS/user/transporters-cs.enum";
import { formatPhoneNumberWithPrefix } from "@/lib/utils/phoneFormatter";

import TransporterTableActions from "./TransporterTableActions";

const TransporterTable = ({
  transportersData,
  isLoading,
  emptyComponent,
  onSort,
  sortConfig,
  onOpenModal,
  onOpenHubungiModal,
}) => {
  const { t } = useTranslation();
  const getStatusBadge = (status) => {
    let variant = "success";
    if (status === TransporterStatus.NON_ACTIVE) {
      variant = "error";
    } else if (status === TransporterStatus.VERIFICATION_PENDING) {
      variant = "warning";
    } else if (status === TransporterStatus.VERIFICATION_REJECTED) {
      variant = "neutral";
    }
    return (
      <BadgeStatus variant={variant}>{getStatusLabel(status)}</BadgeStatus>
    );
  };
  const getStatusLabel = (status) => {
    switch (status) {
      case TransporterStatus.ACTIVE:
        return t("TransporterTable.statusActive", {}, "Aktif");
      case TransporterStatus.NON_ACTIVE:
        return t("TransporterTable.statusNonActive", {}, "Non Aktif");
      case TransporterStatus.VERIFICATION_PENDING:
        return t(
          "TransporterTable.statusVerificationPending",
          {},
          "Menunggu Verifikasi"
        );
      case TransporterStatus.VERIFICATION_REJECTED:
        return t(
          "TransporterTable.statusVerificationRejected",
          {},
          "Verifikasi Ditolak"
        );
    }
  };

  const columns = [
    {
      key: "name",
      header: t("TransporterTable.headerCompanyName", {}, "Nama Perusahaan"),
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-5">
          <div className="relative flex aspect-square h-14 w-14 items-center justify-center rounded-md border border-neutral-400 bg-white object-contain p-px">
            <img
              src={row.companyLogo || "/img/jnt.png"}
              alt="logo"
              className="rounded-md object-contain"
              onError={(e) => {
                e.target.src = "/img/jnt.png"; // Fallback image
              }}
            />
          </div>
          <div className="space-y-1">
            <div className="line-clamp-1 text-xs font-bold">
              {row.companyName}
            </div>
            <div className="text-xxs font-medium">{row.companyEmail}</div>
          </div>
        </div>
      ),
    },
    {
      key: "pic",
      header: t("TransporterTable.headerCompanyPIC", {}, "PIC Perusahaan"),
      sortable: false,
      width: "170px",
      render: (row) => (
        <div className="space-y-1">
          <div className="text-xxs font-semibold">{row.picName}</div>
          <div className="text-xxs font-medium">
            {t("TransporterTable.labelPhoneNumber", {}, "No HP")} :{" "}
            {formatPhoneNumberWithPrefix(row.picPhone)}
          </div>
        </div>
      ),
    },
    {
      key: "address",
      header: t(
        "TransporterTable.headerCompanyAddress",
        {},
        "Alamat Perusahaan"
      ),
      sortable: false,
      render: (row) => (
        <div className="text-xxs font-medium">{row.address}</div>
      ),
    },
    {
      key: "fleet_count",
      header: t("TransporterTable.headerFleetCount", {}, "Jumlah Armada"),
      width: "170px",
      sortable: true,
      render: (row) => (
        <div className="text-xxs font-medium">
          {row.fleetCount > 0
            ? t(
                "TransporterTable.fleetCountUnit",
                { count: row.fleetCount },
                `${row.fleetCount} Armada`
              )
            : t("TransporterTable.fleetCountEmpty", {}, "Belum Ada")}
        </div>
      ),
    },
    {
      key: "status",
      header: t("TransporterTable.headerStatus", {}, "Status"),
      width: "190px",
      sortable: true,
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "action",
      header: "",
      width: "120px",
      sortable: false,
      render: (row) => (
        <TransporterTableActions
          row={row}
          onOpenModal={onOpenModal}
          onOpenHubungiModal={onOpenHubungiModal}
        />
      ),
    },
  ];

  return (
    <Table
      data={transportersData}
      columns={columns}
      onRowClick={() => {
        // console.log("Row clicked");
      }}
      emptyComponent={emptyComponent}
      loading={isLoading}
      onSort={onSort}
      sortConfig={sortConfig}
    />
  );
};

export default TransporterTable;
