import useSWR from "swr";
import xior from "xior";

/**
 * Fetcher function for getting the list of master banks.
 * Logika Basic Auth didefinisikan langsung di sini menggunakan xior.
 * @param {Array} key - The SWR key array, [url, params].
 * @returns {Promise<object>} A promise that resolves to the API response data.
 */
export const getMasterBanks = async ([url, params]) => {
  const USERNAME_BASIC = "az_muattrans";
  const PASSWORD_BASIC = "Zci01Y4zh2IHCupULvXbTdDM";
  const base64Credentials = Buffer.from(
    `${USERNAME_BASIC}:${PASSWORD_BASIC}`
  ).toString("base64");

  const baseURL = process.env.NEXT_PUBLIC_MUATRANS_API;
  const fullURL = `${baseURL}${url}`;

  try {
    const response = await xior.get(fullURL, {
      params,
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Gagal mengambil data Bank:",
      error.response?.data || error.message
    );
    throw error.response?.data || new Error("Terjadi kesalahan pada server");
  }
};

/**
 * SWR hook for fetching master data of banks.
 * @param {object} params - An object containing query parameters.
 * @returns {{data: object, error: any, isLoading: boolean, mutate: function}}
 */
export const useGetMasterBanks = (params) => {
  const key = params ? ["/v1/cs/master/banks", params] : null;

  const { data, error, isLoading, mutate } = useSWR(key, getMasterBanks);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
