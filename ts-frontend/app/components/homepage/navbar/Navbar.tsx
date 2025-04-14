import Image from "next/image";
import Link from "next/link";
import AuthLink from "../../authLink/AuthLink";
import type { AuthLinkProps } from "../../authLink/AuthLink";

interface NavbarProps {
  item: {
    ref: React.RefObject<HTMLDivElement | null>;
    authLinks: AuthLinkProps["item"][];
  };
}

const Navbar: React.FC<NavbarProps> = ({ item }) => {
    return (
        <nav ref={item.ref} className="w-full max-w-screen-xl 2xl:max-w-screen-2xl flex items-center justify-between py-5 left-1/2 -translate-x-1/2 fixed top-0 z-20">
          <Link
            href="/"
            className="text-2xl font-bold text-accent-dark font-ubuntu"
          >
            <Image
              src={"/images/logo.svg"}
              alt="Logo"
              width={100}
              height={50}
              className="cursor-pointer w-16 h-auto"
            />
          </Link>
          <div className={`flex items-center gap-x-8`}>
            {
                item.authLinks.map((link, index) => (
                    <AuthLink key={index} item={link} />
                ))
            }
          </div>
      </nav>
    );
;}

export default Navbar;