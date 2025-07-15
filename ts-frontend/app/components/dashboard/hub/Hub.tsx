import HubItem, { HubItemProps } from "./HubItem";

export interface HubProps {
    item: {
        isOpen: boolean;
        links: {
            headers: HubItemProps["item"][];
            footer: HubItemProps["item"][];
        }
    }
}

const Hub: React.FC<HubProps> = ({ item }) => {
    const hubStyle = item.isOpen ? "visible opacity-100 z-10 translate-y-0" : "invisible opacity-0 -z-10  -translate-y-2";

    return (
        <div 
            className={`absolute top-[105%] left-4 w-64 rounded-lg bg-dark/30 backdrop-blur-lg shadow-default flex flex-col items-center justify-between  text-light ${hubStyle} transition-all duration-150 ease-in-out p-2`}
            style={{ height: '75vh'}}
        >
           <div className={`w-full`}>
                {
                    item.links.headers.map((link, index) => (
                        <HubItem
                            key={index}
                            item={link}
                        />
                    ))
                }
           </div>
           <div className={`w-full`}>
                {
                    item.links.footer.map((link, index) => (
                        <HubItem
                            key={index}
                            item={link}
                        />
                    ))
                }
           </div>
        </div>
    )
}

export default Hub;