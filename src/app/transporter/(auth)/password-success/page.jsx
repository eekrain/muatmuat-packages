import StatusPage from "@/container/Transporter/Auth/components/StatusPage/StatusPage";

const Page = () => {
  return (
    <StatusPage
      type="success"
      title="Password Berhasil Diubah"
      description="Silahkan masuk kedalam akun muatrans kamu dengan menggunakan Password baru"
      buttonLabel="Masuk ke Muatrans"
      buttonHref="/login"
    />
  );
};

export default Page;
