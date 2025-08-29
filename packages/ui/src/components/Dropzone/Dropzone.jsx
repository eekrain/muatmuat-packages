import { useCallback, useRef, useState } from "react";

import { LoaderCircle } from "lucide-react";
import PropTypes from "prop-types";

import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

/**
 * @typedef {Object} DropzoneComponentProps
 * @property {Function} onUpload - Function to call when a file is uploaded
 * @property {boolean} [loading=false] - Whether the upload is in progress
 * @property {Object} [file] - The uploaded file object
 * @property {Object} [renderPlaceholder] - Custom placeholders for different states
 * @property {Node} [renderPlaceholder.loading] - Placeholder for loading state
 * @property {Node} [renderPlaceholder.fileUploaded] - Placeholder for file uploaded state
 * @property {Node} [renderPlaceholder.error] - Placeholder for error state
 * @property {Node} [renderPlaceholder.default] - Default placeholder when no file is uploaded
 * @property {string} [className] - Additional CSS classes for the component
 * @property {Node} [placeholder] - Placeholder text or element to display when no file
 * @property {string} label - The label text for the item.
 * @property {string} [info] - Additional info for the item.
 */

/** * Drag and Drop File Upload Component
 * @param {DropzoneComponentProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */

/** Drag and Drop File Upload Component */
const DropzoneComponent = ({
  onUpload,
  loading = false,
  file,
  placeholder,
  renderPlaceholder = {
    loading: null,
    fileUploaded: null,
    error: null,
    default: null,
  },
  className = "",
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEvent = useCallback((e, isEnter) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isEnter);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files?.length > 0) onUpload(files[0]);
    },
    [onUpload]
  );

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files?.length > 0) onUpload(files[0]);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        renderPlaceholder?.loading || (
          <div className="flex flex-col items-center gap-4">
            <LoaderCircle className="size-5 animate-spin text-primary-700" />
            <p className="text-xs font-semibold text-neutral-900">
              Mengunggah...
            </p>
          </div>
        )
      );
    }

    if (file) {
      return (
        renderPlaceholder?.fileUploaded || (
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-semibold text-neutral-900">
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          </div>
        )
      );
    }

    return (
      renderPlaceholder?.default || (
        <div className="flex flex-col items-center gap-4">
          <IconComponent
            src="/icons/add_image.svg"
            width={20}
            height={20}
            className="text-neutral-500"
          />

          <p className="text-xs text-neutral-900">
            {placeholder || (
              <>
                {" "}
                <span
                  className="font-semibold text-primary-700 underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    openFileDialog();
                  }}
                >
                  Unggah
                </span>{" "}
                atau letakkan file di sini
              </>
            )}
          </p>
        </div>
      )
    );
  };

  return (
    <div
      className={cn(
        "flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed",
        isDragging ? "border-primary-700" : "border-neutral-300",
        loading
          ? "bg-neutral-100"
          : "cursor-pointer bg-white hover:border-primary-500",
        className
      )}
      onDragEnter={(e) => handleDragEvent(e, true)}
      onDragLeave={(e) => handleDragEvent(e, false)}
      onDragOver={(e) => handleDragEvent(e, false)}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
        disabled={loading}
        {...props}
      />
      {renderContent()}
    </div>
  );
};

DropzoneComponent.propTypes = {
  onUpload: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  file: PropTypes.object,
  renderPlaceholder: PropTypes.shape({
    loading: PropTypes.node,
    fileUploaded: PropTypes.node,
    error: PropTypes.node,
    default: PropTypes.node,
  }),
  className: PropTypes.string,
  placeholder: PropTypes.node,
};

export default DropzoneComponent;
