import DevLoginContainer from "@/container/Shared/DevLoginContainer";

const Page = () => {
  return <DevLoginContainer onSuccessRedirect="/user" />;
};
export default Page;
