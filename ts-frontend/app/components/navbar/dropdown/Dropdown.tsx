import useUserStore from "@/store/useUserStore";
import Link from "next/link";

export interface NavbarDropdownProps {
    item: {
        isActive: boolean;
        styles: {
            dropdown: string;
            active: string;
        }
    }
}

const NavbarDropdown: React.FC<NavbarDropdownProps> = ({ item }) => {

    const { user } = useUserStore();

    return (
        user ? (
             <div className={`w-screen fixed bg-light left-0 py-10 px-4 flex flex-col items-center gap-y-6 ${item.styles.dropdown} ${item.isActive ? item.styles.active : ""}`}>
                <Link
                    href="/dashboard"
                    className="text-2xl font-bold text-accent-dark font-ubuntu"
                >
                    Tableau de bord
                </Link>
             </div>
        ) : (
            <div className={`w-screen fixed bg-light left-0 py-10 px-4 flex flex-col items-center gap-y-6 ${item.styles.dropdown} ${item.isActive ? item.styles.active : ""}`}>
                <Link
                    href="/"
                    className="text-2xl font-bold text-accent-dark font-ubuntu"
                >
                    Connexion
                </Link>
                <Link
                    href="/register"
                    className="text-2xl font-bold text-accent-dark font-ubuntu"
                >
                    Inscription
                </Link>
            </div>
        )
    )
}

export default NavbarDropdown;