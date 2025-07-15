import Image from "next/image";
import CreateMenu from "./CreateMenu";

export interface SubmenuElement {
    url: string;
    label: string;
}

export interface SubmenuProps {
    item: {
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
            elements?: SubmenuElement[];
        },
    }
}

const Submenu: React.FC<SubmenuProps> = ({ item }) => {
    return (
        <div className={`w-full flex items-center justify-between px-4 lg:px-24  py-3 bg-gray-100 text-light`}>
            <div className={`flex items-center gap-x-12`}>
                {item.create && (
                    <CreateMenu item={item.create} />
                )}
            </div>
            <form className={`relative w-1/3 h-fit`}>
                <div className={`w-full grid grid-cols-8 items-center rounded-lg border border-neutral-300   text-dark bg-light/10 `}>
                    <input 
                        className={`bg-transparent col-span-7 px-3 py-2 focus:outline-none focus:ring focus:ring-accent-dark-green rounded-l-lg`}
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
        </div>
    )
}

export default Submenu;