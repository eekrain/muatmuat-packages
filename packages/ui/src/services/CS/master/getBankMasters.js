import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

/**
 * Fetcher function for getting the list of master banks using the pre-configured fetcher.
 * @param {Array} key - The SWR key array, e.g., [url, params].
 * @returns {Promise<object>} A promise that resolves to the API response data.
 */
// 2. Sederhanakan fetcher: Hapus semua logika Basic Auth manual
export const getMasterBanks = ([url, params]) => {
  // 3. Gunakan fetcherMuatransCS. Interceptor-nya akan menangani header Authorization secara otomatis.
  //    Kita tambahkan .then() untuk memastikan SWR menerima langsung `data`-nya,
  //    sesuai perilaku kode asli.
  return fetcherMuatrans.get(url, { params }).then((res) => res.data);
};

/**
 * SWR hook for fetching master data of banks.
 * @param {object} params - An object containing query parameters.
 * @returns {{data: object, error: any, isLoading: boolean, mutate: function}}
 */
// 4. Hook SWR tidak perlu diubah. Ia sekarang menggunakan getMasterBanks versi baru yang lebih bersih.
export const useGetMasterBanks = (params) => {
  // Key tetap "/v1/cs/master/banks" karena baseURL sudah di-set di dalam fetcherMuatransCS.
  const key = params ? ["/v1/cs/master/banks", params] : null;

  const { data, error, isLoading, mutate } = useSWR(key, getMasterBanks);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
