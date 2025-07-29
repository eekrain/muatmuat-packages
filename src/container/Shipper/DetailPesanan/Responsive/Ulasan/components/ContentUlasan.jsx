import { useState } from "react";

import { Star } from "lucide-react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import Button from "@/components/Button/Button";
import { ExpandableTextArea } from "@/components/Form/ExpandableTextArea";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils/dateFormat";

const ContentUlasan = ({
  driverId,
  name,
  phoneNumber,
  profileImage,
  licensePlate,
  canReview,
  reviewedAt,
  rating,
  review,
}) => {
  const [ratingView, setRatingView] = useState(rating);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewRating, setReviewRating] = useState(review);
  const [validateUlasan, setvalidateUlasan] = useState(false);
  const rateView = [
    "",
    "Sangat Buruk",
    "Buruk",
    "Cukup",
    "Baik",
    "Sangat Baik",
  ];

  const maxLength = 500;

  const handleStarClick = (starIndex) => {
    setRatingView(starIndex);
  };

  const handleStarHover = (starIndex) => {
    setHoveredStar(starIndex);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const handleReviewChange = (value) => {
    if (value.length <= maxLength) {
      setReviewRating(value);
      setvalidateUlasan(false);
    }
  };

  const handleSave = () => {
    if (ratingView == 0) {
      toast.error("rating driver wajib diisi");
    } else {
      alert("jalankan api");
    }
  };

  return (
    <div className="mx-auto h-fit w-full rounded-lg border border-gray-200 bg-white px-[16px] py-[24px] shadow-sm">
      <div className="flex flex-col gap-[24px]">
        {/* Profile Section */}
        <div className="flex items-center gap-2">
          <AvatarDriver
            name={name}
            image={profileImage}
            licensePlate={licensePlate}
          />
        </div>
        {!canReview ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-[#7B7B7B]">
                Tanggal Ulasan
              </span>
              <div className="text-xs font-medium text-gray-900">
                {formatDate(reviewedAt)}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-[#7B7B7B]">
                Rating Driver
              </span>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((starIndex) => (
                    <Star
                      key={starIndex}
                      className={`h-6 w-6 transition-colors ${
                        starIndex <= (hoveredStar || ratingView)
                          ? "fill-[#FEA010] text-[#FEA010]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-900">
                  {rateView[hoveredStar || ratingView]}
                </span>
              </div>
            </div>
            {review && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-[#7B7B7B]">
                  Ulasan
                </span>
                <div className="text-xs font-medium text-gray-900">
                  {review}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* ratingView Section */}
            <div className="">
              <span className="mb-3 text-sm font-medium text-gray-900">
                Rating Driver<span className="text-gray-900">*</span>
              </span>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((starIndex) => (
                    <button
                      key={starIndex}
                      onClick={() => handleStarClick(starIndex)}
                      onMouseEnter={() => handleStarHover(starIndex)}
                      onMouseLeave={handleStarLeave}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          starIndex <= (hoveredStar || ratingView)
                            ? "fill-[#FEA010] text-[#FEA010]"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm text-xs font-medium text-gray-900">
                  {rateView[hoveredStar || ratingView]}
                </span>
              </div>
            </div>

            {/* reviewRating Section */}
            <div className="">
              <h4 className="mb-3 text-sm font-medium text-gray-900">
                Berikan ulasan untuk driver{" "}
                <span className="text-sm font-medium text-gray-900">
                  (Opsional)
                </span>
              </h4>
              <div className="relative">
                <ExpandableTextArea
                  value={reviewRating}
                  maxLength={maxLength}
                  classname="w-full"
                  status={validateUlasan && "error"}
                  onChange={(event) => handleReviewChange(event.target.value)}
                  supportiveText={{
                    title: "",
                    desc: `${reviewRating.length}/${maxLength}`,
                  }}
                  withCharCount
                  placeholder={"Tulis ulasan kamu mengenai driver"}
                />
              </div>
            </div>
            {/* Save Button */}
            <Button
              variant="muatparts-primary"
              className="flex-1"
              onClick={handleSave}
              type="button"
            >
              Simpan
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentUlasan;
