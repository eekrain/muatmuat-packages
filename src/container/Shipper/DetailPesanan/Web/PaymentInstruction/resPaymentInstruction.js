export const resPaymentInstruction = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: [
    {
      channel: "VA",
      // {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0731 */}
      category: "LabeldetailPesananVirtualAccount",
      icon: "va-channel-icon.png",
      guide:
        "LabeldetailPesananPilihmetodepembayaranVirtualAccountuntukmendapatkannomorVirtualAccountdanselesaikanpembayaranmelaluiATMInternetBankingatauMobileBanking.",
    },
    {
      channel: "CREDIT_CARD",
      // {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0731 */}
      category: "LabeldetailPesananKartuKredit",
      icon: "credit-card-channel-icon.png",
      // {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0731 */}
      guide:
        "LabeldetailPesananPilihmetodepembayaranKartuKredituntukmelakukanpembayarandengankartukreditVisaatauMastercard.",
    },
  ],
  Type: "/v1/payment/methods",
};
