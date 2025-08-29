import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

const isMockUploadFile = true;

const mockUploadFileResponse = {
  data: {
    Message: {
      Code: 201,
      Text: "Created",
    },
    Data: {
      fileUrl:
        "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1753863236033.webp",
      fileName: "grace-ashcroft.png",
      fileSize: 1152396,
    },
    Type: "/v1/upload/files",
  },
};

export const uploadFile = async (file) => {
  if (isMockUploadFile) {
    return mockUploadFileResponse.data;
  }

  const formData = new FormData();
  formData.append("file", file);

  const result = await fetcherMuatrans.post("v1/upload/files", formData);
  return result?.data;
};

export const useUploadFile = () => {
  return useSWRMutation("v1/upload/files", async (url, { arg: file }) => {
    if (isMockUploadFile) {
      return mockUploadFileResponse.data;
    }
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetcherMuatrans.post(url, formData);
    return response.data;
  });
};
