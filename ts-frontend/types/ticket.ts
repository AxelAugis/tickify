export type TicketStatusEnum = 'todo' | 'in_progress' | 'done';

export interface TicketProps {
    id: number;
    title: string;
    description: string;
    status: TicketStatusEnum;
    created_at: string;
    updated_at: string;
}