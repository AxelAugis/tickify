import { ProjectProps } from "@/types/project";
import { TicketStatusEnum } from "@/types/ticket";
import Link from "next/link";
import TicketStatusComponent from "./TicketStatus";

export interface ProjectCardProps {
    item: ProjectProps;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ item }) => {
    return (
        <div
            className={`text-dark w-full bg-white p-4 rounded-lg shadow-default hover:shadow-xl transition duration-300 ease-in-out flex flex-col gap-y-12 justify-between `}
        >
            <div className={`flex flex-col gap-y-6`}>
                <div className={`flex flex-col gap-y-2`}>
                    <h2 className="text-xl font-semibold font-ubuntu">{item.name}</h2>
                    <p className="text-accent-dark-green font-cabin">{item.description}</p>
                    <div className={`flex flex-wrap gap-2`}>
                        {item.teams?.map((team, index) => (
                            <span
                                key={index}
                                style={{ backgroundColor: team.color }}
                                className={`text-sm font-cabin font-medium bg-accent-light-green text-light min-w-16 text-center pt-0.5 pb-1 rounded-full`}
                            >
                                {team.name}
                            </span>
                        ))}
                    </div>
                </div>
                <div className={`flex flex-col gap-y-4`}>
                    {
                        item.tickets_count && Object.entries(item.tickets_count).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(item.tickets_count).map(([status, count]) => (
                                    <TicketStatusComponent status={status as TicketStatusEnum} key={status} count={count} />
                                ))}
                            </div>
                        )
                    }
                </div>
            </div>
            <Link
                href={`/dashboard/projects/${item.id}`}
                className={`text-accent-green bg-accent-dark-green font-cabin py-2 px-4 hover:bg-accent-dark hover:text-accent-green rounded-lg transition duration-300 ease-in-out text-center w-fit self-end`}
            >
                Voir le projet
            </Link>
        </div>
    );
};

export default ProjectCard;