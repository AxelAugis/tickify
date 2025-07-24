import { TicketProps } from "@/types/ticket";

const Card: React.FC<{ ticket: TicketProps }> = ({ ticket }) => (
    <div className="bg-dark/70 text-light/80 rounded shadow p-2">
        {ticket.title}
    </div>
);

export default Card;