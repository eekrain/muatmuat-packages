import { useState } from "react";

import { useCreateDriverReview } from "@/services/Shipper/detailpesanan/createDriverReview";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import Button from "@/components/Button/Button";
import { ExpandableTextArea } from "@/components/Form/ExpandableTextArea";
import { FormLabel } from "@/components/Form/Form";
import RatingInput from "@/components/Form/RatingInput";

import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils/dateFormat";

// Extracted component for read-only review display
const ReviewDisplay = ({ reviewedAt, rating, review }) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-[#7B7B7B]">Tanggal Ulasan</span>
      <div className="text-xs font-medium text-gray-900">
        {formatDate(reviewedAt)}
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-[#7B7B7B]">Rating Driver</span>
      <RatingInput
        value={rating}
        onChange={() => {}}
        disabled={true}
        withLabel={true}
      />
    </div>
    {review && (
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-[#7B7B7B]">Ulasan</span>
        <div className="text-xs font-medium text-gray-900">{review}</div>
      </div>
    )}
  </div>
);

// Extracted component for review form
const ReviewForm = ({
  ratingValue,
  setRatingValue,
  reviewComment,
  handleReviewChange,
  validateUlasan,
  maxLength,
  handleSave,
  isSubmitting,
}) => (
  <>
    <div className="">
      <FormLabel required className="mb-3">
        Rating Driver
      </FormLabel>
      <RatingInput
        value={ratingValue}
        onChange={setRatingValue}
        withLabel={true}
      />
    </div>

    <div className="">
      <FormLabel required className="mb-3">
        Berikan ulasan untuk driver
      </FormLabel>

      <div className="relative">
        <ExpandableTextArea
          value={reviewComment}
          maxLength={maxLength}
          status={validateUlasan && "error"}
          appearance={{ inputClassName: "font-semibold leading-[1.1]" }}
          onChange={(event) => handleReviewChange(event.target.value)}
          supportiveText={{
            title: "",
            desc: `${reviewComment.length}/${maxLength}`,
          }}
          withCharCount
          placeholder={"Tulis ulasan kamu mengenai driver"}
        />
      </div>
    </div>

    <Button
      variant="muatparts-primary"
      className="flex-1"
      onClick={handleSave}
      type="button"
      disabled={isSubmitting}
    >
      {isSubmitting ? "Menyimpan..." : "Simpan"}
    </Button>
  </>
);

const ContentUlasan = ({
  driverId,
  name,
  phoneNumber,
  profileImage,
  licensePlate,
  canReview,
  reviewedAt,
  rating = 0,
  review = "",
  onReviewSubmitted,
  orderId,
}) => {
  const [ratingValue, setRatingValue] = useState(rating);
  const [reviewComment, setReviewComment] = useState(review);
  const [validateUlasan, setValidateUlasan] = useState(false);

  const maxLength = 500;

  const { trigger: createReview, isMutating: isSubmitting } =
    useCreateDriverReview(orderId);

  const handleReviewChange = (value) => {
    if (value.length <= maxLength) {
      setReviewComment(value);
      setValidateUlasan(false);
    }
  };

  const handleSave = async () => {
    if (ratingValue === 0) {
      toast.error("Rating driver wajib diisi");
      return;
    }

    try {
      const requestBody = {
        driverId,
        orderId,
        rating: ratingValue,
        review: reviewComment.trim(),
      };

      const result = await createReview(requestBody);

      if (
        result?.data?.Message?.Code === 201 ||
        result?.Message?.Code === 201
      ) {
        toast.success("Ulasan berhasil disimpan");

        if (onReviewSubmitted) {
          onReviewSubmitted(driverId, {
            rating: ratingValue,
            review: reviewComment.trim(),
            ratedAt: result?.data?.Data?.ratedAt || new Date().toISOString(),
          });
        }
      } else {
        toast.error("Gagal menyimpan ulasan");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Gagal menyimpan ulasan");
    }
  };

  return (
    <div className="mx-auto h-fit w-full rounded-lg border border-gray-200 bg-white px-[16px] py-[24px] shadow-sm">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <AvatarDriver
            name={name}
            image={profileImage}
            licensePlate={licensePlate}
          />
        </div>

        {!canReview ? (
          <ReviewDisplay
            reviewedAt={reviewedAt}
            rating={ratingValue}
            review={reviewComment}
          />
        ) : (
          <ReviewForm
            ratingValue={ratingValue}
            setRatingValue={setRatingValue}
            reviewComment={reviewComment}
            handleReviewChange={handleReviewChange}
            validateUlasan={validateUlasan}
            maxLength={maxLength}
            handleSave={handleSave}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default ContentUlasan;
