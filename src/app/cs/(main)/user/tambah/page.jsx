import Card from "@/components/Card/Card";
import DataPerusahaan from "@/container/CS/User/Tambah/Web/DataPerusahaan/DataPerusahaan";

const Page = () => {
  return (
    <Card className={"border-none p-6"}>
      <h2 className="mb-6 text-lg font-semibold">Data Perusahaan</h2>
      <>
        <DataPerusahaan />
      </>
    </Card>
  );
};
export default Page;
