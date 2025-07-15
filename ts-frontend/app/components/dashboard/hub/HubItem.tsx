import Image from "next/image";
import Link from "next/link";

export interface HubItemProps {
    item: {
        isBtn?: boolean;
        onClick?: () => void;
        text: string;
        icon: {
            src: string;
            alt: string;

        }
        url: string;
    }
}

const HubItem: React.FC<HubItemProps> = ({ item }) => {

    const commonStyles = `flex items-center gap-x-3 w-full p-2 rounded-md bg-transparent hover:bg-light/20 transition-colors duration-150 text-dark/80 font-cabin font-medium cursor-pointer`;

    return (
        item.isBtn ? (
            <button className={commonStyles}
                onClick={item.onClick}
                aria-label={item.text}
            >
                <Image
                    src={item.icon.src}
                    alt={item.icon.alt}
                    width={40}
                    height={40}
                    className={`w-9 h-auto p-1 rounded-lg bg-light/80`}
                />
                {item.text}
            </button>
        ) : (
            <Link
                href={item.url}
                className={commonStyles}
            >
                <Image
                    src={item.icon.src}
                    alt={item.icon.alt}
                    width={40}
                    height={40}
                    className={`w-9 h-auto p-1 rounded-lg bg-light/80`}
                />
                {item.text}
            </Link>
        )
    )
}

export default HubItem;