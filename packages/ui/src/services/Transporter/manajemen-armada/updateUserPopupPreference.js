// Anggap ini adalah file service untuk mengupdate preferensi
import { fetcherMuatrans } from "@/lib/axios";

const isMockUpdate = true;

const mockUpdateResult = (showPopup) => ({
  Message: {
    Code: 200,
    Text: "User popup preference updated successfully",
  },
  Data: {
    showPopup: showPopup,
    updatedAt: new Date().toISOString(),
  },
  Type: "USER_POPUP_PREFERENCE",
});

export const updateUserPopupPreference = async (showPopup) => {
  const url = "v1/user/popup-preference/import-fleet";
  const payload = { showPopup };

  if (isMockUpdate) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockUpdateResult(showPopup);
  }

  try {
    const result = await fetcherMuatrans.put(url, payload);

    if (!result?.data) {
      throw new Error("Invalid response structure");
    }

    return result.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.Message?.Text || "Failed to update preference"
    );
  }
};
