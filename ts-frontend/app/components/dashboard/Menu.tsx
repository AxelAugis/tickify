import Image from "next/image";
import MenuButton, { MenuButtonProps } from "./Button";
import Hub, { HubProps } from "@/app/components/dashboard/hub/Hub";

export interface MenuElement {
    url: string;
    label: string;
}

export interface MenuProps {
    item: {
        hub: {
            button: MenuButtonProps["item"];
            dropdown: HubProps["item"];
        };
        isLargeScreen?: boolean;
        create?: {
            isOpen: boolean;
            onClick: () => void;
            text: string;
            icon?: {
                src: string;
                alt: string;
                width: number;
                height: number;
            };
            elements?: MenuElement[];
        },
    }
}

const Menu: React.FC<MenuProps> = ({ item }) => {


    return (
        <div className={`w-full flex items-center justify-between px-4 py-3 bg-dark/20 backdrop-blur-lg text-light relative`}>
            <MenuButton item={item.hub.button} />
            <form className={`relative w-1/3 h-fit`}>
                <div className={`w-full grid grid-cols-8 items-center rounded-lg border border-neutral-300   text-dark bg-light/40 `}>
                    <input 
                        className={`bg-transparent col-span-7 px-3 py-2 focus:outline-none  rounded-l-lg`}
                        type="text"
                        placeholder="Rechercher..."
                        aria-label="Rechercher"
                        autoComplete="off"
                        spellCheck="false"
                    />
                    <button 
                        type="button"
                        className={`col-span-1 flex justify-center items-center border-l border-l-accent-dark-green/20  transition-colors duration-150 h-full cursor-pointer`}
                    >
                        <Image
                            src="/images/icons/search.svg"
                            alt="Rechercher"
                            width={20}
                            height={20}
                            className={`text-light`}
                        />
                    </button>
                </div>
            </form>
            <Hub item={item.hub.dropdown} />
        </div>
    )
}

export default Menu;