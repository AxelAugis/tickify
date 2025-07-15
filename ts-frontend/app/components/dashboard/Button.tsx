import Image from "next/image";

export interface MenuButtonProps {
    item: {
        isActive: boolean;
        isHovered: boolean;
        onEnter: () => void;
        onLeave: () => void;
        onClick: () => void;
        icon: {
            src: string;
            alt: string;
            width: number;
            height: number;
        };
    }
}

const MenuButton: React.FC<MenuButtonProps> = ({ item }) => {

    const activeBtnStyle = item.isActive || item.isHovered ? "bg-light/40" : "bg-transparent";

    return (
        <button 
            className={`flex p-2 rounded-lg ${activeBtnStyle} transition-colors duration-150 cursor-pointer`}
            onClick={item.onClick}
            onMouseEnter={item.onEnter}
            onMouseLeave={item.onLeave}
            aria-label="Menu Button"
            aria-pressed={item.isActive}
        >
            <Image
                src={item.icon.src}
                alt={item.icon.alt}
                width={item.icon.width}
                height={item.icon.height}
            />
        </button>
    )
}

export default MenuButton;