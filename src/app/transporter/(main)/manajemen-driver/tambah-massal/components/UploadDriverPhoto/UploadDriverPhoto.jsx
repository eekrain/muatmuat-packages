import ImageUploaderWeb from "@/components/ImageUploader/ImageUploaderWeb";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useUploadDriverPhoto } from "@/services/Transporter/manajemen-driver/postUploadDriverPhoto";

export default function UploadDriverPhoto({
  value,
  onUpload,
  isError,
  placeholder,
  className,
}) {
  const { trigger, isMutating, data, error } = useUploadDriverPhoto();

  const handleImageChange = (image) => {
    if (image === null) {
      onUpload(null);
    } else {
      const formData = new FormData();
      formData.append("file", image);
      trigger(formData)
        .then((response) => {
          onUpload(response.Data.fileUrl);
        })
        .catch((err) => {
          console.error("Error uploading driver photo:", err);
          toast.error(
            err.response?.data?.Data?.errors?.[0]?.message ||
              "Gagal mengunggah foto"
          );
        });
    }
  };

  return (
    <ImageUploaderWeb
      value={value}
      onUpload={(image) => handleImageChange(image)}
      uploadText={placeholder}
      className={cn(
        "aspect-square size-full",
        isError && "!border-error-500",
        className
      )}
      onError={(errorMessage) => toast.error(errorMessage)}
      isLoading={isMutating}
      isError={error}
    />
  );
}
