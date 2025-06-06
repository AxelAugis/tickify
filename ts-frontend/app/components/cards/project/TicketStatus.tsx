import { TicketStatusEnum } from "@/types/ticket";

export interface TicketStatusProps {
    status: TicketStatusEnum;
    count?: number;
}

interface StatusSpec {
    label: string;
    bgColor: string;
    color: string;
    borderColor: string;
}

const TicketStatus: React.FC<TicketStatusProps> = ({ status, count }) => {
    
    const statusSpecs: Record<TicketStatusEnum, StatusSpec> = {
        todo: {
            label: 'À faire',
            bgColor: "bg-blue-100/20",
            color: "text-blue-500",
            borderColor: "border-blue-500"
        },
        in_progress: {
            label: 'En cours',
            bgColor: "bg-yellow-100/20",
            color: "text-yellow-500",
            borderColor: "border-yellow-500"
        },
        done: {
            label: 'Terminé',
            bgColor: "bg-green-100/20",
            color: "text-green-500",
            borderColor: "border-green-500"
        },
    };

    const spec = statusSpecs[status];
    const statusClass = `${spec.bgColor} ${spec.color} ${spec.borderColor}`;

    return (
        <div className={`w-full py-2 rounded-md px-4 text-base font-medium border flex items-center justify-between ${statusClass}`}>
           <span>{count} tickets </span>
           <span className={`ml-2 ${spec.color} font-semibold`}>{spec.label}</span>
        </div>
    );
};

export default TicketStatus;