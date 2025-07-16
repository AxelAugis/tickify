import { TicketProps } from "@/types/ticket";

const Card: React.FC<{ ticket: TicketProps }> = ({ ticket }) => (
    <div className="bg-white rounded shadow p-2">
        {ticket.title}
    </div>
);

export default Card;