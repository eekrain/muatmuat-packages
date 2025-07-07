import { useTranslation } from "@/hooks/use-translation";

const MenuList = () => {
  const { t } = useTranslation();

  const menus = [
    {
      label: "Ringkasan Status Pesanan",
      onClick: () => alert("Ringkasan Status Pesanan clicked"),
    },
    {
      label: "Detail Pengiriman Dokumen",
      onClick: () => alert("Detail Pengiriman Dokumen clicked"),
    },
    {
      label: "Detail Pembayaran",
      onClick: () => alert("Detail Pembayaran clicked"),
    },
    {
      label: "Ubah Pesanan",
      onClick: () => alert("Ubah Pesanan clicked"),
    },
    {
      label: "Batalkan Pesanan",
      onClick: () => alert("Batalkan Pesanan clicked"),
    },
    {
      label: "Unduh Dokumen Delivery Order (DO)",
      onClick: () => alert("Unduh Dokumen Delivery Order (DO) clicked"),
    },
  ];

  return (
    <ul className="flex flex-col divide-y divide-neutral-400 p-4 text-sm font-semibold text-neutral-900">
      {menus.map((menu, index) => (
        <li key={index} onClick={menu.onClick} className="cursor-pointer py-4">
          {t(menu.label)}
        </li>
      ))}
    </ul>
  );
};

export default MenuList;
