"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import TextArea from "@/components/TextArea/TextArea";

const DriverRatingForm = ({
  driver,
  rating,
  onRatingChange,
  onReviewChange,
  onSave,
}) => {
  return (
    <div className="flex flex-col gap-y-3 border-b border-neutral-400 last:border-b-0">
      <div className="flex w-full gap-5">
        {/* Driver Info Column */}
        <div className="flex w-[204px] items-center gap-2">
          <img
            src={driver.profileImage}
            alt={driver.name}
            className="h-10 w-10 rounded-full"
          />
          <div className="flex flex-col justify-center">
            <span className="text-xs font-bold text-neutral-900">
              {driver.name}
            </span>
            <div className="flex items-center gap-1 text-[10px] font-medium">
              <IconComponent src="/icons/truck12.svg" width={12} height={12} />
              <span>{driver.licensePlate}</span>
            </div>
          </div>
        </div>

        {/* Rating Column */}
        <div className="flex w-[214px] flex-col gap-2">
          <span className="text-xs font-medium text-neutral-600">
            Rating Driver
          </span>
          {driver.hasReview ? (
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <IconComponent
                  key={star}
                  src={
                    driver.givenRating >= star
                      ? "/icons/star-filled24.svg"
                      : "/icons/star-empty24.svg"
                  }
                  width={24}
                  height={24}
                />
              ))}
              <span className="ml-2 text-xs font-semibold">
                {getRatingText(driver.givenRating)}
              </span>
            </div>
          ) : (
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => onRatingChange(star)}
                  className="focus:outline-none"
                  disabled={!driver.canReview}
                >
                  <IconComponent
                    src={
                      rating.score >= star
                        ? "/icons/star-filled24.svg"
                        : "/icons/star-empty24.svg"
                    }
                    width={24}
                    height={24}
                  />
                </button>
              ))}
              {rating.score > 0 && (
                <span className="ml-2 text-xs font-semibold">
                  {getRatingText(rating.score)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Review Column */}
        <div className="flex w-[262px] flex-col gap-2">
          <span className="text-xs font-medium text-neutral-600">
            Berikan ulasan untuk driver {driver.hasReview ? "" : "(Opsional)"}
          </span>
          {driver.hasReview ? (
            <div className="rounded-md border border-neutral-200 p-2 text-xs">
              {driver.givenReview}
              <div className="mt-1 text-right text-[10px] text-neutral-500">
                {new Date(driver.reviewedAt).toLocaleDateString("id-ID")}
              </div>
            </div>
          ) : (
            <>
              <TextArea
                value={rating.review}
                onChange={onReviewChange}
                placeholder="Tulis ulasan kamu mengenai driver"
                maxLength={500}
                height={80}
                supportiveText={{
                  title: "",
                  desc: `${rating.review.length}/500`,
                }}
                resize="none"
                className="w-[262px]"
                disabled={!driver.canReview}
              />
              {driver.canReview && (
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="muatparts-primary"
                    onClick={onSave}
                    className="h-8 w-[112px]"
                    disabled={rating.score === 0}
                  >
                    Simpan
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to get rating text
const getRatingText = (score) => {
  switch (score) {
    case 1:
      return "Buruk";
    case 2:
      return "Kurang";
    case 3:
      return "Cukup";
    case 4:
      return "Baik";
    case 5:
      return "Sangat Baik";
    default:
      return "";
  }
};

const DriverRatingModal = ({ isOpen, setIsOpen }) => {
  // Sample driver data
  const drivers = [
    {
      driverId: "uuid-driver-1",
      name: "Ahmad Rahman",
      phoneNumber: "081234567891",
      profileImage: "https://example.com/driver1.jpg",
      licensePlate: "B 1234 CD",
      hasReview: false,
      canReview: true,
      driverPerformance: {
        onTimePickup: true,
        onTimeDelivery: true,
        cargoCondition: "GOOD",
        communicationRating: "EXCELLENT",
      },
    },
    {
      driverId: "uuid-driver-2",
      name: "Budi Santoso",
      phoneNumber: "081234567892",
      profileImage: "https://example.com/driver2.jpg",
      licensePlate: "B 5678 EF",
      hasReview: true,
      canReview: false,
      reviewedAt: "2025-02-11T16:00:00Z",
      givenRating: 5,
      givenReview: "Driver sangat baik dan profesional",
    },
  ];

  const [ratings, setRatings] = useState(
    drivers.map(() => ({ score: 0, review: "" }))
  );

  const handleRatingChange = (driverIndex, score) => {
    const newRatings = [...ratings];
    newRatings[driverIndex].score = score;
    setRatings(newRatings);
  };

  const handleReviewChange = (driverIndex, event) => {
    const text = event.target.value;
    const newRatings = [...ratings];
    newRatings[driverIndex].review = text;
    setRatings(newRatings);
  };

  const handleSave = (driverIndex) => {
    // Handle save logic here
    console.log("Saving rating for driver", driverIndex, ratings[driverIndex]);
    // Could trigger API call or other actions
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick={false}>
      <ModalContent className="flex w-[800px] flex-col items-center gap-y-3 p-6">
        {/* Header */}
        <div className="w-full text-center">
          <h2 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
            Ulasan
          </h2>
        </div>

        {/* Content Container */}
        <div className="flex w-full flex-col gap-y-5 overflow-y-auto rounded-xl border border-neutral-400 px-4 py-5">
          {drivers.map((driver, index) => (
            <DriverRatingForm
              key={driver.driverId}
              driver={driver}
              rating={ratings[index]}
              onRatingChange={(score) => handleRatingChange(index, score)}
              onReviewChange={(e) => handleReviewChange(index, e)}
              onSave={() => handleSave(index)}
            />
          ))}
        </div>
      </ModalContent>
    </Modal>
  );
};

export default DriverRatingModal;
