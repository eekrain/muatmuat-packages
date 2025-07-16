"use client";

import ArmadaContainer from "@/container/Transporter/Armada/ArmadaContainer";
import EmptyArmada from "@/container/Transporter/Armada/EmptyArmada";
import { useGetActiveVehiclesData } from "@/services/Transporter/manajemen-armada/getActiveVehiclesData";

const Page = () => {
  const { data } = useGetActiveVehiclesData();

  const vehicles = data?.vehicles || [];

  if (!!vehicles.length) return <ArmadaContainer vehicles={vehicles} />;

  return <EmptyArmada />;
};
export default Page;
