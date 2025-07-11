import MeatBallDropdown from "./MeatballDropdown";

export interface MeatballMenuProps {
    item: {
        color?: string;
        dropdown: {
            isOpen: boolean;
            elements: Array<{
                isLink: boolean;
                url?: string;
                text: string;
                onclick?: () => void;
                icon?: {
                    src: string;
                    alt: string;
                    width: number;
                    height: number;
                };
            }>;
        };
        onclick?: () => void;
    }
}

const MeatballMenu: React.FC<MeatballMenuProps> = ({ item }) => {

    const color = item.color || 'bg-transparent hover:bg-neutral-100';

    return (
        <div 
            className={`flex items-center justify-center gap-x-1 p-2 rounded-md ${color} transition-colors duration-200 relative cursor-pointer`} onClick={item.onclick}
        >
            {
                [1, 2, 3].map((dot, index) => (
                    <div key={index} className={`w-1.5 h-1.5 bg-accent-dark rounded-full`}></div>
                ))
            }
            <MeatBallDropdown item={item.dropdown} />
        </div>
    )
}

export default MeatballMenu;