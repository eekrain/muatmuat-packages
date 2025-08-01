import { useEffect } from "react";

import { toast } from "@/lib/toast";
import { useUploadVehicleDocuments } from "@/services/Transporter/manajemen-armada/postUploadVehicleDocuments";

const FileUploadInput = ({
  id,
  value,
  onChange,
  uploadText = "Upload File",
  changeText = "Ubah File",
  successText,
  accept = "*",
  className = "",
  disabled = false,
  hasError = false,
}) => {
  const { trigger } = useUploadVehicleDocuments();
  const hasFile = value && (value.name || value.documentUrl);
  const displayText =
    successText || (hasFile ? value.name || value.name : null);
  const fileExtension =
    hasFile && value?.name ? value.name.split(".").pop() : "";

  const handleUploadFile = (file) => {
    const formData = new FormData();
    formData.append("document", file);
    trigger(formData)
      .then((response) => {
        if (response) {
          onChange({
            documentType: "STNK",
            documentUrl: response.Data.documentUrl,
            name: response.Data.originalFileName,
          });
        }
      })
      .catch(() => {
        toast.error("Gagal mengunggah file");
      });
  };

  useEffect(() => {
    // File upload tracking
  }, [value]);

  return (
    <div className={className}>
      {hasFile ? (
        <div className="flex flex-col gap-1 text-xs font-medium">
          <div className="flex text-success-700">
            <p className="line-clamp-1">{displayText}</p>
            <span>.{fileExtension}</span>
          </div>
          <label
            htmlFor={id}
            className="text-xs font-medium text-primary-700 hover:cursor-pointer hover:text-primary-800 hover:underline"
          >
            {changeText}
          </label>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={`text-xs font-medium hover:cursor-pointer hover:underline ${
            hasError
              ? "text-error-400 hover:text-error-500"
              : "text-primary-700 hover:text-primary-800"
          }`}
        >
          {uploadText}
        </label>
      )}
      <input
        type="file"
        id={id}
        accept={accept}
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleUploadFile(e.target.files[0]);
          }
        }}
        className="hidden"
      />
    </div>
  );
};

export default FileUploadInput;
