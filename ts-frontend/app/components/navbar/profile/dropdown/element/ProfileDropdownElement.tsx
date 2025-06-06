import Image from "next/image";
import Link from "next/link";

export interface ProfileDropdownElementProps {
    item: {
        isLink: boolean;
        url?: string;
        label: string;
        image: {
            src: string;
            alt: string;
            width: number;
            height: number;
        };
        onClick?: () => void;
    },
    lastIndex: boolean,
    firstIndex: boolean;
}

const ProfileDropdownElement: React.FC<ProfileDropdownElementProps> = ({ item, lastIndex, firstIndex }) => {
    
    const borderRadius = lastIndex ? "rounded-b-lg" : firstIndex ? "rounded-t-lg" : "";

    return (
        item.isLink && item.url ? (
            <Link
                href={item.url}
                className={`text-dark bg-transparent hover:bg-accent-dark-green/10 transition-colors duration-300 flex items-center gap-x-6 p-4 ${borderRadius}`}
            >
                <div className={`max-w-8 max-h-8 min-w-8 min-h-8 rounded-full bg-accent-dark-green p-1 flex items-center justify-center`}>
                    <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        width={item.image.width}
                        height={item.image.height}
                        className="cursor-pointer w-full h-auto "
                    />
                </div>
                {item.label}
            </Link>
        ) : (
            <button
                onClick={item.onClick}
                className={`text-dark bg-transparent hover:bg-accent-dark-green/10 transition-colors duration-300 flex items-center gap-x-6 p-4  w-full text-left cursor-pointer ${borderRadius}`}
            >
                <div className={`max-w-8 max-h-8 min-w-8 min-h-8 rounded-full bg-accent-dark-green p-1 flex items-center justify-center`}>
                    <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        width={item.image.width}
                        height={item.image.height}
                        className="cursor-pointer w-full h-auto "
                    />
                </div>
                {item.label}
            </button>
        )
    )
}

export default ProfileDropdownElement;