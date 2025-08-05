import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/Bottomsheet/BottomSheetUp";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { useGetOrderDriverReviews } from "@/services/Shipper/detailpesanan/getOrderDriverReviews";

import ContentUlasan from "./components/ContentUlasan";
import HeaderComponentUlasan from "./components/HeaderComponentUlasan";

const UlasanScreen = () => {
  const params = useParams();
  const navigation = useResponsiveNavigation();
  const [isOpenBottomsheet, setIsOpenBottomsheet] = useState(false);
  const [isOpenInfo, setIsOpenInfo] = useState(false);

  const { data: ulasanData } = useGetOrderDriverReviews(params.orderId);

  // Nanti kalo integrasi api, kode dibawah bisa dihapus. tinggal refetch aja si useGetOrderDriverReviews
  const [localReviewData, setLocalReviewData] = useState(null);
  // Update local state when API data changes
  useEffect(() => {
    if (ulasanData) {
      setLocalReviewData(ulasanData);
    }
  }, [ulasanData]);

  // Function to update review data after successful submission
  const handleReviewSubmitted = (driverId, reviewData) => {
    if (localReviewData?.drivers) {
      const updatedDrivers = localReviewData.drivers.map((driver) => {
        if (driver.driverId === driverId) {
          return {
            ...driver,
            canReview: false,
            reviewedAt: reviewData.ratedAt,
            rating: reviewData.rating,
            review: reviewData.review,
          };
        }
        return driver;
      });

      setLocalReviewData({
        ...localReviewData,
        drivers: updatedDrivers,
      });
    }
  };

  return (
    <FormResponsiveLayout
      title={{
        label: "Ulasan",
      }}
      withMenu={{
        onClickInfo: () => setIsOpenInfo(true),
        onClickMenu: () => setIsOpenBottomsheet(true),
      }}
      onClickBackButton={() => navigation.pop()}
    >
      <div className="mb-16 space-y-2 bg-neutral-200">
        <HeaderComponentUlasan orderCode={localReviewData?.orderCode} />
        {localReviewData?.drivers?.map((item) => (
          <ContentUlasan
            key={item?.driverId}
            {...item}
            onReviewSubmitted={handleReviewSubmitted}
            orderId={params.orderId}
          />
        ))}
      </div>

      <BottomSheet open={isOpenBottomsheet} onOpenChange={setIsOpenBottomsheet}>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetClose />
            <BottomSheetTitle>Menu</BottomSheetTitle>
          </BottomSheetHeader>
        </BottomSheetContent>
      </BottomSheet>

      <BottomSheet open={isOpenInfo} onOpenChange={setIsOpenInfo}>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetClose />
            <BottomSheetTitle>Informasi</BottomSheetTitle>
          </BottomSheetHeader>
        </BottomSheetContent>
      </BottomSheet>
    </FormResponsiveLayout>
  );
};

export default UlasanScreen;
