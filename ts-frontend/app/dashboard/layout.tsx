"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import useScreenStore from "@/store/useScreenStore";
import ScreenLoader from "../components/screenLoader/ScreenLoader";

import Modal from "../components/modal/Modal";
import Menu from "../components/dashboard/Menu";
import useBackgroundProjectStore from "@/store/useBackgroundProjectStore";
import { useClickOutside } from "@/utils/hooks/useClickOutside";
import { logout } from "@/utils/auth";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading, error, fetchCurrentUser } = useUserStore();
    const { isLargeScreen, initializeScreenListener } = useScreenStore();
    const [isSBDrawerOpen, setIsSBDrawerOpen] = useState(false);
    const [isHubOpen, setIsHubOpen] = useState<boolean>(false);
    const [isMenuButtonsActive, setIsMenuButtonsActive] = useState({
        hub: { active: false, hovered: false },
        create: { active: false, hovered: false },
    })
    const { clearColors, firstColor, secondColor } = useBackgroundProjectStore();

    const hubRef = useRef<HTMLDivElement | null>(null);

    const isDashboardPage = pathname === "/dashboard";

    useEffect(() => {
        if(isDashboardPage) {
            clearColors();
        }
        fetchCurrentUser();

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

    const onHubClose = () => {
        setIsMenuButtonsActive(prev => ({
            ...prev,
            hub: { ...prev.hub, 
                active: false,
                hovered: false 
            }
        }));
        setIsHubOpen(false);
    }

    useClickOutside(hubRef, isHubOpen, onHubClose);

    if (loading) {
        return (
        <ScreenLoader />
        );
    }

    const handleMenuBtnClick = (buttonType: "hub" | "create") => {
        if (buttonType === "hub") {
            setIsHubOpen(!isHubOpen);
            setIsMenuButtonsActive((prev) => ({
                ...prev,
                hub: { ...prev.hub, active: !prev.hub.active },
            }));
        } else if (buttonType === "create") {
            setIsSBDrawerOpen(!isSBDrawerOpen);
            setIsMenuButtonsActive((prev) => ({
                ...prev,
                create: { ...prev.create, active: !prev.create.active },
            }));
        }
    };

    const handleMenuBtnHover = (direction: "enter" | "leave", buttonType: "hub" | "create") => {
        if (isMenuButtonsActive[buttonType].active) {
            return;
        }
        if (direction === "enter") {
            setIsMenuButtonsActive(prev => ({
                ...prev,
                [buttonType]: { ...prev[buttonType], hovered: true }
            }));
        } else if (direction === "leave") {
            setIsMenuButtonsActive(prev => ({
                ...prev,
                [buttonType]: { ...prev[buttonType], hovered: false }
            }));
        }
    }

    const handleLogout = () => {
        logout()
            .then(() => {
                router.push("/login");
            })
            .catch((err) => {
                console.error("Logout failed:", err);
            }
        );
    }

    const menu = {
            hub: {
                ref: hubRef,
                button: {
                    isActive: isMenuButtonsActive.hub.active,
                    isHovered: isMenuButtonsActive.hub.hovered,
                    onEnter: () => handleMenuBtnHover("enter", "hub"),
                    onLeave: () => handleMenuBtnHover("leave", "hub"),
                    onClick: () => handleMenuBtnClick("hub"),
                    icon: {
                        src: "/images/icons/category.svg",
                        alt: "Menu",
                        width: 24,
                        height: 24,
                    },
                },
                dropdown: {
                    isOpen: isHubOpen,
                    setIsOpen: setIsHubOpen,
                    links: {
                        headers: [
                            {
                                text: "Accueil",
                                icon: {
                                    src: "/images/icons/home.svg",
                                    alt: "Accueil",

                                },
                                url: "/dashboard",
                            },
                            {
                                text: "Profil",
                                icon: {
                                    src: "/images/icons/profile-dark.svg",
                                    alt: "Profil",
                                },
                                url: "/dashboard/profile",
                            }
                        ],
                        footer: [
                            {
                                isBtn: true,
                                text: "Déconnexion",
                                icon: {
                                    src: "/images/icons/logout-dark.svg",
                                    alt: "Déconnexion",
                                },
                                onClick: handleLogout,
                            }
                        ]
                    }
                }
            },
            isLargeScreen: isLargeScreen,
            // create: {
            //     button: {
            //         isActive: isMenuButtonsActive.create.active,
            //         isHovered: isMenuButtonsActive.create.hovered,
            //         onEnter: () => handleMenuBtnHover("enter", "create"),
            //         onLeave: () => handleMenuBtnHover("leave", "create"),
            //         onClick: () => handleMenuBtnClick("create"),
            //         icon: {
            //             src: "/images/icons/crosses/green-cross.svg",
            //             alt: "Ajouter un projet",
            //             width: 20,
            //             height: 20
            //         },
            //     },
            //     isOpen: isSBDrawerOpen,
            //     text: "Ajouter",
            // }
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
            className={`w-screen h-screen max-h-screen `}
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