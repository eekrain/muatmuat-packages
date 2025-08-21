import { useState } from "react";

import PropTypes from "prop-types";

import { Alert } from "@/components/Alert/Alert";
import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { toast } from "@/lib/toast";
import { useUpdatePicContacts } from "@/services/Transporter/updatePicContacts";

// Pastikan komponen Modal diimpor

// --- Mock Data Awal ---
const initialPicData = [
  {
    id: "8543241f-54d0-42f2-a9a7-74b187c31579",
    picOrder: 1,
    picName: "Ahmad Budiman",
    picPosition: "Operations Manager",
    phoneNumber: "628064749070",
    isActive: true,
  },
  {
    id: "5d66edce-0fb3-4c10-8a97-f3b4c2b28f6a",
    picOrder: 2,
    picName: "Sari Dewi",
    picPosition: "Customer Service Manager",
    phoneNumber: "628064749071",
    isActive: true,
  },
  {
    id: "86028452-1cb6-407b-9d4f-37aadf5d38c3",
    picOrder: 3,
    picName: "Budi Santoso",
    picPosition: "Technical Support",
    phoneNumber: "628064749072",
    isActive: true,
  },
];

// --- Confirmation Modal (Tidak perlu diubah) ---
const modalConfig = {
  confirmSave: {
    text: "Apakah kamu yakin ingin menyimpan perubahan?",
    yesButtonVariant: "muattrans-primary",
    noButtonVariant: "muattrans-primary-secondary",
  },
  confirmCancel: {
    text: "Apakah kamu yakin ingin membatalkan perubahan?",
    yesButtonVariant: "muattrans-primary-secondary",
    noButtonVariant: "muattrans-primary",
  },
};

const ConfirmationModal = ({
  open,
  onOpenChange,
  type = "confirmSave",
  onConfirm,
  onCancel,
}) => {
  const currentConfig = modalConfig[type];

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="w-modal-small" type="muatparts">
        <ModalHeader size="small" />
        <div className="flex flex-col items-center gap-y-6 px-6 pb-9 pt-8">
          <p className="text-center text-base font-medium text-neutral-900">
            {currentConfig.text}
          </p>
          <div className="flex w-full items-center justify-center gap-x-2">
            <Button
              variant={currentConfig.noButtonVariant}
              onClick={onCancel}
              className="w-[195px]"
              type="muatparts"
            >
              Tidak
            </Button>
            <Button
              variant={currentConfig.yesButtonVariant}
              onClick={onConfirm}
              className="w-[195px]"
              type="muatparts"
            >
              Ya
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["confirmSave", "confirmCancel"]),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

// --- Helper Functions (Tidak perlu diubah) ---
const ensureThreePICData = (existingData) => {
  const picArray = [];
  for (let i = 0; i < 3; i++) {
    const existingPic = existingData.find((pic) => pic.picOrder === i + 1);
    if (existingPic) {
      picArray.push({ ...existingPic });
    } else {
      picArray.push({
        id: `temp-${i + 1}`,
        picOrder: i + 1,
        picName: "",
        picPosition: "",
        phoneNumber: "",
        isActive: true,
      });
    }
  }
  return picArray;
};

const showSuccessCopyToast = () => {
  toast.success("Kontak PIC Berhasil disalin");
};

