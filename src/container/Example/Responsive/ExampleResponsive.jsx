import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTrigger,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import ToogleButton from "@/components/ToogleButton/ToogleButton";
import {
  ResponsiveRoute,
  useResponsiveNavigation,
  useResponsiveSearch,
} from "@/lib/responsive-navigation";

const ExampleResponsive = ({}) => {
  const [courierStatus, setCourierStatus] = useState({
    ambilLangsung: false,
    kurirToko: false,
    gojekInstant: true,
    grabInstant: true,
    jtRegular: false,
    jneRegular: false,
    sicepat: false,
    anteraja: false,
    posIndonesia: false,
    jtCargo: false,
    jneTrucking: false,
    wahana: false,
  });
  const toggleCourier = (courierName) => {
    setCourierStatus((prev) => ({
      ...prev,
      [courierName]: !prev[courierName],
    }));
  };

  const navigation = useResponsiveNavigation();
  const { searchValue } = useResponsiveSearch();

  const RESPONSIVE_LINKS = [
    {
      label: "Layout Default",
      onClick: () =>
        navigation.replace("/", {
          layout: "default",
          header: {
            onClickBackButton: () => {
              navigation.pop();
            },
            onClickChatButton: () => {
              alert("chat button");
            },
            onClickNotificationButton: () => {
              alert("notification button");
            },
            onClickMenuButton: () =>
              navigation.push("/mobile-menu", {
                layout: "menu",
                header: {
                  onClickBackButton: () => {
                    navigation.pop();
                  },
                  onClickChatButton: () => {
                    alert("chat button");
                  },
                  onClickNotificationButton: () => {
                    alert("notification button");
                  },
                },
              }),
          },
        }),
    },
    {
      label: "Layout Menu",
      onClick: () =>
        navigation.push("/mobile-menu", {
          layout: "menu",
          header: {
            onClickBackButton: () => {
              navigation.pop();
            },
            onClickChatButton: () => {
              alert("chat button");
            },
            onClickNotificationButton: () => {
              alert("notification button");
            },
          },
        }),
    },
    {
      label: "Layout Searchbar",
      onClick: () =>
        navigation.push("/mobile-searchbar", {
          layout: "searchBar",
          header: {
            onClickBackButton: () => {
              navigation.pop();
            },
          },
        }),
    },
    {
      label: "Layout Form",
      onClick: () =>
        navigation.push("/mobile-form", {
          layout: "form",
          header: {
            title: {
              label: "Layout Form Default",
              className: "", // Buat case spesifik, misal untuk form, bisa tambahkan class untuk ukuran text title
            },
            onClickBackButton: () => {
              navigation.pop();
            },
          },
        }),
    },
    {
      label: "Layout Form with Menu",
      onClick: () =>
        navigation.push("/mobile-form-with-menu", {
          layout: "form",
          header: {
            title: {
              label: "Layout Form with Menu",
              className: "", // Buat case spesifik, misal untuk form, bisa tambahkan class untuk ukuran text title
            },
            onClickBackButton: () => {
              navigation.pop();
            },
            withMenu: {
              onClickInfo: () => {
                alert("info button");
              },
              onClickMenu: () => {
                alert("menu button");
              },
            },
          },
        }),
    },
  ];

  const MobileNavExample = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold">Links</h1>
        {RESPONSIVE_LINKS.map((page) => (
          <div className="flex gap-3" key={page.label}>
            <button
              onClick={page.onClick}
              className="block text-blue-500 underline"
            >
              {page.label}
            </button>

            <span className="text-neutral-500">{page.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <ResponsiveRoute
        path="/"
        index
        component={
          <div className="flex flex-col gap-y-3 p-4">
            <div className="itmes-center flex flex-wrap gap-2">
              <Button
                color="primary"
                type="muattrans"
                onClick={() => setOpenControlled(true)}
              >
                Primary
              </Button>
              <Button color="primary_secondary" type="muattrans">
                Primary Secondary
              </Button>
              <Button color="error" type="muattrans">
                Error
              </Button>
              <Button color="error_secondary" type="muattrans">
                Error Seconary
              </Button>
              <Button color="warning" type="muattrans">
                Warning
              </Button>
            </div>
            <div>
              <ToogleButton
                onClick={() => toggleCourier("ambilLangsung")}
                value={courierStatus.ambilLangsung}
              />
            </div>
            <div>
              <BottomSheet>
                <BottomSheetTrigger>Open Bottom Sheet</BottomSheetTrigger>
                <BottomSheetContent>
                  <BottomSheetHeader title="Bagikan Produk"></BottomSheetHeader>
                  <div className="divide-y px-4">
                    <button className="w-full px-6 py-4 text-left">
                      Ringkasan Status Pesanan
                    </button>
                    <button className="w-full px-6 py-4 text-left">
                      Detail Pengiriman Dokumen
                    </button>
                    <button className="w-full px-6 py-4 text-left">
                      Detail Pembayaran
                    </button>
                    <button className="w-full px-6 py-4 text-left">
                      Ubah Pesanan
                    </button>
                    <button className="w-full px-6 py-4 text-left">
                      Unduh Dokumen Delivery Order (DO)
                    </button>
                  </div>
                </BottomSheetContent>
              </BottomSheet>
            </div>
            <div className="mb-4">
              <h1 className="text-2xl font-bold">Search Value</h1>
              {searchValue}
            </div>

            <MobileNavExample />
          </div>
        }
      />
      <ResponsiveRoute
        path="/mobile-menu"
        component={
          <div>
            <p>Mobile Menu Screen</p>
            <MobileNavExample />
          </div>
        }
      />
      <ResponsiveRoute
        path="/mobile-searchbar"
        component={
          <div>
            <p>Searchbar Screen</p>
            <p>Search Value: {searchValue}</p>
            <MobileNavExample />
          </div>
        }
      />
      <ResponsiveRoute
        path="/mobile-form"
        component={
          <div>
            <p>Form Screen</p>
            <MobileNavExample />
          </div>
        }
      />
      <ResponsiveRoute
        path="/mobile-form-with-menu"
        component={
          <div>
            <p>Form with Menu Screen</p>
            <MobileNavExample />
          </div>
        }
      />
    </>
  );
};

export default ExampleResponsive;
