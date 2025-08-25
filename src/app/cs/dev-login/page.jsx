import DevLoginContainerLocal from "@/container/Shared/DevLoginContainerLocal";

const Page = () => {
  return <DevLoginContainerLocal onSuccessRedirect="/user" />;
};
export default Page;
