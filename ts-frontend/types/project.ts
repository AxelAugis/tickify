import { TeamProps } from "./team";
import { TicketStatus } from "./ticket";

export interface ProjectProps {
    id: number;
    name: string;
    description: string;
    teams?: TeamProps[];
    tickets_count?: Record<TicketStatus, number>;
}