// a. Buat fungsi untuk kirim request cancel-fleet
export const cancelFleet = async (orderId, payload) => {
  // b. karena ini mock, kita return mock response saja
  console.log("API CALLED: cancelFleet", { orderId, payload });
  await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate network delay
  // throw new Error("This is a mock error"); // uncomment to test error case
  return {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: null,
  };

  // c. jika sudah ada api asli, ganti dengan ini:
  // const response = await fetcherMuatrans.post(
  //   `/api/v1/cs/orders/${orderId}/fleets/cancel`,
  //   payload
  // );
  // return response.data;
};
