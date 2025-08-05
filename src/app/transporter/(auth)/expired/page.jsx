import StatusPage from "@/container/Transporter/Auth/components/StatusPage/StatusPage";

const Page = () => {
  return (
    <StatusPage
      type="failed"
      title="Proses Verifikasi Tidak Dapat Dilakukan Karena Link Expired"
      description={
        <span>
          Silahkan hubungi Admin <strong>Muatrans</strong> untuk mendapatkan
          link verifikasi baru
        </span>
      }
      appearence={{
        containerClassName: "!max-w-4xl",
        descriptionClassName: "!max-w-4xl",
      }}
    />
  );
};

export default Page;
