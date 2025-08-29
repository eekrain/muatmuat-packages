import { redirect } from "next/navigation";

const Page = () => {
  // return <LoginContainer />;
  redirect(`/dev-login`);
};
export default Page;
