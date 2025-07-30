import { useEffect, useRef, useState } from "react";

import Checkbox from "@/components/Form/Checkbox";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { useAuth } from "@/hooks/use-auth";
import {
  useGetUserPreferences,
  useSaveUserPreferences,
} from "@/services/Shipper/sewaarmada/userPreferences";
import { useFirstTimerSewaArmadaApp } from "@/store/Shipper/first-timer/sewaArmadaApp";

export const ModalFirstTimer = () => {
  const [open, setOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const { dataUser } = useAuth();
  const { dontShowAgain, userId, setDontShowAgain } =
    useFirstTimerSewaArmadaApp();
  const {
    data: userPreferences,
    isLoading: isLoadingUserPreferences,
    error: userPreferencesError,
  } = useGetUserPreferences();
  const { trigger: saveUserPreferences } = useSaveUserPreferences();
  const hasInit = useRef(false);

  // Check if user is logged in and has access to userPreferences
  const isLoggedIn = !!dataUser?.ID;
  const hasUserPreferencesAccess =
    isLoggedIn && !userPreferencesError && !isLoadingUserPreferences;
  const shouldUseLocalStorage = !isLoggedIn || !hasUserPreferencesAccess;

  useEffect(() => {
    // Don't proceed if still loading user preferences and user is logged in
    if (isLoggedIn && isLoadingUserPreferences) return;

    let shouldShowPopup;

    if (shouldUseLocalStorage) {
      // Use localStorage when user is not logged in or doesn't have access to userPreferences
      shouldShowPopup = !dontShowAgain;
    } else {
      // Use userPreferences when logged in and has access
      shouldShowPopup = userPreferences?.Data?.shouldShowPopup;
    }

    // Update dontShowAgain with the opposite value of shouldShowPopup
    if (shouldShowPopup !== undefined) {
      const oppositeValue = !shouldShowPopup;
      setDontShowAgain(oppositeValue, dataUser?.ID);
    }

    // Open the modal if shouldShowPopup is true and other conditions are met
    if (
      shouldShowPopup &&
      !dontShowAgain &&
      userId === dataUser?.ID &&
      !hasInit.current
    ) {
      setOpen(true);
      hasInit.current = true;
    }
    // Reset the state if the user is not the same, e.g. user has logged out and logged in with another account
    else if (userId !== dataUser?.ID) {
      // Set dontShowAgain to opposite of shouldShowPopup
      const oppositeValue =
        shouldShowPopup !== undefined ? !shouldShowPopup : false;
      setDontShowAgain(oppositeValue, dataUser?.ID);
      // Only show if shouldShowPopup is true
      if (shouldShowPopup) {
        setOpen(true);
        hasInit.current = true;
      }
    }
    // Close modal if shouldShowPopup is false
    else if (shouldShowPopup === false) {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dontShowAgain,
    userId,
    dataUser?.ID,
    userPreferences?.Data?.shouldShowPopup,
    isLoadingUserPreferences,
    shouldUseLocalStorage,
  ]);

  return (
    <Modal
      open={open}
      onOpenChange={async (value) => {
        if (value === false) {
          if (isChecked) {
            setSaving(true);
            try {
              if (shouldUseLocalStorage) {
                // Use localStorage when not logged in or no API access
                setDontShowAgain(true, dataUser?.ID);
              } else {
                // Use API when logged in and has access
                await saveUserPreferences({ dontShowAgain: true });
                setDontShowAgain(true, dataUser?.ID);
              }
            } catch (error) {
              console.error("Error saving preferences:", error);
              // Fallback to localStorage if API fails
              setDontShowAgain(true, dataUser?.ID);
            } finally {
              setSaving(false);
              setOpen(value);
            }
          } else {
            // Checkbox tidak dicentang: hanya update localStorage
            setDontShowAgain(false, dataUser?.ID);
            setOpen(value);
          }
        }
      }}
      closeOnOutsideClick
    >
      <ModalContent type="muatmuat">
        <div className="w-[296px] rounded-[10px] bg-neutral-50 px-5 pb-[26px] pt-[44px]">
          <h3 className="text-center text-base font-bold text-neutral-900">
            Nikmati Kemudahan Pengiriman dengan Muatrans!
          </h3>

          <div className="flex justify-center">
            <ImageComponent
              src="/img/sewa-armada-first-timer-apps.png"
              alt=""
              width={158}
              height={158}
            />
          </div>

          <p className="mb-[59px] mt-5 text-sm font-medium leading-[1.1] text-neutral-900">
            Pesan truk kapan saja dengan mudah. Lacak kirimanmu secara real-time
            dan dapatkan rekomendasi truk sesuai muatan!
          </p>

          <div className="flex justify-center">
            <Checkbox
              label="Jangan Tampilkan lagi"
              value="rentang_waktu"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
