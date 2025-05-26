"use client"
import useDevice from "@/hooks/use-device";
import ResponsiveLayout from "../ResponsiveLayout/ResponsiveLayout";
// import DesktopLayout from "./desktop/DesktopLayout";

const MainLayout = ({ children }) => {
    const { isMobile, mounted } = useDevice();

    if (!mounted) {
        return null
    }
    if (isMobile) {
        return (
            <ResponsiveLayout>
                {children}
            </ResponsiveLayout>
        )
    }
    return (
        // <DesktopLayout>
            <main className="min-h-[calc(100vh-60px)]">
                {children}
            </main>
        // {/* </DesktopLayout> */}
    )
}

export default MainLayout