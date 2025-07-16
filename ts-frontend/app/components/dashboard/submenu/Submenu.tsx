import { MasterProps } from "@/types/master";
import Selector, { SelectorProps } from "../../selector/Selector";

interface SubmenuProps {
    item: {
        project?: {
            name: string;
        };
        masterSelector: SelectorProps<MasterProps>["item"];
    };
}

const Submenu: React.FC<SubmenuProps> = ({ item }) => {
    return (
        <div className={`w-full py-2.5 pl-6 pr-4 bg-dark/50 backdrop-blur-xl flex items-center gap-x-4 text-light/80 z-10`}>
            <h2 className={` text-xl font-semibold `}>{item.project?.name}</h2>
            <span className={` font-medium`}>|</span>
            <Selector
                item={item.masterSelector}
                getLabel={option => option.title}
                getId={option => option.id} 
            />
        </div>
    )
}

export default Submenu;