// --- Sub-components (Tidak perlu diubah) ---
const PicContactRow = ({ index, pic }) => (
  <div
    className={`grid grid-cols-[1fr,2fr,2fr,2fr,auto] items-center gap-x-4 px-9 py-4 ${
      index % 2 === 0 ? "bg-neutral-100" : "bg-white"
    }`}
  >
    <div className="flex items-center gap-3 text-sm font-medium text-neutral-600">
      <IconComponent
        src="/icons/user16.svg"
        alt="PIC Icon"
        width={24}
        height={24}
      />
      <span>PIC {index + 1}</span>
    </div>
    <span className="text-sm font-semibold text-neutral-900">
      {pic.picName}
    </span>
    <span className="text-sm font-medium text-neutral-600">
      {pic.picPosition}
    </span>
    <span className="text-sm font-medium text-neutral-900">
      {pic.phoneNumber}
    </span>
    <div className="me-7 flex items-center justify-end gap-4">
      <button
        onClick={showSuccessCopyToast}
        aria-label={`Copy phone number for ${pic.picName}`}
        className="text-primary-700 transition-opacity hover:opacity-80"
      >
        <IconComponent
          src="/icons/salin.svg"
          alt="Copy Icon"
          width={20}
          height={20}
        />
      </button>
      <button
        aria-label={`Contact ${pic.picName} on WhatsApp`}
        className="text-primary-700 transition-opacity hover:opacity-80"
      >
        <IconComponent
          src="/icons/verify-whatsapp.svg"
          alt="WhatsApp Icon"
          width={20}
          height={20}
        />
      </button>
    </div>
  </div>
);

const PICFormSection = ({
  index,
  pic,
  handleInputChange,
  isRequired,
  className,
  validationErrors = {},
}) => (
  <div className={`px-9 py-4 ${className}`}>
    <div className="grid grid-cols-1 gap-6">
      <FormContainer className={className}>
        <FormLabel required={isRequired}>{`Nama PIC ${index + 1}`}</FormLabel>
        <Input
          name="picName"
          value={pic.picName}
          onChange={(e) => handleInputChange(index, e)}
          placeholder={`Nama PIC ${index + 1}`}
          status={validationErrors[`${index}-picName`] ? "error" : "default"}
          errorMessage={validationErrors[`${index}-picName`]}
        />
      </FormContainer>
      <FormContainer className={className}>
        <FormLabel
          required={isRequired}
        >{`Jabatan PIC ${index + 1}`}</FormLabel>
        <Input
          name="picPosition"
          value={pic.picPosition}
          onChange={(e) => handleInputChange(index, e)}
          placeholder={`Jabatan PIC ${index + 1}`}
          status={
            validationErrors[`${index}-picPosition`] ? "error" : "default"
          }
          errorMessage={validationErrors[`${index}-picPosition`]}
        />
      </FormContainer>
      <FormContainer className={className}>
        <FormLabel required={isRequired}>{`No. HP PIC ${index + 1}`}</FormLabel>
        <Input
          name="phoneNumber"
          value={pic.phoneNumber}
          onChange={(e) => handleInputChange(index, e)}
          placeholder={"Contoh : 08xxxxxxxxxx"}
          status={
            validationErrors[`${index}-phoneNumber`] ? "error" : "default"
          }
          errorMessage={validationErrors[`${index}-phoneNumber`]}
        />
      </FormContainer>
    </div>
  </div>
);

