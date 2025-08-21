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

const DetailArchieveModal = ({ isOpen, onClose, order, isLoading }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  // Hardcoded data for now - replace with actual data later
  const [archiveDocuments, setArchiveDocuments] = useState([
    { id: 1, name: "File1.png", url: "#" },
    { id: 2, name: "File2.png", url: "#" },
    { id: 3, name: "File3.png", url: "#" },
    { id: 4, name: "File4.png", url: "#" },
    { id: 5, name: "File5.png", url: "#" },
  ]);

  const [documentNotes, setDocumentNotes] = useState(
    "Berikut adalah soft file dokumen yang telah Muatrans kirimkan kepada Anda sebagai kelengkapan data dan informasi terkait pengiriman. Mohon untuk memeriksa kembali isi dokumen ini dengan saksama dan mengonfirmasi apabila seluruh informasi telah sesuai."
  );

  const handleDownload = (file) => {
    console.log("Downloading file:", file.name);
    // TODO: Implement actual download logic
    // For now, just log the action
  };

  const handleChange = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const handleFileUpload = (file) => {
    if (file) {
      setArchiveDocuments((prev) => [...prev, file]);
    }
  };

  const handleFileDelete = (indexToDelete) => {
    setArchiveDocuments((prev) =>
      prev.filter((_, index) => index !== indexToDelete)
    );
  };

  const handleFileReplace = (indexToReplace, newFile) => {
    if (newFile) {
      setArchiveDocuments((prev) => {
        const updated = [...prev];
        updated[indexToReplace] = newFile;
        return updated;
      });
    }
  };

  const handleSave = () => {
    console.log("Saving archive documents:", {
      files: archiveDocuments,
      notes: documentNotes,
    });
    // TODO: Implement actual save logic
    setIsEditMode(false);
  };

  // View Mode - Show existing documents
  if (!isEditMode) {
    return (
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent className="w-[600px] max-w-[90vw]" type="muattrans">
          <div className="p-6">
            <ModalTitle className="mb-6 text-center">Dokumen Arsip</ModalTitle>

            {/* Dokumen Arsip Section */}
            <div className="mb-6">
              <label className="mb-1 block text-sm font-medium text-neutral-900">
                Dokumen Arsip
              </label>

              {/* File List */}
              <div className="max-h-44 overflow-y-auto">
                {archiveDocuments.map((file, index) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between py-2 last:border-b-0"
                  >
                    <span className="mr-3 flex-1 truncate text-xs font-medium text-success-400">
                      {file.name}
                    </span>
                    <button
                      onClick={() => handleDownload(file)}
                      className="text-xs font-medium text-primary-700 hover:text-primary-800"
                    >
                      Unduh File
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Catatan Dokumen Section */}
            <div className="mb-1">
              <label className="mb-1 block text-sm font-medium text-neutral-900">
                Catatan Dokumen
              </label>
              <div className="">
                <p className="text-xs font-medium leading-relaxed text-neutral-900">
                  {documentNotes}
                </p>
              </div>
            </div>
          </div>

          {/* Footer with Change Button */}
          <div className="flex justify-center pb-6">
            <Button
              variant="muattrans-primary-secondary"
              onClick={handleChange}
              className="px-8 py-3 text-base font-semibold"
            >
              Ubah
            </Button>
          </div>
        </ModalContent>
      </Modal>
    );
  }

  // Edit Mode - Same layout as UploadArchieveModal but with existing data
  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="w-[600px] max-w-[90vw]" type="muattrans">
        <div className="p-6">
          <ModalTitle className="mb-6 text-center">
            Ubah Dokumen Arsip
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
                  showFormatInfo={archiveDocuments.length === 0}
                />
              </div>

              {/* File List - Positioned to the right */}
              <div className="min-w-0 flex-1">
                {archiveDocuments.length > 0 && (
                  <div className="max-h-44 overflow-y-auto">
                    {archiveDocuments.map((file, index) => (
                      <div
                        key={file.id || index}
                        className="flex items-center justify-between py-2 last:border-b-0"
                      >
                        <span className="mr-3 flex-1 truncate text-xs font-medium text-success-400">
                          {file.name}
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
                              input.accept = ".jpg,.jpeg,.png,.pdf,.zip";
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

        {/* Footer with Save and Cancel Buttons */}
        <div className="flex justify-center gap-3 pb-6">
          {/* <Button
            variant="muattrans-primary-secondary"
            onClick={handleCancel}
            className="px-8 py-3 text-base font-semibold"
          >
            Batal
          </Button> */}
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="px-8 py-3"
          >
            {isLoading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default DetailArchieveModal;
