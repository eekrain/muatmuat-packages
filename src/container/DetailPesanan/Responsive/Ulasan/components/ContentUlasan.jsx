import { useState } from "react";

import { Star, Truck } from "lucide-react";

import Button from "@/components/Button/Button";
import { ExpandableTextArea } from "@/components/Form/ExpandableTextArea";
import { toast } from "@/lib/toast";

const ContentUlasan = () => {
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
    toast.error("Rating driver wajib diisi");
    alert(`Rating: ${rating} stars\nReview: ${review}`);
  };

  return (
    <div className="mx-auto h-fit w-full rounded-lg border border-gray-200 bg-white px-[16px] py-[24px] shadow-sm">
      <div className="flex flex-col gap-[24px]">
        {/* Profile Section */}
        <div className="flex items-center gap-2">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              alt="Driver profile"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-semibold text-gray-900">
              Noel Gallagher
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Truck className="h-4 w-4" />
              <span className="text-[12px] font-medium text-gray-900">
                AE 666 LBA
              </span>
            </div>
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default ContentUlasan;
