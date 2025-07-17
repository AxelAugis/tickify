import { TicketProps } from "./ticket";

export interface ticketStatus {
    text: string;
    value: string;
    bgColor: string;
    color: string;
    tickets: TicketProps[];
}