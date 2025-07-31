import Image from "next/image";
import Link from "next/link";

export interface OptionProps {
    item: {
        id: number;
        label: string;
        onClick: () => void;
        isLink?: boolean;
        url?: string;
        icon?: {
            src: string;
            alt: string;
            width: number;
            height: number;
        };
    };
    isFirst: boolean;
    isLast: boolean;
}

const Option: React.FC<OptionProps> = ({ item, isFirst, isLast }) => {
    console.log(item);
    
    const borderRadius = isFirst ? 'rounded-t-lg' : isLast ? 'rounded-b-lg' : '';
    return (
        <li className={`w-full`} >
            {
                item.isLink ? (
                    <Link
                        href={item.url || '#'}
                        className={`py-2 px-4 hover:bg-light/30 transition-colors duration-150 cursor-pointer block w-full text-start ${borderRadius} flex items-center gap-x-2`}
                    >
                        <Image
                            src={item.icon?.src || '/images/icons/arrows/arrow-right-light.svg'}
                            alt={item.icon?.alt || item.label}
                            width={item.icon?.width || 16}
                            height={item.icon?.height || 16}
                            className={`rotate-45`}
                        />
                        {item.label}
                    </Link>
                ) : (
                    <button 
                        className={`py-2 px-4 hover:bg-light/30 transition-colors duration-150 cursor-pointer w-full text-start ${borderRadius}`}
                        onClick={item.onClick}
                    >
                        {item.label}
                    </button>
                )
            }
        </li>
    )   
}

export default Option;