"use client";

import Sidebar from "@/components/Sidebar/SidebarProfile";
import CompanyLegality from "@/container/Transporter/Profil/CompanyLegality";
import CompanyProfileInfo from "@/container/Transporter/Profil/CompanyProfileInfo";
import PicContactInfo from "@/container/Transporter/Profil/PicContactInfo";
import UserProfileInfo from "@/container/Transporter/Profil/UserProfileInfo";

const Profile = () => {
  const userProfile = {
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
        <UserProfileInfo userProfile={userProfile} />
        {/* Data Perusahaan */}
        <CompanyProfileInfo />

        {/* Legalitas Perusahaan */}
        <CompanyLegality />

        {/* Data Kontak PIC Transporter */}
        <PicContactInfo />
      </div>
    </div>
  );
};

export default Profile;
