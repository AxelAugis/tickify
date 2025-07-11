import MeatballItem from "./MeatballItem";
import { MeatballMenuProps } from "./MeatballMenu";

interface MeatballDropdownProps {
    item: MeatballMenuProps['item']['dropdown'];
}

const MeatBallDropdown: React.FC<MeatballDropdownProps> = ({ item }) => {
    return (
        item.isOpen && (
            <div className={`absolute top-[120%] right-0 bg-white shadow-xl rounded-lg w-[400%] z-50 border border-gray-200`}>
                <div className="flex flex-col">
                    {item.elements.map((element, index) => (
                        <MeatballItem key={index} item={element} isFirst={index === 0} isLast={index === item.elements.length - 1} />
                    ))}
                </div>
            </div> 
        )
    )
}

export default MeatBallDropdown;