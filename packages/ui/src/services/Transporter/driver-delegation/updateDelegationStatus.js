import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

const isMockUpdateDelegationStatus = true;

const mockUpdateDelegationStatusResponse = (delegationEnabled) => ({
  data: {
    Message: {
      Code: 200,
      Text: "Driver delegation status updated successfully",
    },
    Data: {
      delegationEnabled: delegationEnabled,
      updatedAt: new Date().toISOString(),
    },
    Type: "UPDATE_DRIVER_DELEGATION",
  },
});

export const updateDriverDelegationStatus = async (
  driverId,
  delegationEnabled
) => {
  if (isMockUpdateDelegationStatus) {
    return mockUpdateDelegationStatusResponse(delegationEnabled).data;
  }

  const result = await fetcherMuatrans.put(
    `v1/drivers/delegation-status/${driverId}`,
    {
      delegationEnabled: delegationEnabled,
    }
  );
  return result?.data;
};

export const useUpdateDriverDelegationStatus = () => {
  return useSWRMutation("driver-delegation-status", async (_, { arg }) => {
    const { driverId, delegationEnabled } = arg;
    if (isMockUpdateDelegationStatus) {
      return mockUpdateDelegationStatusResponse(delegationEnabled).data.Data;
    }
    const result = await fetcherMuatrans.put(
      `v1/drivers/delegation-status/${driverId}`,
      { delegationEnabled }
    );
    return result?.data?.Data || {};
  });
};
