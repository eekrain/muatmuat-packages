"use client";

import { useParams } from "next/navigation";

const Page = () => {
  const { uuid } = useParams();

  return <div>Test {uuid}</div>;
};
export default Page;
