import Image from "next/image";
import { SubmenuProps } from "./Submenu";
import Link from "next/link";

interface CreateMenuProps {
    item: SubmenuProps["item"]["create"];
}

const CreateMenu: React.FC<CreateMenuProps> = ({ item }) => {
    return (
        <div className={`flex items-center gap-x-12 overflow-hidden `}>
            {item && (
                <div onClick={item.onClick} className={`flex gap-x-3 items-center`}>
                    <button className={`flex items-center gap-x-4 bg-accent-dark hover:bg-accent-dark pl-2 pr-6 py-2 rounded-md transition-colors duration-150 backdrop-blur-md text-sm cursor-pointer z-50`}>
                        {item.icon && (
                            <Image
                                src={item.icon.src}
                                alt={item.icon.alt}
                                width={item.icon.width}
                                height={item.icon.height}
                                className={`${item.isOpen ? "rotate-0 transition-transform duration-300" : "rotate-45 transition-transform duration-300"}`}
                            />
                        )}
                        <span className={`text-cabin`}>{item.text}</span>
                    </button>
                        <div className={`flex items-center gap-x-3 overflow-hidden ${item.isOpen ? 'translate-x-0 scale-x-100 visible ' : '-translate-x-[101%] invisible '} transition-all  duration-300`}>
                        <div className={` flex items-center gap-x-2`}>
                            {item.elements && item.elements.map((element, index) => (
                                <Link
                                    key={index}
                                    href={element.url} 
                                    className={`bg-transparent hover:bg-accent-dark text-dark hover:text-light px-6 py-2 rounded-md text-sm transition-colors duration-150 border border-accent-dark-green/20`}>
                                    {element.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateMenu;