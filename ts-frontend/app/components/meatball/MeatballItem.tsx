import Link from "next/link";
import { MeatballMenuProps } from "./MeatballMenu";
import Image from "next/image";

interface MeatballItemProps {
        item: MeatballMenuProps['item']['dropdown']['elements'][number];
        isFirst: boolean;
        isLast: boolean;
}

const MeatballItem: React.FC<MeatballItemProps> = ({ item, isFirst, isLast }) => {

    const borderRadius = isFirst ? "rounded-tl-lg rounded-tr-lg" : isLast ? "rounded-bl-lg rounded-br-lg" : "";

    return (
        item.isLink ? (
            <Link
                href={item.url || "#"}
                className={`flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer ${borderRadius}`}

            >
                 {item.icon && 
                    <Image 
                        src={item.icon.src} 
                        alt={item.icon.alt} 
                        width={item.icon.width} 
                        height={item.icon.height} 
                    />
                }
                {item.text}
            </Link>
        ) : (
            <button 
                className={`flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer ${borderRadius}`} 
                onClick={item.onclick}
            >
                {item.icon && 
                    <Image 
                        src={item.icon.src} 
                        alt={item.icon.alt} 
                        width={item.icon.width} 
                        height={item.icon.height} 
                    />
                }
                {item.text}
            </button>
        )
    )
}

export default MeatballItem;