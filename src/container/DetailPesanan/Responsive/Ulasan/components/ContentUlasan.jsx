import { useState } from "react";

import { Star } from "lucide-react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import Button from "@/components/Button/Button";
import { ExpandableTextArea } from "@/components/Form/ExpandableTextArea";
import { toast } from "@/lib/toast";

const ContentUlasan = ({ type }) => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [review, setReview] = useState("");
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
    setRating(starIndex);
  };

  const handleStarHover = (starIndex) => {
    setHoveredStar(starIndex);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const handleReviewChange = (value) => {
    console.log(value);
    if (value.length <= maxLength) {
      setReview(value);
      setvalidateUlasan(false);
    }
  };

  const handleSave = () => {
    if (rating == 0) {
      toast.error("Rating driver wajib diisi");
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
            name="Noel Gallagher"
            image="https://picsum.photos/50"
            licensePlate="B 123456"
          />
        </div>
        {type == "list" ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <span className="text-[12px] font-medium text-[#7B7B7B]">
                Tanggal Ulasan
              </span>
              <div className="text-[12px] font-medium text-gray-900">
                24 Sep 2024 18:00 WIB
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-medium text-[#7B7B7B]">
                Rating Driver
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
                          starIndex <= (hoveredStar || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-[12px] font-medium text-gray-900">
                  {rateView[hoveredStar || rating]}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Rating Section */}
            <div className="">
              <span className="mb-3 text-base font-medium text-gray-900">
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
                          starIndex <= (hoveredStar || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-[12px] font-medium text-gray-900">
                  {rateView[hoveredStar || rating]}
                </span>
              </div>
            </div>

            {/* Review Section */}
            <div className="">
              <h4 className="mb-3 text-base font-medium text-gray-900">
                Berikan ulasan untuk driver{" "}
                <span className="text-base font-medium text-gray-900">
                  (Opsional)
                </span>
              </h4>
              <div className="relative">
                <ExpandableTextArea
                  value={review}
                  maxLength={maxLength}
                  classname="w-full"
                  status={validateUlasan && "error"}
                  onChange={(event) => handleReviewChange(event.target.value)}
                  supportiveText={{
                    title: "",
                    desc: `${review.length}/${maxLength}`,
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
              Beri Ulasan
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentUlasan;
