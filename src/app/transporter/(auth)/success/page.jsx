import StatusPage from "@/container/Transporter/Auth/components/StatusPage/StatusPage";

const Page = () => {
  return (
    <StatusPage
      type="success"
      title="Selamat Pendaftaran Kamu Berhasil"
      description="Akun Transporter Muatrans Kamu berhasil terdaftar dan terverifikasi"
      buttonLabel="Masuk ke Muatrans"
      appearence={{
        descriptionClassName: "!max-w-xs",
      }}
      buttonHref="/login"
    />
  );
};

export default Page;
