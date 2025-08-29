import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

/**
 * Reusable SWR data fetching hook using axios.
 * @template T
 * @param {string | null} key - The SWR key (usually the API endpoint).
 * @param {import('xior').Xior} [customFetcher=fetcherMuatrans] - The custom axios instance.
 * @param {import('swr').SWRConfiguration} [options] - SWR options.
 * @returns {import('swr').SWRResponse<T, any>}
 */
export function useSWRHook(
  key,
  customFetcher = fetcherMuatrans,
  axiosOptions = {},
  swrOptions = {}
) {
  const fetcher = async (url) => {
    const res = await customFetcher.get(url, axiosOptions);
    return res.data;
  };
  return useSWR(key, fetcher, swrOptions);
}

/**
 * Reusable SWR mutation hook using axios.
 * @template T
 * @param {string} key - The SWR key (usually the API endpoint).
 * @param {"POST"|"PUT"|"PATCH"|"DELETE"} [method="POST"] - HTTP method.
 * @param {import('swr/mutation').SWRMutationConfiguration} [options] - SWR mutation options.
 * @returns {{
 *   trigger: (data: any) => Promise<T>,
 *   isMutating: boolean,
 *   data: T | undefined,
 *   error: any,
 *   reset: () => void
 * }}
 */
export function useSWRMutateHook(
  key,
  method = "POST",
  customFetcher = fetcherMuatrans,
  axiosOptions = {},
  swrOptions = {}
) {
  const fetcher = async (url, { arg }) => {
    const res = await customFetcher[method.toLowerCase()](
      url,
      arg,
      axiosOptions
    );
    return res.data;
  };
  const { trigger, isMutating, data, error, reset } = useSWRMutation(
    key,
    fetcher,
    swrOptions
  );
  return { trigger, isMutating, data, error, reset };
}
