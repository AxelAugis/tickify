import { Draggable } from "@hello-pangea/dnd";
import Card from "./Card";
import { TicketProps } from "@/types/ticket";
import Image from "next/image";

interface ColumnProps {
    item: {
        text: string;
        tickets: TicketProps[];
        bgColor: string;
        color: string;
    };
    colIdx: number;
}

const Column: React.FC<ColumnProps> = ({ item, colIdx }) => {
    return (
        <div className={`w-full h-fit rounded-xl flex flex-col bg-dark/20 backdrop-blur-xl`}>
            <div className={`flex flex-col`}>
                 <div className={`w-full py-2.5 px-4 flex rounded-t-lg font-semibold p-2 ${item.bgColor} ${item.color}`}>
                    {item.text}
                </div>
                <div className="flex-1 flex flex-col gap-2 p-2">
                    {item.tickets.map((ticket, idx) => (
                        <Draggable draggableId={ticket.id.toString()} index={idx} key={ticket.id}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <Card ticket={ticket} />
                                </div>
                            )}
                        </Draggable>
                    ))}
                </div>
            </div>
            <div className={``}>
                <button className={`rounded-b-xl backdrop-blur-xl text-light/80 bg-dark/60 flex items-center gap-x-4 px-2 py-2.5 w-full cursor-pointer hover:bg-dark/80 transition-colors duration-200`}>
                    <Image
                        src="/images/icons/crosses/light-cross.svg"
                        alt="Une croix"
                        width={22}
                        height={22}
                        className={`rotate-45`}
                    />
                    Ajouter un ticket
                </button>
            </div>
        </div>
    );
};

export default Column;