// --- Main Component (MODIFIED) ---
const PicContactInfo = ({ picContacts, banks, mutate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [pics, setPics] = useState(picContacts || initialPicData);
  const [formState, setFormState] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // --- ⬇️ TAMBAHAN: State untuk Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("confirmSave");

  // --- API Hook ---
  const { trigger: updatePicContactsAPI, isMutating: isUpdating } =
    useUpdatePicContacts();

  // Validasi Form (Tidak diubah)
  const validateForm = (formData) => {
    const errors = {};
    const pic1 = formData[0];
    if (!pic1.picName.trim()) {
      errors["0-picName"] = "Nama PIC 1 wajib diisi";
    }
    if (!pic1.picPosition.trim()) {
      errors["0-picPosition"] = "Jabatan PIC 1 wajib diisi";
    }
    if (!pic1.phoneNumber.trim()) {
      errors["0-phoneNumber"] = "No. HP PIC 1 wajib diisi";
    }

    formData.forEach((pic, index) => {
      if (index > 0) {
        const hasName = pic.picName.trim() !== "";
        const hasPosition = pic.picPosition.trim() !== "";
        const hasPhone = pic.phoneNumber.trim() !== "";

        if (hasName || hasPosition || hasPhone) {
          if (!hasName)
            errors[`${index}-picName`] = `Nama PIC ${index + 1} wajib diisi`;
          if (!hasPosition)
            errors[`${index}-picPosition`] =
              `Jabatan PIC ${index + 1} wajib diisi`;
          if (!hasPhone)
            errors[`${index}-phoneNumber`] =
              `No. HP PIC ${index + 1} wajib diisi`;
        }
      }
    });

    const pic2 = formData[1];
    const pic3 = formData[2];
    const isPic2Empty =
      !pic2.picName.trim() &&
      !pic2.picPosition.trim() &&
      !pic2.phoneNumber.trim();
    const isPic3Filled =
      pic3.picName.trim() || pic3.picPosition.trim() || pic3.phoneNumber.trim();

    if (isPic3Filled && isPic2Empty) {
      const errorMessage = "PIC 2 harus diisi sebelum mengisi PIC 3";
      errors["1-picName"] = errorMessage;
      errors["1-picPosition"] = errorMessage;
      errors["1-phoneNumber"] = errorMessage;
    }

    return errors;
  };

  const handleEdit = () => {
    const picDataForEditing = ensureThreePICData(pics);
    setFormState(picDataForEditing);
    setValidationErrors({});
    setIsEditing(true);
  };

  // --- ⬇️ MODIFIKASI: Fungsi untuk menangani aksi dari modal ---
  const executeCancel = () => {
    setFormState(null);
    setValidationErrors({});
    setIsEditing(false);
    setIsModalOpen(false); // Tutup modal
    toast.success("Berhasil membtalkan perubahan kontak PIC");
  };

  const executeSave = async () => {
    const errors = validateForm(formState);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsModalOpen(false); // Tetap tutup modal meskipun validasi gagal
      return;
    }
    setValidationErrors({});

    const filledPicData = formState
      .filter(
        (pic) =>
          pic.picName.trim() !== "" ||
          pic.picPosition.trim() !== "" ||
          pic.phoneNumber.trim() !== ""
      )
      .map((pic) => {
        if (pic.id.startsWith("temp-")) {
          return {
            ...pic,
            id: `new-${Date.now()}-${pic.picOrder}`,
          };
        }
        return pic;
      });

    try {
      // Transform data to match API contract
      const apiPayload = {
        picContacts: filledPicData.map((pic) => ({
          picOrder: pic.picOrder,
          picName: pic.picName,
          picPosition: pic.picPosition,
          phoneNumber: pic.phoneNumber,
        })),
      };

      const response = await updatePicContactsAPI(apiPayload);

      if (response?.data?.Message?.Code === 200) {
        // Update local state with response data
        if (response.data.Data?.picContacts) {
          setPics(response.data.Data.picContacts);
        } else {
          setPics(filledPicData);
        }

        setIsEditing(false);
        setFormState(null);
        setIsModalOpen(false);
        toast.success("Berhasil menyimpan perubahan kontak PIC");
        mutate();
      }
    } catch (error) {
      console.error("Error updating PIC contacts:", error);

      // Handle specific API error responses
      if (error?.response?.data?.Message) {
        const errorMessage = error.response.data.Message.Text;
        toast.error(errorMessage);

        // Handle validation errors from API
        if (error.response.data.Data?.errors) {
          const apiErrors = {};
          error.response.data.Data.errors.forEach((err) => {
            if (err.field && err.message) {
              // Convert API field format to component format
              const fieldMatch = err.field.match(/picContacts\[(\d+)\]\.(\w+)/);
              if (fieldMatch) {
                const [, index, fieldName] = fieldMatch;
                apiErrors[`${index}-${fieldName}`] = err.message;
              }
            }
          });
          setValidationErrors(apiErrors);
        }
      } else {
        toast.error("Gagal menyimpan perubahan kontak PIC");
      }

      setIsModalOpen(false);
    }
  };

  // --- ⬇️ MODIFIKASI: Handler tombol yang sekarang hanya membuka modal ---
  const handleCancelClick = () => {
    setModalType("confirmCancel");
    setIsModalOpen(true);
  };

  const handleSaveClick = () => {
    setModalType("confirmSave");
    setIsModalOpen(true);
  };

  // --- ⬇️ TAMBAHAN: Handler untuk konfirmasi modal ---
  const handleConfirmAction = () => {
    if (modalType === "confirmSave") {
      executeSave();
    } else {
      // 'confirmCancel'
      executeCancel();
    }
  };

  const handleFormInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedFormState = formState.map((pic, i) =>
      i === index ? { ...pic, [name]: value } : pic
    );
    setFormState(updatedFormState);

    const errorKey = `${index}-${name}`;
    if (validationErrors[errorKey]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Tampilan Edit Form
  if (isEditing) {
    return (
      <>
        {" "}
        {/* ⬇️ Gunakan Fragment agar bisa merender modal */}
        <Card className="max-h-fit border-neutral-400 bg-white p-0">
          <div className="flex items-end justify-between gap-3 border-b border-neutral-200 p-6">
            <div className="">
              <h1 className="text-xl font-bold text-neutral-900">
                Data Kontak PIC Transporter
              </h1>
              <Alert
                variant="warning"
                className="-ms-2 mt-2 flex items-center bg-transparent text-xs text-neutral-600"
              >
                <IconComponent
                  src="/icons/megaphone.svg"
                  alt="Information Icon"
                  width={16}
                  height={16}
                  className="text-yellow-500"
                />
                <span className="text-xs text-neutral-800">
                  Data PIC Transporter akan ditampilkan pada profilmu di
                  pengguna lainnya untuk menghubungi kamu
                </span>
              </Alert>
            </div>
            <div className="flex shrink-0 gap-3">
              {/* ⬇️ onClick diubah ke handleCancelClick */}
              <Button
                variant="muattrans-primary-secondary"
                className="w-28"
                onClick={handleCancelClick}
              >
                Batal
              </Button>
              {/* ⬇️ onClick diubah ke handleSaveClick */}
              <Button
                variant="muattrans-warning"
                className="text-muat-trans-secondary-900"
                onClick={handleSaveClick}
                disabled={isUpdating}
              >
                {isUpdating ? "Menyimpan..." : "Simpan Data"}
              </Button>
            </div>
          </div>
          <div>
            {formState.map((pic, index) => (
              <PICFormSection
                key={`pic-form-${index}`}
                index={index}
                pic={pic}
                handleInputChange={handleFormInputChange}
                isRequired={index === 0}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                validationErrors={validationErrors}
              />
            ))}
          </div>
        </Card>
        {/* ⬇️ TAMBAHAN: Render komponen modal */}
        <ConfirmationModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          type={modalType}
          onConfirm={handleConfirmAction}
          onCancel={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  // Tampilan Display Card (Default)
  return (
    <Card className="max-h-fit border-neutral-400 bg-white p-0">
      <div className="flex items-start justify-between p-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-neutral-900">
            Data Kontak PIC Transporter
          </h2>
          <Alert
            variant="warning"
            className="flex items-center gap-2 bg-transparent p-0"
          >
            <IconComponent
              src="/icons/megaphone.svg"
              alt="Information Icon"
              width={16}
              height={16}
              className="text-yellow-500"
            />
            <span className="text-xs font-medium text-neutral-800">
              Data PIC Transporter akan ditampilkan pada profilmu di pengguna
              lainnya untuk menghubungi kamu
            </span>
          </Alert>
        </div>
        <Button
          onClick={handleEdit}
          variant="muattrans-primary"
          className="flex-shrink-0 px-8 py-2"
        >
          Ubah Data
        </Button>
      </div>
      <div className="mt-2 border-t border-neutral-200">
        {pics.map((pic, index) => (
          <PicContactRow key={pic.id} index={index} pic={pic} />
        ))}
      </div>
    </Card>
  );
};

PicContactInfo.propTypes = {
  picContacts: PropTypes.array,
  banks: PropTypes.array,
};

export default PicContactInfo;
