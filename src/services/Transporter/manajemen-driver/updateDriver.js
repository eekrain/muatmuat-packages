import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

export const useUpdateDriver = (id) => {
  return useSWRMutation(
    `/v1/drivers/${id}`,

    (url, { arg }) => {
      return fetcherMuatrans.put(url, arg);
    }
  );
};
