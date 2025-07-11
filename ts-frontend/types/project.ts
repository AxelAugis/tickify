import { TeamProps } from "./team";
import { TicketStatusEnum } from "./ticket";

export interface ProjectProps {
    id: number;
    name: string;
    description: string;
    teams?: TeamProps[];
    tickets_count?: Record<TicketStatusEnum, number>;
    uuid: string;
}