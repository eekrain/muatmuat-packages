import DevLoginContainer from "@/container/Shared/DevLoginContainerLocal";

const Page = () => {
  return <DevLoginContainer onSuccessRedirect="/user" />;
};
export default Page;
