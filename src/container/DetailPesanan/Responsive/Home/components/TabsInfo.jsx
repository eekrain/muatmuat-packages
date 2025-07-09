import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";

export const TabsInfo = () => {
  return (
    <Tabs className="w-full bg-white" defaultValue={"ringkasan"}>
      <TabsList className="w-full">
        <TabsTriggerWithSeparator value="ringkasan">
          Ringkasan
        </TabsTriggerWithSeparator>
        <TabsTriggerWithSeparator value="informasi-lainnya">
          Informasi Lainnya
        </TabsTriggerWithSeparator>
        <TabsTriggerWithSeparator value="detail-pic" showSeparator={false}>
          Detail PIC
        </TabsTriggerWithSeparator>
      </TabsList>

      <TabsContent value="ringkasan" className="px-4 py-5">
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-neutral-900">
              Informasi Armada
            </h3>
            <div className="flex items-center gap-3">
              <LightboxProvider image="/img/truck.png">
                <LightboxPreview image="/img/truck.png" />
              </LightboxProvider>
              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  Box - Colt Diesel Engkel
                </p>
                <p className="text-sm text-neutral-900">Kebutuhan : 1 Unit</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-neutral-900">
              Waktu Muat
            </h3>
            <p className="text-xs font-semibold text-neutral-900">
              03 Okt 2024 18:00 WIB s/d 04 Okt 2024 08:00 WIB
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="informasi-lainnya" className="p-4">
        <div className="py-8 text-center">
          <p className="text-neutral-500">
            Informasi muatan akan ditampilkan di sini
          </p>
        </div>
      </TabsContent>

      <TabsContent value="detail-pic" className="p-4">
        <div className="py-8 text-center">
          <p className="text-neutral-500">
            Detail PIC akan ditampilkan di sini
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};
