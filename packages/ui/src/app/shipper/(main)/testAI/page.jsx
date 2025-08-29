"use client";

import { useEffect, useState } from "react";

import { BannerCarousel } from "@/components/BannerCarousel/BannerCarousel";
import Button from "@/components/Button/Button";
import DatetimePicker from "@/components/DatetimePicker/DatetimePicker";
import Checkbox from "@/components/Form/Checkbox";
import IconComponent from "@/components/IconComponent/IconComponent";
import RadioButton from "@/components/Radio/RadioButton";

// First Timer Popup Component
const FirstTimerPopup = ({ isOpen, onClose, onDontShowAgain }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      onDontShowAgain();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div
        className="relative mx-4 max-w-sm rounded-lg bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <div className="text-center">
          <div className="mb-4">
            <IconComponent
              src="/icons/shipping-illustration.svg"
              className="mx-auto h-24 w-24"
            />
          </div>

          <h2 className="mb-2 text-lg font-bold text-gray-900">
            Nikmati Kemudahan Pengiriman dengan Muatrans!
          </h2>

          <p className="mb-6 text-sm text-gray-600">
            Pesan truk kapan saja dengan mudah. Lacak kirimanmu secara real-time
            dan dapatkan rekomendasi truk sesuai muatan!
          </p>

          <div className="mb-4">
            <Checkbox
              checked={dontShowAgain}
              onChange={({ checked }) => setDontShowAgain(checked)}
              label="Jangan tampilkan lagi"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Header Component
const Header = ({
  notificationCount,
  chatCount,
  onMenuClick,
  onNotificationClick,
  onChatClick,
  onBackClick,
}) => {
  const formatCount = (count) => {
    if (count === 0) return null;
    return count > 99 ? "99+" : count.toString();
  };

  return (
    <div className="flex items-center justify-between bg-yellow-400 px-4 py-3">
      <div className="flex items-center gap-3">
        <button onClick={onBackClick} className="text-gray-800">
          <IconComponent src="/icons/arrow-left.svg" className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2">
          <IconComponent src="/icons/muatrans-logo.svg" className="h-8 w-8" />
          <span className="font-bold text-gray-800">muatrans</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onNotificationClick} className="relative">
          <IconComponent
            src="/icons/notification.svg"
            className="h-6 w-6 text-gray-800"
          />
          {formatCount(notificationCount) && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
              {formatCount(notificationCount)}
            </span>
          )}
        </button>

        <button onClick={onChatClick} className="relative">
          <IconComponent
            src="/icons/chat.svg"
            className="h-6 w-6 text-gray-800"
          />
          {formatCount(chatCount) && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
              {formatCount(chatCount)}
            </span>
          )}
        </button>

        <button onClick={onMenuClick}>
          <IconComponent
            src="/icons/hamburger-menu.svg"
            className="h-6 w-6 text-gray-800"
          />
        </button>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ isOpen, onClose, orderCount }) => {
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  const formatCount = (count) => {
    if (count === 0) return null;
    return count > 99 ? "99+" : count.toString();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="h-full w-80 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <Header
          notificationCount={12}
          chatCount={3}
          onBackClick={onClose}
          onMenuClick={() => {}}
          onNotificationClick={() => {}}
          onChatClick={() => {}}
        />

        <div className="p-4">
          {/* Profile Section */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-300">
              <img
                src="/images/profile-avatar.jpg"
                alt="Profile"
                className="h-12 w-12 rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Noel Gallagher</h3>
              <button className="text-sm text-blue-600">Lihat Profil →</button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <IconComponent src="/icons/orders.svg" className="h-5 w-5" />
                <span className="text-gray-900">Daftar Pesanan</span>
              </div>
              {formatCount(orderCount) && (
                <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
                  {formatCount(orderCount)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50">
              <IconComponent src="/icons/help.svg" className="h-5 w-5" />
              <span className="text-gray-900">Pusat Bantuan</span>
            </div>

            <div>
              <button
                onClick={() => setSettingsExpanded(!settingsExpanded)}
                className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <IconComponent
                    src="/icons/settings.svg"
                    className="h-5 w-5"
                  />
                  <span className="text-gray-900">Pengaturan</span>
                </div>
                <IconComponent
                  src="/icons/chevron-down.svg"
                  className={`h-4 w-4 transition-transform ${settingsExpanded ? "rotate-180" : ""}`}
                />
              </button>

              {settingsExpanded && (
                <div className="ml-8 space-y-2 pb-2">
                  <button className="block w-full rounded-lg p-2 text-left text-gray-700 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <IconComponent
                        src="/icons/location.svg"
                        className="h-4 w-4"
                      />
                      <span>Manajemen Lokasi</span>
                    </div>
                  </button>
                  <button className="block w-full rounded-lg p-2 text-left text-gray-700 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <IconComponent
                        src="/icons/bank.svg"
                        className="h-4 w-4"
                      />
                      <span>Rekening Bank</span>
                    </div>
                  </button>
                  <button className="block w-full rounded-lg p-2 text-left text-gray-700 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <IconComponent
                        src="/icons/language.svg"
                        className="h-4 w-4"
                      />
                      <span>Bahasa</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Waktu Muat Bottom Sheet Component
const WaktuMuatBottomSheet = ({ isOpen, onClose, onSave, initialValue }) => {
  const [orderType, setOrderType] = useState("instan");
  const [selectedDateTime, setSelectedDateTime] = useState(
    initialValue?.dateTime || ""
  );
  const [endDateTime, setEndDateTime] = useState(
    initialValue?.endDateTime || ""
  );
  const [withRange, setWithRange] = useState(initialValue?.withRange || false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!selectedDateTime) {
      newErrors.dateTime = "Tanggal & waktu muat wajib diisi";
    }

    if (withRange && !endDateTime) {
      newErrors.endDateTime = "Rentang waktu muat awal & akhir wajib diisi";
    }

    if (withRange && selectedDateTime && endDateTime) {
      const startTime = new Date(selectedDateTime);
      const endTime = new Date(endDateTime);
      const diffHours = (endTime - startTime) / (1000 * 60 * 60);

      if (diffHours < 1) {
        newErrors.endDateTime = "Rentang waktu muat awal & akhir minimal 1 jam";
      } else if (diffHours > 8) {
        newErrors.endDateTime =
          "Rentang waktu muat awal & akhir maksimal 8 jam";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        orderType,
        dateTime: selectedDateTime,
        endDateTime: withRange ? endDateTime : null,
        withRange,
      });
      onClose();
    }
  };

  const formatDisplayDateTime = (datetime) => {
    if (!datetime) return "";
    const date = new Date(datetime);
    return `${date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}, ${date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })} WIB`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-lg bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">Tanggal & Waktu Muat</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          {/* Order Type Selection */}
          <div className="mb-6 space-y-4">
            <RadioButton
              name="orderType"
              label="Instan"
              value="instan"
              checked={orderType === "instan"}
              onClick={({ value }) => setOrderType(value)}
            />
            <p className="ml-6 text-sm text-gray-600">
              Pesan jasa angkut untuk penjemputan dan pengiriman segera atau di
              Hari+1.
            </p>

            <RadioButton
              name="orderType"
              label="Terjadwal"
              value="terjadwal"
              checked={orderType === "terjadwal"}
              onClick={({ value }) => setOrderType(value)}
            />
            <p className="ml-6 text-sm text-gray-600">
              Pesan jasa angkut untuk penjemputan dan pengiriman di Hari+2
              sampai dengan Hari+30.
            </p>
          </div>

          {/* DateTime Selection */}
          <div className="mb-4">
            <DatetimePicker
              datetimeValue={
                selectedDateTime ? new Date(selectedDateTime) : new Date()
              }
              onApply={(date) => setSelectedDateTime(date.toISOString())}
              onCancel={() => {}}
              placeholder="Pilih Tanggal & Waktu Muat"
              status={errors.dateTime ? "error" : "default"}
            />
            {errors.dateTime && (
              <p className="mt-1 text-sm text-red-500">{errors.dateTime}</p>
            )}
          </div>

          {/* Range Option */}
          <div className="mb-6">
            <Checkbox
              checked={withRange}
              onChange={({ checked }) => {
                setWithRange(checked);
                if (!checked) {
                  setEndDateTime("");
                  setErrors((prev) => ({ ...prev, endDateTime: undefined }));
                }
              }}
              label="Dengan Rentang Waktu"
            />
            <p className="ml-6 text-sm text-gray-600">
              Jika kamu memilih opsi ini, kamu dapat menentukan pukul mulai dan
              pukul akhir untuk penjemputan muatan.
            </p>

            {withRange && (
              <div className="ml-6 mt-3">
                <p className="mb-2 text-sm text-gray-600">Sampai dengan</p>
                <DatetimePicker
                  datetimeValue={
                    endDateTime ? new Date(endDateTime) : new Date()
                  }
                  onApply={(date) => setEndDateTime(date.toISOString())}
                  onCancel={() => {}}
                  placeholder="Pilih Tanggal & Waktu Muat"
                  status={errors.endDateTime ? "error" : "default"}
                  disabled={!selectedDateTime}
                />
                {errors.endDateTime && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.endDateTime}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Save Button */}
          <Button
            variant="muattrans-primary"
            onClick={handleSave}
            className="w-full"
          >
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main Homepage Component
const MuatransHomepage = () => {
  const [showFirstTimer, setShowFirstTimer] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [waktuMuatOpen, setWaktuMuatOpen] = useState(false);
  const [waktuMuatValue, setWaktuMuatValue] = useState(null);
  const [waktuMuatError, setWaktuMuatError] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    lokasiMuat: "",
    lokasiBongkar: "",
    informasiMuatan: "",
    jenisCarrier: "",
    jenisTruk: "",
    asuransiBarang: "gratis",
    layananTambahan: "",
  });

  const banners = [
    {
      id: 1,
      imageUrl: "/img/truck-banner.png",
      altText: "Cara Mudah Cari Barang - Daftar dan Mulai Sekarang!",
      linkUrl: "/promo/1",
    },
  ];

  const handleFirstTimerClose = () => {
    setShowFirstTimer(false);
  };

  const handleDontShowAgain = () => {
    // Save preference to localStorage or API
    localStorage.setItem("muatrans_dont_show_popup", "true");
    setShowFirstTimer(false);
  };

  const handleWaktuMuatSave = (value) => {
    setWaktuMuatValue(value);
    setWaktuMuatError("");
    // Save to localStorage for persistence
    localStorage.setItem("muatrans_waktu_muat", JSON.stringify(value));
  };

  const formatWaktuMuatDisplay = () => {
    if (!waktuMuatValue) return "";

    const startTime = `${new Date(waktuMuatValue.dateTime).toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    )}, ${new Date(waktuMuatValue.dateTime).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })} WIB`;

    if (waktuMuatValue.withRange && waktuMuatValue.endDateTime) {
      const endTime = `${new Date(
        waktuMuatValue.endDateTime
      ).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}, ${new Date(waktuMuatValue.endDateTime).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })} WIB`;

      return `${startTime} Sampai dengan ${endTime}`;
    }

    return startTime;
  };

  const handleLanjut = () => {
    let hasError = false;

    if (!waktuMuatValue) {
      setWaktuMuatError("Waktu muat wajib diisi");
      hasError = true;
    }

    if (!hasError) {
      // Navigate to next page or submit form
      console.log("Form submitted:", {
        waktuMuat: waktuMuatValue,
        ...formData,
      });
    }
  };

  // Check if popup should be shown based on localStorage
  useEffect(() => {
    const dontShow = localStorage.getItem("muatrans_dont_show_popup");
    if (dontShow === "true") {
      setShowFirstTimer(false);
    }

    // Load saved waktu muat data
    const savedWaktuMuat = localStorage.getItem("muatrans_waktu_muat");
    if (savedWaktuMuat) {
      try {
        setWaktuMuatValue(JSON.parse(savedWaktuMuat));
      } catch (e) {
        console.error("Error parsing saved waktu muat:", e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        notificationCount={127}
        chatCount={99}
        onMenuClick={() => setSidebarOpen(true)}
        onNotificationClick={() => console.log("Notification clicked")}
        onChatClick={() => console.log("Chat clicked")}
        onBackClick={() => console.log("Back clicked")}
      />

      {/* Banner Section */}
      <div className="mb-6">
        <BannerCarousel banners={banners} />
      </div>

      {/* CTA Section */}
      <div className="mb-6 px-4">
        <div className="flex items-center justify-between rounded-lg bg-white p-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Ayo kirim muatan kamu dengan muatrans!
            </h2>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600">muatrans</div>
            <div className="text-xs text-gray-500">
              Cargo Land Transportation
            </div>
            <div className="text-xs text-gray-500">Company</div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="px-4">
        <div className="space-y-4 rounded-lg bg-white p-4">
          {/* Waktu Muat */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Waktu Muat*
            </label>
            <button
              onClick={() => setWaktuMuatOpen(true)}
              className={`w-full rounded-lg border p-3 text-left ${
                waktuMuatError
                  ? "border-red-500"
                  : waktuMuatValue
                    ? "border-gray-300"
                    : "border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <IconComponent
                  src="/icons/calendar.svg"
                  className="h-5 w-5 text-gray-400"
                />
                <span
                  className={waktuMuatValue ? "text-gray-900" : "text-gray-500"}
                >
                  {waktuMuatValue
                    ? formatWaktuMuatDisplay()
                    : "Pilih Tanggal & Waktu Muat"}
                </span>
              </div>
            </button>
            {waktuMuatError && (
              <p className="mt-1 text-sm text-red-500">{waktuMuatError}</p>
            )}
          </div>

          {/* Lokasi Muat */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Lokasi Muat*
            </label>
            <div className="space-y-2">
              <div className="rounded-lg border border-gray-300 p-3">
                <div className="flex items-center gap-2">
                  <IconComponent
                    src="/icons/location.svg"
                    className="h-5 w-5 text-yellow-500"
                  />
                  <span className="text-gray-500">Masukkan Lokasi Muat</span>
                </div>
              </div>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-blue-500 p-3 text-blue-500">
                <IconComponent src="/icons/plus.svg" className="h-4 w-4" />
                <span>Tambah Lokasi Muat</span>
              </button>
            </div>
          </div>

          {/* Lokasi Bongkar */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Lokasi Bongkar*
            </label>
            <div className="space-y-2">
              <div className="rounded-lg border border-gray-300 p-3">
                <div className="flex items-center gap-2">
                  <IconComponent
                    src="/icons/location.svg"
                    className="h-5 w-5 text-gray-800"
                  />
                  <span className="text-gray-500">Masukkan Lokasi Bongkar</span>
                </div>
              </div>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-blue-500 p-3 text-blue-500">
                <IconComponent src="/icons/plus.svg" className="h-4 w-4" />
                <span>Tambah Lokasi Bongkar</span>
              </button>
            </div>
          </div>

          {/* Informasi Muatan */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Informasi Muatan*
            </label>
            <button className="w-full rounded-lg border border-gray-300 p-3 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent
                    src="/icons/package.svg"
                    className="h-5 w-5 text-gray-400"
                  />
                  <span className="text-gray-500">Masukkan Muatan</span>
                </div>
                <IconComponent
                  src="/icons/chevron-right.svg"
                  className="h-4 w-4 text-gray-400"
                />
              </div>
            </button>
          </div>

          {/* Jenis Armada */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Jenis Armada*
            </label>
            <div className="space-y-2">
              <button className="w-full rounded-lg border border-gray-300 p-3 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent
                      src="/icons/truck.svg"
                      className="h-5 w-5 text-gray-400"
                    />
                    <span className="text-gray-500">Pilih Jenis Carrier</span>
                  </div>
                  <IconComponent
                    src="/icons/chevron-right.svg"
                    className="h-4 w-4 text-gray-400"
                  />
                </div>
              </button>
              <button className="w-full rounded-lg border border-gray-300 p-3 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent
                      src="/icons/truck.svg"
                      className="h-5 w-5 text-gray-400"
                    />
                    <span className="text-gray-500">Pilih Jenis Truk</span>
                  </div>
                  <IconComponent
                    src="/icons/chevron-right.svg"
                    className="h-4 w-4 text-gray-400"
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Asuransi Barang */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900">
                Asuransi Barang{" "}
                <span className="text-gray-500">(Opsional)</span>
              </label>
              <button className="text-sm text-blue-500">Ubah Asuransi</button>
            </div>
            <div className="rounded-lg border border-gray-300 p-3">
              <div className="flex items-center gap-2">
                <IconComponent
                  src="/icons/shield.svg"
                  className="h-5 w-5 text-gray-400"
                />
                <span className="text-gray-900">
                  Gratis perlindungan hingga Rp10.000.000
                </span>
              </div>
            </div>
          </div>

          {/* Layanan Tambahan */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900">
                Layanan Tambahan{" "}
                <span className="text-gray-500">(Opsional)</span>
              </label>
              <button className="text-sm text-blue-500">Ubah Layanan</button>
            </div>
            <button className="w-full rounded-lg border border-gray-300 p-3 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent
                    src="/icons/services.svg"
                    className="h-5 w-5 text-gray-400"
                  />
                  <span className="text-gray-500">Pilih Layanan Tambahan</span>
                </div>
                <IconComponent
                  src="/icons/chevron-right.svg"
                  className="h-4 w-4 text-gray-400"
                />
              </div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="muattrans-primary-secondary" className="flex-1">
              Lihat Detail Biaya
            </Button>
            <Button
              variant="muattrans-primary"
              onClick={handleLanjut}
              className="flex-1"
            >
              Lanjut
            </Button>
          </div>
        </div>
      </div>

      {/* First Timer Popup */}
      <FirstTimerPopup
        isOpen={showFirstTimer}
        onClose={handleFirstTimerClose}
        onDontShowAgain={handleDontShowAgain}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        orderCount={12}
      />

      {/* Waktu Muat Bottom Sheet */}
      <WaktuMuatBottomSheet
        isOpen={waktuMuatOpen}
        onClose={() => setWaktuMuatOpen(false)}
        onSave={handleWaktuMuatSave}
        initialValue={waktuMuatValue}
      />
    </div>
  );
};

export default MuatransHomepage;
