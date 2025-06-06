"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import ScreenLoader from "../components/screenLoader/ScreenLoader";
import BurgerStyles from '@/app/components/navbar/burger/Burger.module.css';
import DropdownStyles from '@/app/components/navbar/dropdown/Dropdown.module.css';
import Navbar from "../components/navbar/Navbar";
import ProfileDropdownStyle from "@/app/components/navbar/profile/dropdown/ProfileDropdown.module.css";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { user, loading, error, fetchCurrentUser } = useUserStore();
    const navbarRef = useRef<HTMLDivElement | null>(null);
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    useEffect(() => {
        if (error && !loading && !user) {
        router.push("/login");
        }
    }, [error, loading, user, router]);

      useEffect(() => {
        if(typeof window !== "undefined") {
          const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1024);
          }
          handleResize();
          window.addEventListener("resize", handleResize);
    
          return () => {
            window.removeEventListener("resize", handleResize);
          }
        }
      }, []);


    const handleBurgerClick = () => {
      // document.body.classList.toggle("max-h-screen");
      // document.body.classList.toggle("overflow-hidden");
      setIsBurgerOpen(!isBurgerOpen);
    }

    const navbar = {
        isDashboard: true,
        ref: navbarRef,
        isDropdownActive: isBurgerOpen,
        authLinks: [
            {
                url: "/login",
                label: "Se connecter",
            },
            {
                url: "/register",
                label: "Inscription",
            },
        ],
        isLgScreen: isLargeScreen,
        burger: {
            isOpen: isBurgerOpen,
            onclick: handleBurgerClick,
            styles: {
                burger: BurgerStyles.burger,
                active: BurgerStyles.active,
            },
        },
        dropdown: {
            isActive: isBurgerOpen,
            styles: {
                dropdown: DropdownStyles.dropdown,
                active: DropdownStyles.active,
            },
        },
        padding: 'lg:px-24 ',
        profile: {
            isOpen: isProfileOpen,
            onclick: () => setIsProfileOpen(!isProfileOpen),
            dropdown: {
                isOpen: isProfileOpen,
                onclick: () => setIsProfileOpen(false),
                styles: {
                    dropdown: ProfileDropdownStyle.dropdown,
                    active: ProfileDropdownStyle.active,
                },
                elements: [
                    {
                        isLink: true,
                        url: "/profile",
                        label: "Mon Profil",
                        image: {
                            src: "/images/icons/profile.svg",
                            alt: "Profile",
                            width: 24,
                            height: 24,
                        }
                    },
                    {
                        isLink: false,
                        label: "Se déconnecter",
                        image: {
                            src: "/images/icons/logout.svg",
                            alt: "Logout",
                            width: 24,
                            height: 24,
                        }
                    }
                ]
            }
        }
    }

    if (loading) {
        return (
        <ScreenLoader />
        );
    }

    if (error && !user) {
        return (
        <div className="w-screen h-screen flex items-center justify-center bg-light">
            <div className="text-red-500">Erreur: {error}</div>
        </div>
        );
    }

    return (
        <section className={`w-screen h-screen bg-light`}>
            <Navbar item={navbar} />
            {children}
        </section>
    );
};

export default DashboardLayout;