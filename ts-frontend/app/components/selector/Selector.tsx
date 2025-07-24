import Image from "next/image";
import Dropdown from "./Dropdown";

export interface SelectorProps<T> {
    item: {
        ref: React.RefObject<HTMLDivElement | null>;
        selectedOption: T | null;
        options: T[];
        isOpen: boolean;
        button: {
            onClick: () => void;
            text?: string;
            icon?: {
                src: string;
                alt: string;
                width: number;
                height: number;
            };
        };
        onSelect: (option: T) => void;
    };
    getLabel: (option: T) => string;
    getId: (option: T) => number;
}

const Selector = <T,>({ item, getLabel, getId }: SelectorProps<T>) => {
    return (
        <div 
            ref={item.ref}
            className={`relative w-1/5 group`}>
            <button 
                className={`py-1.5 pl-4 pr-3 w-full bg-transparent rounded-lg hover:bg-light/20 transition-colors duration-150 cursor-pointer text-start flex items-center justify-between`}
                onClick={item.button.onClick}
            >
                {
                    item.selectedOption ? (
                        getLabel(item.selectedOption)
                    ) : (
                        item.options && getLabel(item.options[0])
                    )
                }
                <Image
                    src="/images/icons/arrows/arrow-down-light.svg"
                    alt="Une flèche"
                    width={20}
                    height={20}
                    className={`opacity-70 transition-all duration-150 group-hover:opacity-100 ${item.isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <Dropdown<T> item={{
                isOpen: item.isOpen,
                getLabel: getLabel,
                getId: getId,
                options: item.options,
                onSelect: (option: T) => {
                   item.onSelect(option);
                }
            }} />
        </div>
    )
}

export default Selector;