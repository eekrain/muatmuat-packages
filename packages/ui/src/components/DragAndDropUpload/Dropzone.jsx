import { useCallback, useRef, useState } from "react";

import { LoaderCircle } from "lucide-react";
import PropTypes from "prop-types";

import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

/** Drag and Drop File Upload Component
 *
 * @param {Function} onUpload - Callback function to handle file upload
 * @param {boolean} loading - Flag to indicate if a file is being uploaded
 * @param {File} file - The file to be uploaded
 * @param {string} errorText - Error message to display when upload fails
 * @returns {JSX.Element}
 */
const DropzoneComponent = ({
  onUpload,
  loading,
  file,
  renderPlaceholder,
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        onUpload(files[0]);
      }
    },
    [onUpload]
  );

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={cn(
        "flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed",
        isDragging ? "border-primary-700" : "border-neutral-300",
        loading
          ? "bg-neutral-100"
          : "cursor-pointer bg-white hover:border-primary-500"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
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
      {loading ? (
        renderPlaceholder?.loading ? (
          renderPlaceholder?.loading
        ) : (
          <div className="flex flex-col items-center gap-4">
            <LoaderCircle className="size-5 animate-spin text-primary-700" />
            <p className="text-xs font-semibold text-neutral-900">
              Mengunggah...
            </p>
          </div>
        )
      ) : file ? (
        renderPlaceholder?.fileUploaded ? (
          renderPlaceholder?.fileUploaded
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-semibold text-neutral-900">
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          </div>
        )
      ) : // <p>{file.name}</p>
      renderPlaceholder?.default ? (
        renderPlaceholder?.default
      ) : (
        <div className="flex flex-col items-center gap-4">
          <IconComponent
            src="/icons/add_image.svg"
            width={20}
            height={20}
            className="text-neutral-500"
          />
          <p className="text-xs text-neutral-900">
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
          </p>
        </div>
      )}
    </div>
  );
};

DropzoneComponent.propTypes = {
  onUpload: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  placeholder: PropTypes.string,
  renderPlaceholder: PropTypes.shape({
    loading: PropTypes.node,
    fileUploaded: PropTypes.node,
    error: PropTypes.node,
    default: PropTypes.node,
  }),
};

DropzoneComponent.defaultProps = {
  loading: false,
  placeholder: null,
  renderPlaceholder: {
    loading: null,
    fileUploaded: null,
    error: null,
    default: null,
  },
};

export default DropzoneComponent;
