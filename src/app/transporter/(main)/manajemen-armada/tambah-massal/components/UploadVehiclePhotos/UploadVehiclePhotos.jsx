import ImageUploaderWeb from "@/components/ImageUploader/ImageUploaderWeb";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useUploadVehiclePhotos } from "@/services/Transporter/manajemen-armada/postUploadVehiclePhotos";

export default function UploadVehiclePhotos({
  value,
  onUpload,
  isError,
  placeholder,
  className,
}) {
  const { trigger, isMutating, data, error } = useUploadVehiclePhotos();

  const handleImageChange = (image) => {
    if (image === null) {
      onUpload(null);
    } else {
      const formData = new FormData();
      formData.append("file", image);
      trigger(formData)
        .then((response) => {
          // console.log(response);
          onUpload(response.Data.photoUrl);
        })
        .catch((err) => {
          console.error("Error uploading image:", err);
          toast.error(err.response.data.Data.errors[0].message);
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
