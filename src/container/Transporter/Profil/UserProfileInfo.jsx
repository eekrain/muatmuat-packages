"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import CropperWeb from "@/components/Cropper/CropperWeb";
import IconComponent from "@/components/IconComponent/IconComponent";
import ChangeWhatsappNumberModal from "@/components/Modal/ChangeWhatsappNumberModal";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import ModalEmailBaru from "@/components/Modal/ModalEmailBaru";
import ModalGantiPassword from "@/components/Modal/ModalGantiPassword";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useUpdatePassword } from "@/services/Transporter/updatePassword";
import { useUploadProfilePhoto } from "@/services/Transporter/uploadProfilePhoto";

// import { useRequestOtpProfilActions } from "@/store/Transporter/forms/requestOtpProfilStore";

// --- Internal Dropzone Component (logic from your modal file) ---
const Dropzone = ({ onFileAccepted, inputRef, maxSize, acceptedFormats }) => {
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = useCallback(
    (file) => {
      if (!file) return null;
      const fileExtension = `.${file.name.split(".").pop().toLowerCase()}`;
      if (!acceptedFormats.includes(fileExtension)) {
        toast.error("Format file tidak sesuai ketentuan");
        return null;
      }
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`Ukuran file maksimal ${maxSize}MB`);
        return null;
      }
      return file;
    },
    [acceptedFormats, maxSize]
  );

  const handleDragOver = (e) => (e.preventDefault(), setIsDragging(true));
  const handleDragLeave = (e) => (e.preventDefault(), setIsDragging(false));
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = validateFile(e.dataTransfer.files?.[0]);
      if (file) onFileAccepted(file);
    },
    [onFileAccepted, validateFile]
  );
  const handleFileChange = (e) => {
    const file = validateFile(e.target.files?.[0]);
    if (file) onFileAccepted(file);
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept={acceptedFormats.join(",")}
        className="hidden"
      />
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "mx-auto flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary-700 bg-neutral-50 transition-colors hover:border-primary-800",
          isDragging && "border-primary-700 bg-primary-50"
        )}
      >
        <span className="text-xs font-medium text-neutral-900">
          Browse File
        </span>
      </div>
      <p className="mt-2 text-xs text-neutral-600">
        Format file jpg/png maks. {maxSize}MB
      </p>
    </div>
  );
};

// --- Reusable Field Component ---
const EditableField = ({ label, value, href = "#", onClick }) => (
  <div className="flex flex-col gap-1">
    <span className="mb-3 text-xs font-medium text-neutral-600">{label}</span>
    <div className="flex items-center gap-3">
      <span className="text-xs text-neutral-900">{value}</span>
      {onClick ? (
        <button type="button" onClick={onClick}>
          <div className="flex cursor-pointer items-center gap-1 text-sm text-primary-700 hover:text-primary-800">
            Ubah
            <IconComponent
              src="/icons/pencil-outline.svg"
              alt="Edit"
              width={16}
              height={16}
            />
          </div>
        </button>
      ) : (
        <Link href={href}>
          <div className="flex cursor-pointer items-center gap-1 text-sm text-primary-700 hover:text-primary-800">
            Ubah
            <IconComponent
              src="/icons/pencil-outline.svg"
              alt="Edit"
              width={16}
              height={16}
            />
          </div>
        </Link>
      )}
    </div>
  </div>
);

