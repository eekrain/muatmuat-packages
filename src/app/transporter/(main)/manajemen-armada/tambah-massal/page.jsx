import { Info } from "lucide-react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from "@/components/Modal/Modal";
import PageTitle from "@/components/PageTitle/PageTitle";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";

import TambahExcel from "./tambah-excel";

export default function TambahMassal() {
  return (
    <div className="my-6 max-h-screen w-full space-y-4">
      {/* Header  */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PageTitle className="mb-0" withBack={false}>
            Tambah Armada Massal
          </PageTitle>
          <Modal>
            <ModalTrigger>
              <Info className="size-5" />
            </ModalTrigger>
            <ModalContent className="w-modal-small">
              <ModalHeader size="small" />
            </ModalContent>
          </Modal>
        </div>
      </div>

      {/* Tabs */}
      <Tabs className="w-full" defaultValue="tambah_armada_excel">
        <TabsList className="w-8/12">
          <TabsTriggerWithSeparator
            value="tambah_armada_excel"
            activeColor="primary-700"
          >
            Tambah Armada Dengan Excel
          </TabsTriggerWithSeparator>
          <TabsTriggerWithSeparator
            value="tambah_armada_massal"
            activeColor="primary-700"
          >
            Tambah Armada Massal
          </TabsTriggerWithSeparator>
          <TabsTriggerWithSeparator value="draft" activeColor="primary-700">
            Draft
          </TabsTriggerWithSeparator>
        </TabsList>

        <TabsContent value="tambah_armada_excel" className="pt-4">
          <TambahExcel />
        </TabsContent>
        <TabsContent
          value="tambah_armada_massal"
          className="pt-4"
        ></TabsContent>
        <TabsContent value="draft" className="pt-4"></TabsContent>
      </Tabs>
    </div>
  );
}
