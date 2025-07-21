"use client";

import { Fragment, useState } from "react";

import Button from "@/components/Button/Button";
import RatingInput from "@/components/Form/RatingInput";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import TextArea from "@/components/TextArea/TextArea";
import usePrevious from "@/hooks/use-previous";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { toast } from "@/lib/toast";

const DriverRatingForm = ({
  driver,
  onDriverRatingFormValuesChange,
  onSaveReview,
  index,
}) => {
  const handleChangeFormValues = (field, value) => {
    onDriverRatingFormValuesChange(index, field, value);
  };

  const handleSaveDriverReview = () => {
    onSaveReview(index);
  };

  return (
    <div className="flex flex-col gap-y-3 border-b border-neutral-400 pb-5 last:border-b-0 last:pb-0">
      <div className="flex w-full items-start gap-5">
        {/* Driver Info Column */}
        <div className="flex min-w-[204px] items-center gap-x-2">
          <img
            src={driver.profileImage}
            alt={driver.name}
            className="h-10 w-10 rounded-[30px]"
          />
          <div className="flex flex-col gap-y-3">
            <span className="leading-[14.4px] text-xs font-bold text-neutral-900">
              {driver.name}
            </span>
            <div className="flex items-center gap-x-1">
              <IconComponent
                src="/icons/transporter12.svg"
                width={12}
                height={12}
              />
              <span className="leading-[13px] text-xxs font-medium text-neutral-900">
                {driver.licensePlate}
              </span>
            </div>
          </div>
        </div>

        {/* Rating Column */}
        <div className="flex min-w-[214px] flex-col gap-2">
          <span className="leading-[14.4px] text-xs font-medium text-neutral-600">
            Rating Driver
          </span>
          <RatingInput
            disabled={!driver.canReview}
            onChange={(val) => handleChangeFormValues("rating", val)}
            value={driver.rating || 0}
          />
        </div>

        {/* Review Column */}
        <div className="flex min-w-[262px] flex-col gap-2">
          {driver.canReview ? (
            <>
              <span className="text-xs font-medium text-neutral-600">
                Berikan ulasan untuk driver (Opsional)
              </span>
              <TextArea
                value={driver.review || ""}
                onChange={(e) =>
                  handleChangeFormValues("review", e.target.value)
                }
                placeholder="Tulis ulasan kamu mengenai driver"
                maxLength={500}
                height={80}
                supportiveText={{
                  title: "",
                  desc: `${(driver.review || "").length}/500`,
                }}
                resize="none"
              />
            </>
          ) : (
            <>
              <span className="text-xs font-medium text-neutral-600">
                Ulasanmu
              </span>
              <p className="text-xs font-medium leading-3 text-neutral-900">
                {driver.review || "-"}
              </p>
            </>
          )}
        </div>
      </div>
      {driver.canReview && (
        <div className="mt-2 flex justify-end">
          <Button
            variant="muatparts-primary"
            onClick={handleSaveDriverReview}
            className="h-8 w-[112px]"
          >
            Simpan
          </Button>
        </div>
      )}
    </div>
  );
};

const DriverRatingModal = ({ isOpen, setIsOpen, drivers }) => {
  const [driversFormValues, setDriversFormValues] = useState([]);
  const previousIsOpen = usePrevious(isOpen);

  useShallowCompareEffect(() => {
    if (isOpen && !previousIsOpen) {
      setDriversFormValues(drivers);
    }
  }, [isOpen, previousIsOpen, drivers]);

  const handleDriverRatingFormValuesChange = (index, field, value) => {
    setDriversFormValues((prevState) =>
      prevState.map((driver, i) =>
        i === index ? { ...driver, [field]: value } : driver
      )
    );
  };

  const handleSaveReview = (index) => {
    const driver = driversFormValues[index];

    if ((driver.rating || 0) === 0) {
      return toast.error("Rating driver wajib diisi");
    }

    toast.success("Ulasan berhasil disimpan");
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick>
      <ModalContent className="flex w-[800px] flex-col items-center gap-y-3 p-6">
        {/* Header */}
        <div className="w-full text-center">
          <h2 className="leading-[19.2px] text-base font-bold text-neutral-900">
            Ulasan
          </h2>
        </div>

        {/* Content Container */}
        <div className="rounded-xl border border-neutral-400 px-4 py-5">
          <div className="mr-[-12px] flex max-h-[304px] overflow-y-auto pr-[7px]">
            <div className="flex flex-col gap-y-5">
              {driversFormValues.map((driver, key) => (
                <Fragment key={key}>
                  <DriverRatingForm
                    driver={driver}
                    index={key}
                    onDriverRatingFormValuesChange={
                      handleDriverRatingFormValuesChange
                    }
                    onSaveReview={handleSaveReview}
                  />
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default DriverRatingModal;
