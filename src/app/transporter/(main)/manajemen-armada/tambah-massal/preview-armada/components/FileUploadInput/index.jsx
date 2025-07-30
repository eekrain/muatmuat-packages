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
}) => {
  const hasFile = value && (value.name || value.filename);
  const displayText =
    successText || (hasFile ? value.name || value.filename : null);
  const fileExtension = hasFile ? value.name.split(".").pop() : "";

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
          className="text-xs font-medium text-primary-700 hover:cursor-pointer hover:text-primary-800 hover:underline"
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
            onChange(e.target.files[0]);
          }
        }}
        className="hidden"
      />
    </div>
  );
};

export default FileUploadInput;
