import Image from "next/image";
import Link from "next/link";
import AuthLink from "../../authLink/AuthLink";
import type { AuthLinkProps } from "../../authLink/AuthLink";
import Burger, { BurgerProps } from "./burger/Burger";
import NavbarDropdown, { NavbarDropdownProps } from "./dropdown/Dropdown";

interface NavbarProps {
  item: {
    isDropdownActive: boolean;
    ref: React.RefObject<HTMLDivElement | null>;
    authLinks: AuthLinkProps["item"][];
    isLgScreen: boolean;
    burger: BurgerProps["item"];
    dropdown: NavbarDropdownProps["item"];
  };
}

const Navbar: React.FC<NavbarProps> = ({ item }) => {
    return (
        <nav ref={item.ref} className={`w-screen lg:w-full max-w-screen-xl 2xl:max-w-screen-2xl flex items-center justify-between px-4 lg:px-0 py-5 lg:left-1/2 lg:-translate-x-1/2 fixed top-0 z-50 transition-colors duration-300 ${item.isDropdownActive ? "bg-accent-green/50" : "bg-transparent"} backdrop-blur-md`}>
          <Link
            href="/"
            className="text-2xl font-bold text-accent-dark font-ubuntu"
          >
            <Image
              src={"/images/logo.svg"}
              alt="Logo"
              width={100}
              height={50}
              className="cursor-pointer w-12 lg:w-16 h-auto"
            />
          </Link>
          {
            item.isLgScreen ? (
            <div className={`flex items-center gap-x-8`}>
              {
                  item.authLinks.map((link, index) => (
                      <AuthLink key={index} item={link} />
                  ))
              }
            </div>
            ) : <Burger item={item.burger} />
          }
          <NavbarDropdown item={item.dropdown} />
      </nav>
    );
;}

export default Navbar;