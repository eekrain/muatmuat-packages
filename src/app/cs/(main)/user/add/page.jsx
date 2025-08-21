"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Card from "@/components/Card/Card";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import Form from "@/container/CS/User/Tambah/Web/Form";
import { TabRegister } from "@/container/CS/User/Tambah/Web/TabRegister";
import mapZustandToApiPayload from "@/container/CS/User/Tambah/helpers/mapZustandToApiPayload";
import { useSWRMutateHook } from "@/hooks/use-swr";
import { toast } from "@/lib/toast";
import { useCreateTransporter } from "@/services/CS/register/createTransporter";
import { useTransporterFormStore } from "@/store/CS/forms/registerTransporter";

const Page = () => {
  const FORM_KEY = "newTransporterRegistration";
  const persistentItemsStatus = useTransporterFormStore(
    (state) => state.tabsStatus[FORM_KEY]
  );
  const setPersistentTabStatus = useTransporterFormStore(
    (state) => state.setTabStatus
  );
  const getForm = useTransporterFormStore((state) => state.getForm);
  const clearRegistrationData = useTransporterFormStore(
    (state) => state.clearRegistrationData
  );

  const [displayItemsStatus, setDisplayItemsStatus] = useState(
    persistentItemsStatus ?? ["incomplete", "incomplete", "incomplete"]
  );

  const [activeIdx, setActiveIdx] = useState(0);
  const breadcrumbData = [
    { name: "Daftar User", href: "/user" },
    { name: "Transporter", href: "/user/transporter" },
    { name: "Tambah Transporter" },
  ];

  useEffect(() => {
    setDisplayItemsStatus(
      persistentItemsStatus ?? ["incomplete", "incomplete", "incomplete"]
    );
  }, [persistentItemsStatus]);

  useEffect(() => {
    console.log(
      `Tab changed to index ${activeIdx}. Re-syncing display status with persistent status.`
    );
    setDisplayItemsStatus(
      persistentItemsStatus ?? ["incomplete", "incomplete", "incomplete"]
    );
  }, [activeIdx, persistentItemsStatus]);

  const formData = getForm(FORM_KEY);

  useEffect(() => {
    console.log("Running initial status validation...");
    const formData = getForm(FORM_KEY);
    if (!formData) {
      return;
    }

    const validatedStatuses = ["incomplete", "incomplete", "incomplete"];
    const section1Required = [
      "registrantName",
      "companyName",
      "registrantEmail",
    ];
    const isSection1Complete = section1Required.every(
      (field) => !!formData[field]
    );
    validatedStatuses[0] = isSection1Complete ? "finished" : "incomplete";
    const section2Required = ["nibNumber", "npwpNumber", "ktpNumber"];
    const isSection2Complete = section2Required.every(
      (field) => !!formData[field]
    );
    validatedStatuses[1] = isSection2Complete ? "finished" : "incomplete";
    const section3Required = ["contacts.0.name", "contacts.0.phone"];
    const isSection3Complete = section3Required.every((path) => {
      const value = path.split(".").reduce((o, i) => o?.[i], formData);
      return !!value;
    });
    validatedStatuses[2] = isSection3Complete ? "finished" : "incomplete";
    if (
      JSON.stringify(validatedStatuses) !== JSON.stringify(displayItemsStatus)
    ) {
      setPersistentTabStatus(FORM_KEY, validatedStatuses);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = useRouter();

  const { trigger: createTransporter, isMutating: isCreating } =
    useCreateTransporter({
      onSuccess: () => {
        toast.success("Berhasil menambahkan Transporter");
        clearRegistrationData(FORM_KEY);
        router.push("/user");
      },
      onError: (error) => {
        const message =
          error?.response?.data?.Message?.Text ||
          "Gagal menambahkan transporter.";
        toast.error(message);
      },
    });

  const [isConfirmAddOpen, setIsConfirmAddOpen] = useState(false);

  const handleConfirmAddTransporter = () => {
    if (!formData) {
      toast.error("Data form tidak ditemukan.");
      setIsConfirmAddOpen(false);
      return;
    }

    const dataToSubmit = mapZustandToApiPayload(formData);

    if (dataToSubmit) {
      createTransporter(dataToSubmit);
    } else {
      toast.error("Gagal memproses data untuk dikirim.");
    }

    setIsConfirmAddOpen(false);
  };

  const handleSectionSave = (sectionIndex) => {
    const newStatus = [...displayItemsStatus];
    newStatus[sectionIndex] = "finished";

    setDisplayItemsStatus(newStatus);
    setPersistentTabStatus(FORM_KEY, newStatus);

    const isAllFinishedNow = newStatus.every((status) => status === "finished");

    if (isAllFinishedNow) {
      console.log("All sections are finished.");

      if (sectionIndex < 2) {
        setActiveIdx(sectionIndex + 1);
      }
      return;
    }

    const findNextIncompleteIndex = (currentIdx, statuses) => {
      const totalSections = statuses.length;
      for (let i = 1; i < totalSections; i++) {
        const nextIdx = (currentIdx + i) % totalSections;
        if (statuses[nextIdx] === "incomplete") {
          return nextIdx; // Ditemukan!
        }
      }
      return currentIdx;
    };

    const nextIncompleteIdx = findNextIncompleteIndex(sectionIndex, newStatus);

    console.log(
      `Saved section ${sectionIndex}, moving to next incomplete section: ${nextIncompleteIdx}`
    );
    setActiveIdx(nextIncompleteIdx);
  };

  const handleFormChange = (sectionIndex) => {
    if (displayItemsStatus[sectionIndex] === "finished") {
      const newDisplayStatus = [...displayItemsStatus];
      newDisplayStatus[sectionIndex] = "incomplete";
      setDisplayItemsStatus(newDisplayStatus);
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] px-10">
      <BreadCrumb className={"mb-4 mt-6"} data={breadcrumbData} />
      <PageTitle>Tambah Transporter</PageTitle>
      <div className="flex w-full items-start gap-6 pb-8">
        <Form
          activeIdx={activeIdx}
          onSectionSave={handleSectionSave}
          onFormChange={handleFormChange}
          setActiveIdx={setActiveIdx}
        />
        <Card className={"w-max rounded-xl border-none pt-6"}>
          <TabRegister
            activeIdx={activeIdx}
            onAddTransporter={() => setIsConfirmAddOpen(true)}
            setActiveIdx={setActiveIdx}
            itemsStatus={displayItemsStatus}
          />
        </Card>
      </div>
      <ConfirmationModal
        isOpen={isConfirmAddOpen}
        setIsOpen={setIsConfirmAddOpen}
        title={{ text: "Tambahkan Transporter" }}
        appear
        description={{
          text: (
            <span>
              Apakah Kamu yakin ingin menambahkan Transporter{" "}
              <strong>{formData?.companyName}?</strong>
              <br />
              <br />
              Harap hubungi transporter terkait setelah menambahkan data untuk
              melanjutkan proses verifikasi melalui pesan email yang dikirim
              setelah data berhasil ditambahkan.
            </span>
          ),
        }}
        cancel={{
          text: "Batal",
          onClick: () => setIsConfirmAddOpen(false),
          classname: "!px-12",
        }}
        confirm={{
          text: isCreating ? "Menambahkan..." : "Tambahkan",
          onClick: handleConfirmAddTransporter,
          disabled: isCreating,
        }}
      />
    </div>
  );
};

export default Page;
