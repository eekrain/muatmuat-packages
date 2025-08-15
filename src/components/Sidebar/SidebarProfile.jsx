"use client";

// Using a utility for conditional classes
import Link from "next/link";
import { useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
// Assuming this is the correct path
import { cn } from "@/lib/utils";

// --- Data for Menu Items ---
const menuItems = [
  {
    id: "profile",
    label: "Profil",
    icon: "/icons/user16.svg", // Corrected icon path
    href: "#",
  },
  {
    id: "management-user",
    label: "Manajemen User",
    icon: "/icons/multi-user.svg", // Corrected icon path (using user16 as replacement)
    href: "#",
  },
  {
    id: "management-role",
    label: "Manajemen Role",
    icon: "/icons/user-checkbox.svg", // Corrected icon path (using note16 as replacement)
    href: "#",
  },
];

const shortcutsItems = [
  {
    id: "home",
    label: "Home",
    icon: "/icons/home-blue.svg", // Corrected icon path (using store as replacement)
    href: "/admin/profile",
  },
  {
    id: "logout",
    label: "Log Out",
    icon: "/icons/profil-logout.svg", // Corrected icon path (using unlink as replacement)

    href: "/logout",
    className: "text-red-500",
  },
];

// --- Reusable Menu Item Component ---
const MenuItem = ({ item, isActive, onClick, className }) => {
  return (
    <Link
      href={item.href}
      onClick={() => onClick(item.id)}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-lg px-4 py-3 text-xs font-semibold transition-colors duration-200",
        isActive
          ? "bg-yellow-400 text-neutral-900" // Active state style
          : "text-neutral-600 hover:bg-neutral-300" // Inactive state style
      )}
    >
      <IconComponent
        src={item.icon}
        alt={`${item.label} icon`}
        width={20}
        height={20}
        className={cn(
          isActive ? "text-neutral-900" : "text-neutral-500",
          item.className
        )}
      />
      <span>{item.label}</span>
    </Link>
  );
};

// --- Main Sidebar Component ---
const Sidebar = () => {
  // To make this dynamic, you would typically use `usePathname()` from `next/navigation`
  // and find the corresponding item `id`. For this example, we'll use state.
  const [activeId, setActiveId] = useState("profile");

  return (
    <aside
      className={
        "fixed left-0 top-[92px] flex h-screen w-[273px] flex-col bg-neutral-200 px-[27px] py-8 shadow-[4px_0px_27px_rgba(116,116,116,0.45)]"
      }
    >
      <div className="flex flex-col gap-[30px]">
        {/* Main Menu Section */}
        <div className="flex flex-col gap-3">
          <h3 className="px-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
            MENU
          </h3>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                isActive={activeId === item.id}
                onClick={setActiveId}
              />
            ))}
          </nav>
        </div>

        {/* Settings Section */}
        <div className="flex flex-col gap-3">
          <h3 className="px-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
            PINTASAN
          </h3>
          <nav className="flex flex-col gap-2">
            {shortcutsItems.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                isActive={activeId === item.id}
                onClick={setActiveId}
                className={item.className}
              />
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
