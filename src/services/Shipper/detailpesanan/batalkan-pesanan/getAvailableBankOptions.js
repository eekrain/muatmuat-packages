import useSWR from "swr";

import { fetcherMuatparts } from "@/lib/axios";

const useMockData = false; // toggle mock data

const apiResultAvailableBanks = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: [
      {
        id: "94d52de4-c1d0-4896-9725-1fad589db08b",
        value: "BRI",
        code: "BRINIDJA",
        logo: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736740241479.webp",
      },
      {
        id: "05ee8ced-4249-4eea-9007-70ad63f18c7c",
        value: "BNI",
        code: "BNINIDJA",
        logo: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736740223222.webp",
      },
      {
        id: "2f5522eb-9de9-42cc-ad31-038a39d58b55",
        value: "Bank CIMB Niaga",
        code: "BNIAIDJA",
        logo: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736740196710.webp",
      },
      {
        id: "d2839dc4-59d4-42a2-8caa-3f5f51302914",
        value: "Bank Permata",
        code: "BBBAIDJA",
        logo: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736740165999.webp",
      },
      {
        id: "b24f56aa-f60b-4d26-9d35-4b4245bb9afb",
        value: "Bank Danamon",
        code: "BDINIDJA",
        logo: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736740130444.webp",
      },
      {
        id: "4c8595af-4cb6-4512-bc39-c58a4b7500f7",
        value: "BTN",
        code: "BTANIDJA",
        logo: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1738218884621.webp",
      },
      {
        id: "9b8ac212-b827-4c82-9cb4-b3b4bab195a3",
        value: "Bank Panin",
        code: "PINBIDJA",
        logo: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1738218868486.webp",
      },
      {
        id: "2f5384d6-ceaa-4e88-adb4-b76271d76b83",
        value: "Bank Mandiri",
        code: "BMRIIDJA",
        logo: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736740259536.webp",
      },
      {
        id: "400c9bf9-5caa-42cc-b853-7462c6f604f3",
        value: "Bank OCBC NISP",
        code: "NISPIDJA",
        logo: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1738218852890.webp",
      },
      {
        id: "e679dfec-907d-46e7-a2ef-1da21ba78e68",
        value: "Maybank",
        code: "IBBKIDJA",
        logo: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1738218838376.webp",
      },
      {
        id: "23b7fa85-715b-4b97-b1c2-87200b9dfb9e",
        value: "BTPN",
        code: "SUNIIDJA",
        logo: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1738218821074.webp",
      },
      {
        id: "bd993cf5-b1b8-4439-ad70-4a0add1e63e9",
        value: "Bank Mega",
        code: "MEGAIDJA",
        logo: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1738218807319.webp",
      },
      {
        id: "c6261fa8-4e83-4527-b785-3b7c0028187c",
        value: "Bank DBS Indonesia",
        code: "DBSBIDJA",
        logo: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1738218794192.webp",
      },
      {
        id: "4326b698-c650-4359-8179-38fd60646df6",
        value: "Bank UOB Indonesia",
        code: "BBIJIDJA",
        logo: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1738218776562.webp",
      },
      {
        id: "ed2f3613-ead4-47bf-a65b-7e1427dee2ce",
        value: "Bank Jatim",
        code: "PDJTIDJ1",
        logo: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1738218752924.webp",
      },
      {
        id: "f96a849f-9e0f-4b00-a691-7fdde03ef29e",
        value: "Bank Sinarmas",
        code: "SBJKIDJA",
        logo: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1738218738066.webp",
      },
      {
        id: "ee730abd-3ff3-4291-9b07-788b2127dfd9",
        value: "Bank Commonwealth",
        code: "BICNIDJA",
        logo: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1738218397878.webp",
      },
      {
        id: "ef8905d5-7339-40be-b17b-4ad3bad25c54",
        value: "BCA",
        code: "-",
        logo: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736740281046.webp",
      },
    ],
  },
};

export const getAvailableBankOptions = async (url) => {
  let data;

  if (useMockData) {
    data = apiResultAvailableBanks.data?.Data;
  } else {
    const res = await fetcherMuatparts.get(url);
    data = res.data?.Data;
  }

  if (!data) return [];

  // Map the data to the desired { value, label } format
  return data.map((val) => ({
    value: val?.id,
    label: val?.value,
  }));
};

export const useGetAvailableBankOptions = () => {
  return useSWR("v1/muatparts/banks", getAvailableBankOptions);
};