// --- Main Profile Component ---
const UserProfileInfo = ({ userProfile }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { trigger: uploadPhoto, isMutating: isUploading } =
    useUploadProfilePhoto();
  const { trigger: updatePassword, isMutating: isUpdatingPassword } =
    useUpdatePassword();
  // const { generateOtp, updateWhatsAppNumber, reset } =
  //   useRequestOtpProfilActions();

  const [avatarUrl, setAvatarUrl] = useState(userProfile?.profileImage || null);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isCropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [sourceFile, setSourceFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isChangeWhatsappModalOpen, setChangeWhatsappModalOpen] =
    useState(false);
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] =
    useState(false);

  const [hasVerified, setHasVerified] = useState(false);
  const [hasVerifiedEmail, setHasVerifiedEmail] = useState(false);
  const [hasProcessedShowModal, setHasProcessedShowModal] = useState(false);

  useEffect(() => {
    if (searchParams.get("hasVerified") === "true") {
      setHasVerified(true);
    }
    if (searchParams.get("hasVerifiedEmail") === "true") {
      setHasVerifiedEmail(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (hasVerified) {
      setChangeWhatsappModalOpen(true);
    }
  }, [hasVerified]);

  useEffect(() => {
    if (hasVerifiedEmail) {
      setEmailModalOpen(true);
      // toast.success("Email berhasil diverifikasi!");
      // Clean up URL to prevent modal from re-opening on refresh
      const newPath = window.location.pathname;
      router.replace(newPath, { scroll: false });
    }
  }, [hasVerifiedEmail, router]);

  // This effect correctly opens the modal upon successful OTP redirect
  useEffect(() => {
    if (searchParams.get("change_whatsapp") === "true") {
      setChangeWhatsappModalOpen(true);
      // Clean up URL to prevent modal from re-opening on refresh
      const newPath = window.location.pathname;
      router.replace(newPath, { scroll: false });
    }
  }, [searchParams, router]);

  // This effect opens email modal when returning from email OTP
  useEffect(() => {
    if (searchParams.get("change_email") === "true") {
      setEmailModalOpen(true);
      // Clean up URL to prevent modal from re-opening on refresh
      const newPath = window.location.pathname;
      router.replace(newPath, { scroll: false });
    }
  }, [searchParams, router]);

  const userData = {
    initials: userProfile?.initials || "DT",
    whatsapp: userProfile?.phone || "0823212345840",
    email: userProfile?.email || "public.relation.mrsby@midtownight.com",
    name: userProfile?.name || "Daffa Toldo Dharmawan",
  };
  const handleFileAccepted = (file) => {
    setSourceFile(file);
    setImageToCrop(URL.createObjectURL(file));
    setUploadModalOpen(false);
    setCropModalOpen(true);
  };

  const handleCropSuccess = async (file, cropData) => {
    try {
      const uploadData = {
        file: file,
        cropData: cropData || {
          x: 0,
          y: 0,
          width: 200,
          height: 200,
          quality: 0.8,
          rotation: 0,
        },
      };

      const response = await uploadPhoto(uploadData);
      console.log(response, file, cropData, uploadData, "tes");
      if (response?.data?.Data?.profileImage) {
        setAvatarUrl(response.data.Data.profileImage);
        toast.success("Foto profil berhasil diperbarui");
      } else {
        // Fallback to preview URL if API doesn't return image URL
        const previewUrl = URL.createObjectURL(file);
        setAvatarUrl(previewUrl);
        toast.success("Foto profil berhasil diperbarui");
      }

      setCropModalOpen(false);
    } catch (error) {
      console.error("Upload error:", error);

      // Handle specific error cases
      if (error?.response?.data?.Data?.errors) {
        const errorMessage =
          error.response.data.Data.errors[0]?.message ||
          "Gagal mengupload foto";
        toast.error(errorMessage);
      } else {
        toast.error("Gagal mengupload foto profil");
      }
    }
  };

  const handleCropClose = () => {
    setCropModalOpen(false);
    setImageToCrop(null);
    setSourceFile(null);
    setUploadModalOpen(true); // Re-open the upload modal if crop is cancelled
  };
  // const handleWhatsappSubmit = async (newNumber) => {
  //   try {
  //     console.log("New WhatsApp number submitted:", newNumber);
  //     setChangeWhatsappModalOpen(false);

  //     // Store the new phone number for later use
  //     updateWhatsAppNumber(newNumber);

  //     // Generate OTP for new number
  //     const result = await generateOtp(
  //       newNumber,
  //       "WHATSAPP",
  //       "CHANGE_PHONE",
  //       "VERIFY_NEW"
  //     );

  //     if (!result.success) {
  //       toast.error(
  //         result.error?.Message?.Text || "Gagal mengirim OTP ke nomor baru"
  //       );
  //       return;
  //     }

  //     // Navigate to OTP page for new number verification
  //     router.push(`/profil/otp?type=change-number&whatsapp=${newNumber}`);
  //   } catch (error) {
  //     console.error("Error generating OTP for new number:", error);
  //     toast.error(error.message || "Gagal mengirim OTP ke nomor baru");
  //   }
  // };
  const handleWhatsappSubmit = (newNumber) => {
    console.log("New WhatsApp number submitted:", newNumber);
    setChangeWhatsappModalOpen(false);
    toast.success("Nomor WhatsApp baru akan segera diverifikasi.");
  };

  const handleEmailSubmit = (newEmail) => {
    console.log("New email submitted:", newEmail);
    setEmailModalOpen(false);
    router.push("/otp?type=change-email2");
    // router.push("/profil/otp?type=change-email2");
    // Add logic here to handle email verification process
  };

  const handlePasswordSubmit = async (passwordData) => {
    try {
      const response = await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      if (response?.data?.Message?.Code === 200) {
        toast.success("Password berhasil diubah");
        setChangePasswordModalOpen(false);

        // Handle session invalidation if required
        if (response.data.Data?.sessionInvalidated) {
          toast.info("Sesi Anda telah berakhir. Silakan login kembali.");
          // Redirect to login or handle session invalidation
          if (response.data.Data?.redirectUrl) {
            router.push(response.data.Data.redirectUrl);
          }
        }
      }
    } catch (error) {
      console.error("Password update error:", error);

      // // Handle API error responses
      // if (error?.response?.data?.Message) {
      //   const errorMessage = error.response.data.Message.Text;
      //   toast.error(errorMessage);
      // } else {
      //   toast.error("Gagal mengubah password");
      // }
    }
  };

  return (
    <>
      <div className="flex items-center gap-8 p-5 align-middle">
        {/* Left Section: Avatar layout preserved as per the image */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary-700">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-white">
                {userData.initials}
              </span>
            )}
          </div>
          <button type="button" onClick={() => setUploadModalOpen(true)}>
            <span className="cursor-pointer text-sm font-semibold text-primary-700 hover:underline">
              Ubah Foto
            </span>
          </button>
        </div>

        {/* Right Section: User Details */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-neutral-900">
            {userData.name}
          </h2>
          <div className="grid flex-1 grid-cols-2 gap-x-10 gap-y-6">
            <EditableField
              label="No. Whatsapp"
              value={userData.whatsapp}
              onClick={async () => {
                try {
                  // Reset any previous OTP state
                  // reset();

                  // Generate OTP for current number verification
                  // const result = await generateOtp(
                  //   userData.whatsapp,
                  //   "WHATSAPP",
                  //   "CHANGE_PHONE",
                  //   "VERIFY_OLD"
                  // );

                  // if (!result.success) {
                  //   toast.error(
                  //     result.error?.Message?.Text || "Gagal mengirim OTP"
                  //   );
                  //   return;
                  // }

                  // Navigate to OTP page for current number verification
                  router.push(
                    `/otp?type=whatsapp&whatsapp=${userData.whatsapp}`
                  );
                } catch (error) {
                  console.error("Error generating OTP:", error);
                  toast.error(error.message || "Gagal mengirim OTP");
                }
              }}
            />
            <EditableField
              label="Email"
              value={userData.email}
              href={"/profil/otp?type=change-email"}
            />
            <EditableField
              label="Password"
              value="********"
              onClick={() => setChangePasswordModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Modal for initial file selection */}
      <Modal open={isUploadModalOpen} onOpenChange={setUploadModalOpen}>
        <ModalContent size="small" className="w-[550px]" type="muattrans">
          <ModalHeader />
          <div className="rounded-lg bg-white p-6 px-[67px]">
            <h3 className="mb-6 mt-2 text-center text-sm font-bold">
              Ubah Foto Profil
            </h3>
            <Dropzone
              onFileAccepted={handleFileAccepted}
              inputRef={fileInputRef}
              maxSize={10}
              acceptedFormats={[".jpg", ".jpeg", ".png"]}
            />
          </div>
        </ModalContent>
      </Modal>

      {/* Modal for cropping the image */}
      <CropperWeb
        imageFile={sourceFile}
        imageSource={imageToCrop}
        isOpen={isCropModalOpen}
        setIsOpen={setCropModalOpen}
        onClose={handleCropClose}
        result={handleCropSuccess}
        isCircle={true}
        title="Ubah Foto Profil"
        aspectRatio={1}
        isLoading={isUploading}
      />

      {/* Modal for Changing WhatsApp Number */}
      <ChangeWhatsappNumberModal
        type="profile"
        open={isChangeWhatsappModalOpen}
        onOpenChange={setChangeWhatsappModalOpen}
        onSubmit={handleWhatsappSubmit}
        // originalWhatsapp={userData.whatsapp}
        originalWhatsapp={"081252355711"}
      />

      {/* Modal for Changing Email */}
      <ModalEmailBaru
        open={isEmailModalOpen}
        onOpenChange={setEmailModalOpen}
        onSubmit={handleEmailSubmit}
      />

      {/* Modal for Changing Password */}
      <ModalGantiPassword
        open={isChangePasswordModalOpen}
        onOpenChange={setChangePasswordModalOpen}
        onSubmit={handlePasswordSubmit}
        isLoading={isUpdatingPassword}
      />
    </>
  );
};

export default UserProfileInfo;
