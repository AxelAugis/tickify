import Option from "./Option";

export interface SelectorDropdownProps<T> {
    item: {
            isOpen: boolean;
            getLabel: (option: T) => string;
            getId: (option: T) => number;
            options: T[];
    }
}

const Dropdown = <T,>({ item }: SelectorDropdownProps<T>) => {
    const activeClass = item.isOpen ? 'visible translate-y-0 opacity-100 z-20' : 'invisible -translate-y-2 opacity-0 z-0';
    return (
        <div className={`absolute top-[110%] left-0 w-full bg-dark/20 backdrop-blur-lg rounded-lg shadow-lg mt-2 z-10 ${activeClass} transition-all duration-150 ease-in-out`}>
            <ul className={`max-h-60 overflow-y-auto`}>
                {
                   item.options.map((option, index) => (
                        <Option item={{ 
                                    id: item.getId(option), 
                                    label: item.getLabel(option) 
                                }} 
                                key={item.getId(option)} 
                                isFirst={index === 0} 
                                isLast={index === item.options.length - 1} 
                        />
                    ))
                }
            </ul>
        </div>
    )
}

export default Dropdown;