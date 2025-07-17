export interface OptionProps {
    item: {
        id: number;
        label: string;
        onClick?: () => void;
    };
    isFirst: boolean;
    isLast: boolean;
}

const Option: React.FC<OptionProps> = ({ item, isFirst, isLast }) => {
    const borderRadius = isFirst ? 'rounded-t-lg' : isLast ? 'rounded-b-lg' : '';
    return (
        <li className={`w-full`} >
            <button 
                className={`py-2 px-4 hover:bg-light/30 transition-colors duration-150 cursor-pointer w-full text-start ${borderRadius}`}
                onClick={() => console.log(`Selected option: ${item.label} et sa value est ${item.id}`)}
            >
                {item.label}
            </button>
        </li>
    )   
}

export default Option;