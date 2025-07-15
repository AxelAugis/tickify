"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import useScreenStore from "@/store/useScreenStore";
import ScreenLoader from "../components/screenLoader/ScreenLoader";

import Modal from "../components/modal/Modal";
import Menu from "../components/dashboard/Menu";
import useBackgroundProjectStore from "@/store/useBackgroundProjectStore";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading, error, fetchCurrentUser } = useUserStore();
    const { isLargeScreen, initializeScreenListener } = useScreenStore();
    const [isSBDrawerOpen, setIsSBDrawerOpen] = useState(false);
    const { clearColors, firstColor, secondColor } = useBackgroundProjectStore();

    const isDashboardPage = pathname === "/dashboard";

    useEffect(() => {
        fetchCurrentUser();
        if(isDashboardPage) {
            clearColors();
        }
    }, [fetchCurrentUser, clearColors, isDashboardPage]);

    useEffect(() => {
        if (error && !loading && !user) {
            router.push("/login");
        }
    }, [error, loading, user, router]);

    useEffect(() => {
        const cleanup = initializeScreenListener();
        return cleanup;
    }, [initializeScreenListener]);


    if (loading) {
        return (
        <ScreenLoader />
        );
    }

    const menu = {
            isLargeScreen: isLargeScreen,
            create: {
                isOpen: isSBDrawerOpen,
                onClick: () => setIsSBDrawerOpen(!isSBDrawerOpen),
                text: "Ajouter",
                icon: {
                    src: "/images/icons/crosses/green-cross.svg",
                    alt: "Ajouter un projet",
                    width: 20,
                    height: 20
                },
            }
        }

    if (error && !user) {
        return (
        <div className="w-screen h-screen flex items-center justify-center bg-light">
            <div className="text-red-500">Erreur: {error}</div>
        </div>
        );
    }

    return (
        <section 
            className={`w-screen h-screen `}
            style={{
                background: `linear-gradient(to bottom right, ${firstColor}, ${secondColor})`,
            }}
        >
            <Menu item={menu} />
            <Modal />
            {children}
        </section>
    );
};

export default DashboardLayout;