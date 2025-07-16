import { Draggable } from "@hello-pangea/dnd";
import Card from "./Card";
import { TicketProps } from "@/types/ticket";

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
        <div className={`w-full h-full rounded-xl flex flex-col bg-dark/20 backdrop-blur-xl`}>
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
    );
};

export default Column;
