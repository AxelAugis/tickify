import Image from "next/image";

interface SubmenuProps {
    item: {
        context: string | undefined;
        create?: {
            isOpen: boolean;
            onClick: () => void;
            text: string;
            icon?: {
                src: string;
                alt: string;
                width: number;
                height: number;
            };
            // elements: {
            //     url: string;
            //     label: string;
            // }
        }
    }
}

const Submenu: React.FC<SubmenuProps> = ({ item }) => {
    return (
        <div className={`w-full flex justify-between px-4 lg:px-24  py-5 bg-accent-dark text-light`}>
            <div className={`flex items-center gap-x-12`}>
                <h2 className={` text-xl font-medium font-ubuntu`}>{item.context}</h2>
                {item.create && (
                    <div onClick={item.create.onClick} className={`flex gap-x-3 items-center`}>
                        <button className={``}
                        {item.create.icon && (
                            <Image
                                src={item.create.icon.src}
                                alt={item.create.icon.alt}
                                width={item.create.icon.width}
                                height={item.create.icon.height}
                                className={`${item.create.isOpen ? "rotate-0 transition-transform duration-300" : "rotate-45 transition-transform duration-300"}`}
                            />
                        )}
                        <span className={`text-cabin`}>{item.create.text}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Submenu;