import { TicketProps } from "@/types/ticket";

export function groupTicketsByStatus(tickets: TicketProps[]): {
    text: string;
    value: string;
    bgColor: string;
    color: string;
    tickets: TicketProps[];
}[] {
    return [
        {
            text: "À faire",
            value: "todo",
            bgColor: 'bg-blue-100',
            color: "text-blue-500",
            tickets: tickets.filter(ticket => ticket.status === "todo"),
        },
        {
            text: "En cours",
            value: "in_progress",
            bgColor: 'bg-yellow-100',
            color: "text-yellow-500",
            tickets: tickets.filter(ticket => ticket.status === "in_progress"),
        },
        {
            text: "Terminé",
            value: "done",
            bgColor: 'bg-green-100',
            color: "text-green-500",
            tickets: tickets.filter(ticket => ticket.status === "done"),
        },
    ];
}