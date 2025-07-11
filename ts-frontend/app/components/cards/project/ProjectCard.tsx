import { ProjectProps } from "@/types/project";
import { TicketStatusEnum } from "@/types/ticket";
import Link from "next/link";
import TicketStatusComponent from "./TicketStatus";
import MeatballMenu from "../../meatball/MeatballMenu";
import { useState } from "react";

export interface ProjectCardProps {
    item: ProjectProps;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ item }) => {

    const [isMeatballMenuOpen, setIsMeatballMenuOpen] = useState(false);

    const handleMeatballMenuClick = () => {
        setIsMeatballMenuOpen(!isMeatballMenuOpen);
    }

    const meatballMenu = {
        dropdown: {
            isOpen: isMeatballMenuOpen,
            elements: [
                {
                    isLink: true,
                    url: `/dashboard/projects/${item.uuid}/edit`,
                    text: "Modifier",
                    icon: {
                        src: "/images/icons/edit.svg",
                        alt: "Edit",
                        width: 22,
                        height: 22,
                    }
                },
                {
                    isLink: false,
                    text: "Supprimer",
                    onclick: () => alert("Suppression du projet non implémentée"),
                    icon: {
                        src: "/images/icons/delete.svg",
                        alt: "Delete",
                        width: 22,
                        height: 22,
                    }
                }
            ]
        },
        onclick: handleMeatballMenuClick,
    }

    return (
        <div className={`text-dark w-full bg-white p-4 rounded-lg shadow-default hover:shadow-xl transition duration-300 ease-in-out flex flex-col gap-y-12 justify-between `}>
            <div className={`flex flex-col gap-y-6`}>
                <div className={`flex flex-col gap-y-2`}>
                    <div className={`flex items-center justify-between`}>
                        <h2 className="text-xl font-semibold font-ubuntu">{item.name}</h2>
                        <MeatballMenu item={meatballMenu} />
                    </div>
                    <p className="text-accent-dark-green font-cabin">{item.description}</p>
                    
                    <div className={`flex flex-wrap gap-2`}>
                        {
                            item.teams != undefined && item.teams.length > 0 ? item.teams.map((team, index) =>
                                <span
                                    key={index}
                                    style={{ backgroundColor: team.color }}
                                    className={`text-sm font-cabin font-medium bg-accent-light-green text-light min-w-16 text-center pt-0.5 pb-1 rounded-full`}
                                >
                                    {team.name}
                                </span>
                            ) : (
                                <span className={`text-sm font-cabin font-medium text-gray-800 h-[26px]`}>Aucune équipe assignée</span>
                            )
                        }
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