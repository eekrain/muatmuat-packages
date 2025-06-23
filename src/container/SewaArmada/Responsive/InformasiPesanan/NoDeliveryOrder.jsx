import { Fragment, useState } from "react";

import { TagBubble } from "@/components/Badge/TagBubble";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

const NoDeliveryOrder = () => {
  const deliveryOrderNumbers = useSewaArmadaStore(
    (state) => state.formValues.deliveryOrderNumbers
  );
  const { formValues } = useSewaArmadaStore();
  const { setField } = useSewaArmadaActions();

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [type, setType] = useState("");
  const [tempNoDeliveryOrders, setTempNoDeliveryOrders] = useState([]);
  const [newDo, setNewDo] = useState("");

  const handleAddTempNoDeliveryOrders = () => {
    setTempNoDeliveryOrders((prevState) => [...prevState, newDo]);
    setType("list");
  };

  const handleChangeNoDeliveryOrders = () => {
    setField("deliveryOrderNumbers", tempNoDeliveryOrders);
    setIsBottomSheetOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <h2 className="text-[14px] font-semibold text-neutral-900">
              No. Delivery Order (DO)
            </h2>
            <span className="text-[10px] font-semibold text-neutral-900">
              (Opsional)
            </span>
            <IconComponent
              src="/icons/info.svg"
              width={16}
              height={16}
              className="icon-gray"
            />
          </div>
          <button
            onClick={() => {
              setIsBottomSheetOpen(true);
              if (deliveryOrderNumbers.length === 0) {
                setNewDo("");
                setTempNoDeliveryOrders(deliveryOrderNumbers);
                setType("add");
              } else {
                setTempNoDeliveryOrders(deliveryOrderNumbers);
                setType("list");
              }
            }}
            className="text-[14px] font-semibold text-primary-700"
          >
            Tambah
          </button>
        </div>
        {deliveryOrderNumbers.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {deliveryOrderNumbers.map((item, key) => (
              <Fragment key={key}>
                <TagBubble
                  withRemove={{
                    onRemove: () =>
                      setField(
                        "deliveryOrderNumbers",
                        deliveryOrderNumbers.filter((_, i) => i !== key)
                      ),
                  }}
                  className="!bg-primary-50"
                >
                  {item}
                </TagBubble>
              </Fragment>
            ))}
          </div>
        ) : null}
      </div>

      {/* BOTTOMSHEET TAMBAH NO DO */}
      <BottomSheet
        open={isBottomSheetOpen && type === "add"}
        onOpenChange={setIsBottomSheetOpen}
      >
        <BottomSheetContent>
          <BottomSheetHeader>No. Delivery Order (DO)</BottomSheetHeader>
          <div className="flex flex-col gap-y-4 px-4 py-6">
            <Input
              placeholder="Masukkan No. Delivery Order (DO)"
              name="noDeliveryOrder"
              type="text"
              value={newDo}
              onChange={(e) => setNewDo(e.target.value)}
            />
            <Button
              variant="muatparts-primary"
              className="h-10"
              onClick={handleAddTempNoDeliveryOrders}
              type="button"
            >
              Simpan
            </Button>
          </div>
        </BottomSheetContent>
      </BottomSheet>

      {/* BOTTOMSHEET LIST NO DO */}
      <BottomSheet
        open={isBottomSheetOpen && type === "list"}
        onOpenChange={setIsBottomSheetOpen}
      >
        <BottomSheetContent>
          <BottomSheetHeader>No. Delivery Order (DO)</BottomSheetHeader>
          <div className="flex flex-col gap-y-7 px-4 py-6">
            <div className="flex flex-col gap-y-4">
              {tempNoDeliveryOrders.map((item, key) => (
                <div
                  className={
                    "flex items-center justify-between border-b border-b-neutral-400 pb-4"
                  }
                  key={key}
                >
                  <span className="text-[14px] font-semibold leading-[15.4px] text-neutral-900">
                    {item}
                  </span>
                  <IconComponent
                    src="/icons/silang.svg"
                    width={14}
                    height={14}
                    onClick={() =>
                      setTempNoDeliveryOrders((prevState) =>
                        prevState.filter((_, i) => i !== key)
                      )
                    }
                  />
                </div>
              ))}
              <button
                className="flex items-center gap-x-1"
                onClick={() => {
                  setNewDo("");
                  setType("add");
                }}
              >
                <IconComponent
                  className="icon-blue"
                  src="/icons/plus14.svg"
                  width={14}
                  height={14}
                />
                <span className="text-[14px] font-semibold leading-[15.4px] text-primary-700">
                  Tambah No. Delivery Order (DO)
                </span>
              </button>
            </div>
            <Button
              variant="muatparts-primary"
              className="h-10"
              onClick={handleChangeNoDeliveryOrders}
              type="button"
            >
              Simpan
            </Button>
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </>
  );
};

export default NoDeliveryOrder;
