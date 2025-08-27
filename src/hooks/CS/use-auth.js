"use client";

import { Fragment, useCallback, useEffect } from "react";

import { useShallow } from "zustand/react/shallow";

import { fetcherMuatrans } from "@/lib/axios";

import { useTokenStore } from "@/store/AuthStore/tokenStore";
import { useUserActions, useUserStore } from "@/store/AuthStore/userStore";

/* eslint-disable no-console */

export const AuthenticationProvider = ({ children }) => {
  const isZustandHydrated = useTokenStore((state) => state.isHydrated);
  const { setUser } = useUserActions();

  useEffect(() => {
    // Only run when Zustand is hydrated
    if (!isZustandHydrated) return;

    const handleAuth = async () => {
      try {
        // const profileResponse = await fetcherMuatrans.get(
        //   "v1/transporter/profile"
        // );

        // if (profileResponse.data?.Data) {
        //   const { user, ...restData } = profileResponse.data.Data;

        //   // Store complete profile data in user store
        //   setUser({
        //     ...user,
        //     ...restData,
        //   });
        // }

        const mockProfile = {
          user: {
            id: "0681f5a7-daf0-4581-b593-9d017c2cfd85",
            fullName: "Friday Andita Rachmad Santoso",
            email: "fridayars@gmail.com",
            phoneNumber: "081357652067",
            position: "CEO",
            profileImage:
              "https://azlogistik.s3.ap-southeast-3.amazonaws.com/uploads/menu%20buyer%2010%20%26%2011_2-1755504739036.webp",
            initials: "FS",
            isEmailVerified: true,
            isPhoneVerified: true,
            lastPasswordChangeAt: "2025-08-18T08:12:19.426Z",
            passwordChangeCount: 1,
          },
          transporter: {
            id: "0681f5a7-daf0-4581-b593-9d017c2cfd85",
            companyName: "SARI AGUNG",
            companyAddress: "Jl. Sulawesi No. 13",
            companyLocation: null,
            businessLicenseNumber: "",
            companyLogo: "https://s3.webp",
            companyPhone: null,
            taxId: null,
            verificationStatus: "VERIFIED",
            isHalalCertified: false,
            halalCertificateNo: null,
            halalExpiryDate: null,
            locationPrecision: "HIGH",
            district: null,
            city: null,
            province: null,
            postalCode: null,
            coordinates: {
              latitude: null,
              longitude: null,
            },
          },
          picContacts: [
            {
              id: "348df52b-c6b0-4d99-96d0-b0f1f946d67a",
              picOrder: 1,
              picName: "Ahmad Budiman",
              picPosition: "Operations Manager",
              phoneNumber: "628064749070",
              isActive: true,
            },
            {
              id: "0db02515-d16d-4f10-be43-e63e508b4c1b",
              picOrder: 2,
              picName: "qc az",
              picPosition: "qa&#x2F; qc",
              phoneNumber: "0812345678",
              isActive: true,
            },
          ],
          banks: [
            {
              id: "4e9efb66-9be0-419b-b38e-7232915f7245",
              bankName: "Bank Negara Indonesia",
              accountNumber: "1234567890",
              accountHolderName: "PT Sari Agung",
              isActive: true,
            },
          ],
          documents: [],
          displaySettings: {
            hideEmptyFields: true,
            showInitialsForEmptyPhoto: true,
            enableLocationMap: true,
          },
        };

        const { user, ...restData } = mockProfile;

        setUser({
          ...user,
          ...restData,
        });
      } catch (err) {
        console.warn("Error initializing authentication", err);
      }
    };

    handleAuth();
  }, [isZustandHydrated]);

  // Render children after Zustand is hydrated
  return <Fragment>{isZustandHydrated ? children : null}</Fragment>;
};

/**
 *
 * @typedef {Object} AuthData
 * @property {Object} dataUser
 * @property {Object} transporter
 * @property {Array} picContacts
 * @property {Array} banks
 * @property {Array} documents
 * @property {Object} displaySettings
 * @property {Function} logout
 */

/**
 *
 * @returns {AuthData}
 */
export const useAuth = () => {
  const dataUser = useUserStore(useShallow((state) => state.dataUser));

  const logout = useCallback(async () => {
    const authStore = useTokenStore.getState();
    const userStore = useUserStore.getState();

    try {
      // Call transporter logout endpoint
      await fetcherMuatrans.post("v1/transporter/auth/logout");
    } catch (err) {
      console.warn("Error during logout", err);
    } finally {
      // Clear local state and tokens
      authStore.actions.clearToken();
      userStore.actions.clearUser();

      // Redirect to login page
      window.location.replace("/login");
    }
  }, []);

  return {
    dataUser,
    transporter: dataUser?.transporter,
    picContacts: dataUser?.picContacts || [],
    banks: dataUser?.banks || [],
    documents: dataUser?.documents || [],
    displaySettings: dataUser?.displaySettings || {},
    logout,
  };
};
