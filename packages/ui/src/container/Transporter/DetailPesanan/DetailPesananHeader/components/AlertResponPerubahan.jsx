import IconComponent from "@/components/IconComponent/IconComponent";

function AlertResponPerubahan() {
  return (
    <div
      className={
        "mt-4 flex items-center gap-[2px] rounded-lg bg-secondary-100 px-6 py-4 text-xs font-medium text-neutral-900"
      }
    >
      <IconComponent
        src={"/icons/warning-kuning.svg"}
        className={"mr-1 flex-shrink-0"}
        width={24}
        height={24}
      />
      Terdapat perubahan pesanan dari shipper, mohon pelajari perubahannya dan
      segera beri respon
    </div>
  );
}

export default AlertResponPerubahan;
