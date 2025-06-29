"use client";

import ResponsiveMenu from "@/container/ResponsiveMenu/ResponsiveMenuScreen";
import DefaultResponsiveLayout from "@/layout/ResponsiveLayout/DefaultResponsiveLayout";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import SearchBarResponsiveLayout from "@/layout/ResponsiveLayout/SearchBarResponsiveLayout";
import {
  ResponsiveProvider,
  ResponsiveRoute,
  useResponsiveNavigation,
} from "@/lib/responsive-navigation";

import ExampleWeb from "../Web/ExampleWeb";

const LAYOUT_EXAMPLE = [
  { label: "Layout Default", path: "/" },
  { label: "Layout Menu", path: "/menu" },
  { label: "Layout Searchbar", path: "/searchbar" },
  { label: "Layout Form", path: "/form" },
  { label: "Layout Form with Menu", path: "/form-with-menu" },
];

const ExampleWithLinks = () => {
  const navigation = useResponsiveNavigation();

  return (
    <div>
      <div className="bg-white py-4">
        <h1 className="text-2xl font-bold">Mobile Layouts Example</h1>

        {LAYOUT_EXAMPLE.map((item) => (
          <button
            key={item.label}
            onClick={() => navigation.push(item.path)}
            className="block text-blue-500 underline"
          >
            {item.label}
          </button>
        ))}
      </div>
      <ExampleWeb />
    </div>
  );
};

const ExampleDefaultLayout = () => {
  return (
    <DefaultResponsiveLayout mode="default">
      <ExampleWithLinks />
    </DefaultResponsiveLayout>
  );
};

const ExampleSearchbarLayout = () => {
  return (
    <SearchBarResponsiveLayout placeholder="Cari Nama Muatan">
      <ExampleWithLinks />
    </SearchBarResponsiveLayout>
  );
};

const ExampleFormLayout = () => {
  return (
    <FormResponsiveLayout
      title={{
        label: "Layout Form",
      }}
    >
      <ExampleWithLinks />
    </FormResponsiveLayout>
  );
};

const ExampleFormWithMenuLayout = () => {
  return (
    <FormResponsiveLayout
      title={{
        label: "Informasi Muatan",
      }}
      withMenu={true}
    >
      <ExampleWithLinks />
    </FormResponsiveLayout>
  );
};

const ExampleResponsive = ({}) => {
  return (
    <ResponsiveProvider>
      <ResponsiveRoute path="/" component={<ExampleDefaultLayout />} />
      <ResponsiveRoute path="/menu" component={<ResponsiveMenu />} />
      <ResponsiveRoute
        path="/searchbar"
        component={<ExampleSearchbarLayout />}
      />
      <ResponsiveRoute path="/form" component={<ExampleFormLayout />} />
      <ResponsiveRoute
        path="/form-with-menu"
        component={<ExampleFormWithMenuLayout />}
      />
    </ResponsiveProvider>
  );
};

export default ExampleResponsive;
