import { useMemo, useState } from "react";

import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";

import { useTranslation } from "@/hooks/use-translation";

export const ModalSavedLocationManagement = ({
  userSavedLocations = [],
  open,
  handleSelectUserSavedLocation,
  onOpenChange,
  handleEditLocation,
}) => {
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState("");

  const filteredUserSavedLocations = useMemo(() => {
    if (!userSavedLocations) return [];
    return userSavedLocations.filter(
      (item) =>
        item.Name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.Address.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, userSavedLocations]);

  return (
    <Modal open={open} onOpenChange={onOpenChange} withCloseButton>
      <ModalContent>
        <div className="relative w-[425px]">
          <div className="p-4 text-base font-bold">
            {t("labelLocationManagement")}
          </div>

          <div className="px-4 pb-5">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.currentTarget.value)}
              placeholder={t("labelSearchSavedLocation")}
              icon={{
                left: (
                  <IconComponent
                    src={"/icons/location.svg"}
                    width={20}
                    height={20}
                  />
                ),
              }}
              appearance={{
                inputClassName: "!text-[#1b1b1b]",
              }}
            />
          </div>

          <div className="max-h-96 space-y-4 overflow-auto p-4 pt-0">
            {filteredUserSavedLocations.map((location) => (
              <div key={location.ID} className="flex w-full flex-col text-xs">
                <div className="flex w-full items-start gap-3 font-bold leading-3 text-black">
                  <IconComponent
                    src={"/icons/map-with-marker-outline.svg"}
                    alt="map"
                    width={20}
                    height={20}
                  />
                  <div
                    className="flex min-w-[240px] flex-1 shrink basis-0 cursor-pointer items-start gap-2"
                    onClick={() => {
                      handleSelectUserSavedLocation(location);
                      onOpenChange(false);
                    }}
                  >
                    <div className="my-auto flex-1 shrink basis-0 text-ellipsis text-xs font-bold leading-3 text-black">
                      <div className="line-clamp-1">{location.Name}</div>
                      <div className="mt-2 w-full flex-1 shrink gap-2.5 self-stretch text-ellipsis font-medium leading-tight text-neutral-500">
                        {location.Address}
                      </div>
                    </div>
                    {location.IsMainAddress === 1 && (
                      <div className="gap-1 whitespace-nowrap rounded bg-primary-700 p-1 text-xs font-semibold leading-tight text-white">
                        {t("labelMainLocation")}
                      </div>
                    )}
                  </div>
                  <IconComponent
                    src={"/icons/pencil-outline.svg"}
                    alt="edit"
                    width={20}
                    height={20}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditLocation(location);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
