import DevLoginContainerLocal from "@/container/Shared/DevLoginContainerLocal";

const Page = () => {
  return <DevLoginContainerLocal onSuccessRedirect="/user" mode="cs" />;
};
export default Page;
