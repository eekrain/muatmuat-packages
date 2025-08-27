import { TabsContent } from "@/components/Tabs/Tabs";

import RingkasanPesananBody from "@/container/CS/DetailPesanan/TabRingkasanPesanan/RingkasanPesananBody";
import RingkasanPesananHeader from "@/container/CS/DetailPesanan/TabRingkasanPesanan/RingkasanPesananHeader";

export const TabRingkasanPesanan = ({ data }) => {
  return (
    <TabsContent className="flex flex-col gap-y-4" value="ringkasan-pesanan">
      <RingkasanPesananHeader data={data} />
      <RingkasanPesananBody data={data} />
    </TabsContent>
  );
};
