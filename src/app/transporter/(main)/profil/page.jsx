"use client";

import { useGetTransporterProfile } from "@/services/Transporter/profil/getTransporterProfile";

import Sidebar from "@/components/Sidebar/SidebarProfile";

import CompanyLegality from "@/container/Transporter/Profil/CompanyLegality";
import CompanyProfileInfo from "@/container/Transporter/Profil/CompanyProfileInfo";
import PicContactInfo from "@/container/Transporter/Profil/PicContactInfo";
import UserProfileInfo from "@/container/Transporter/Profil/UserProfileInfo";

const Profile = () => {
  const {
    data: profileData,
    error,
    isLoading,
    mutate,
  } = useGetTransporterProfile();

  // Transform API data to match existing component props
  const userProfile = profileData
    ? {
        id: profileData.user.id,
        name: profileData.user.fullName,
        email: profileData.user.email,
        phone: profileData.user.phoneNumber,
        position: profileData.user.position,
        companyName: profileData.transporter.companyName,
        companyType: "Perusahaan Ekspedisi Muatan Kapal Laut", // Default value as not provided in API
        npwp: profileData.transporter.taxId,
        profileImage: profileData.user.profileImage,
        initials: profileData.user.initials,
        isEmailVerified: profileData.user.isEmailVerified,
        isPhoneVerified: profileData.user.isPhoneVerified,
        transporter: profileData.transporter,
        picContacts: profileData.picContacts,
        banks: profileData.banks,
      }
    : {
        id: 1,
        name: "Daffa Tisna Djamawean",
        email: "public.relation.transporter@muatmuat.com",
        phone: "081234567890",
        companyName: "PT. ABC",
        companyType: "Perusahaan Ekspedisi Muatan Kapal Laut",
        npwp: "012.3997.4543",
      };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-[273px] w-full space-y-6 p-6">
        {/* Profile Header */}
        {isLoading ? (
          <></>
        ) : (
          <>
            <UserProfileInfo userProfile={userProfile} />
            {/* Data Perusahaan */}
            <CompanyProfileInfo userProfile={userProfile} />

            {/* Legalitas Perusahaan */}
            <CompanyLegality transporter={userProfile.transporter} />

            {/* Data Kontak PIC Transporter */}
            <PicContactInfo
              picContacts={userProfile.picContacts}
              banks={userProfile.banks}
              mutate={mutate}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
