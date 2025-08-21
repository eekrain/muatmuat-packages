import { useState } from "react";

import Button from "@/components/Button/Button";
import FileUpload from "@/components/FileUpload/FileUpload";
import { MyTextArea } from "@/components/Form/TextArea";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/Modal/Modal";

const UploadArchieveModal = ({ isOpen, onClose, order, isLoading }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [documentNotes, setDocumentNotes] = useState("");

  const handleFileUpload = (file) => {
    if (file) {
      setUploadedFiles((prev) => [...prev, file]);
    }
  };

  const handleFileDelete = (indexToDelete) => {
    setUploadedFiles((prev) =>
      prev.filter((_, index) => index !== indexToDelete)
    );
  };

  const handleFileReplace = (indexToReplace, newFile) => {
    if (newFile) {
      setUploadedFiles((prev) => {
        const updated = [...prev];
        updated[indexToReplace] = newFile;
        return updated;
      });
    }
  };

  const handleSubmit = () => {
    console.log("Uploading archive documents:", {
      files: uploadedFiles,
      notes: documentNotes,
    });
    // TODO: Implement actual upload logic
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="w-[600px] max-w-[90vw]" type="muattrans">
        <ModalHeader />

        <div className="p-6">
          <ModalTitle className="mb-6 text-center">
            Unggah Dokumen Arsip
          </ModalTitle>

          {/* Dokumen Arsip Section */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-semibold text-neutral-900">
              Dokumen Arsip*
            </label>

            {/* Upload Button and File List Container */}
            <div className="flex gap-4">
              {/* Upload Button */}
              <div className="flex-shrink-0">
                <FileUpload
                  onSuccess={handleFileUpload}
                  onError={(error) => console.error("Upload error:", error)}
                  maxSize={10}
                  acceptedFormats={[".jpg", ".png", ".pdf", ".zip"]}
                  className="w-full"
                  showFormatInfo={uploadedFiles.length === 0}
                  formatInfoPosition="below"
                />
              </div>

              {/* File List - Positioned to the right */}
              <div className="min-w-0 flex-1">
                {uploadedFiles.length > 0 && (
                  <div className="max-h-44 overflow-y-auto rounded-lg">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2.5 last:border-b-0"
                      >
                        <span className="mr-3 flex-1 truncate text-xs font-medium text-success-400">
                          {file.name || `File${index + 1}.png`}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleFileDelete(index)}
                            className="text-neutral-400 hover:text-error-400"
                          >
                            <IconComponent
                              src="/icons/silang.svg"
                              width={16}
                              height={16}
                              className="h-4 w-4"
                            />
                          </button>
                          <button
                            onClick={() => {
                              // Trigger file input for replacement
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = ".jpg,.jpeg,.png,.pdf,.doc,.docx";
                              input.onchange = (e) => {
                                if (e.target.files[0]) {
                                  handleFileReplace(index, e.target.files[0]);
                                }
                              };
                              input.click();
                            }}
                            className="text-xs font-medium text-primary-700 hover:text-primary-800"
                          >
                            Ubah File
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Catatan Dokumen Section */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-semibold text-neutral-900">
              Catatan Dokumen
            </label>
            <MyTextArea
              value={documentNotes}
              onChange={(e) => setDocumentNotes(e.target.value)}
              placeholder="Masukkan Catatan Dokumen"
              maxLength={255}
              withCharCount
              className="w-full"
              appearance={{
                inputClassName: "min-h-[80px] resize-none",
              }}
            />
          </div>
        </div>

        {/* Footer with Submit Button */}
        <div className="flex justify-center pb-6">
          <Button
            onClick={handleSubmit}
            // disabled={isLoading || uploadedFiles.length === 0}
            className="px-8 py-3"
          >
            {isLoading ? "Mengirim..." : "Kirim"}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default UploadArchieveModal;
