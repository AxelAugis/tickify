import { MasterProps } from "@/types/master";
import Selector, { SelectorProps } from "../../selector/Selector";

export interface LinkSelectorProps {
        id: number;
        isLink: boolean;
        url: string;
        label: string;
}
interface SubmenuProps {
    item: {
        project?: {
            name: string;
        };
        masterSelector?: SelectorProps<MasterProps>["item"];
        creatorSelector?: SelectorProps<LinkSelectorProps>["item"];
    };
}

const Submenu: React.FC<SubmenuProps> = ({ item }) => {
    return (
        <div className={`w-full py-2.5 pl-6 pr-4 bg-dark/30 backdrop-blur-xl flex items-center gap-x-4 text-light/80 z-10`}>
            <h2 className={` text-xl font-semibold `}>{item.project?.name}</h2>
            <span className={` font-medium`}>|</span>
            {
                item.masterSelector && (
                    <Selector
                        item={{
                            ...item.masterSelector,
                            getLabel: (option: MasterProps) => option.title,
                            getId: (option: MasterProps) => option.id,
                        }}
                    />
                )
            }
            {
                item.creatorSelector && (
                    <Selector
                        item={{
                            ...item.creatorSelector,
                            getLabel: (option: LinkSelectorProps) => option.label,
                            getId: (option: LinkSelectorProps) => option.id,
                        }}
                    />
                )
            }
        </div>
    )
}

export default Submenu;