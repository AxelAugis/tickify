'use client';

import React, { useEffect, useRef, useState } from 'react';
import BurgerStyles from '@/app/components/homepage/navbar/burger/Burger.module.css';
import DropdownStyles from '@/app/components/homepage/navbar/dropdown/Dropdown.module.css';
import Navbar from '../components/homepage/navbar/Navbar';

export default function AuthLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const navbarRef = useRef<HTMLDivElement | null>(null);
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);

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
      padding: 'lg:px-24 xl:px-0'
    }

    return (
        <div
          className={`w-screen h-screen bg-gradient-to-br from-accent-green from-10% to-accent-dark flex items-center justify-center `}
        >
          <Navbar item={navbar} />
          {children}
        </div>
    );
}