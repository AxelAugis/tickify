'use client';
import Submenu from "@/app/components/dashboard/submenu/Submenu";
import { useClickOutside } from "@/utils/hooks/useClickOutside";
import useBackgroundProjectStore from "@/store/useBackgroundProjectStore";
import useScreenStore from "@/store/useScreenStore";
import { MasterProps } from "@/types/master";
import { ProjectProps } from "@/types/project";
import { ticketStatus } from "@/types/ticketStatus";
import axios from "@/utils/axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { groupTicketsByStatus } from "@/utils/functions";
import ColumnSkeleton from "@/app/components/skeleton/kanban/ColumnSkeleton";
import Column from "@/app/components/dashboard/kanban/Column";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";

const ProjectPage = () => {

    const params = useParams();
    const router = useRouter();

    const { uuid } = params;

    const [project, setProject] = useState<ProjectProps | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const { isLargeScreen, initializeScreenListener } = useScreenStore();
    const { setFirstColor, setSecondColor } = useBackgroundProjectStore();
    const [masters, setMasters] = useState<ProjectProps["masters"]>([
        {
            id: 0,
            title: 'Tous les tickets',
            description: 'Tous les tickets du projet',
        }
    ]);
    const [isMasterSelectorOpen, setIsMasterSelectorOpen] = useState(false);
    const [selectedMaster, setSelectedMaster] = useState<MasterProps | null>(null);
    const [categories, setCategories] = useState<ticketStatus[]>([]);

    const selectorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const cleanup = initializeScreenListener();
        return cleanup;
    }, [initializeScreenListener]);

    useEffect(() => {
        const getProjectDetails = async () => {
            if (!uuid) {
                router.push("/dashboard");
            } else {
                try {
                    const response = await axios.get(`/project/get-infos`, { params: { uuid } });
                    if(response.status === 200) {
                        setProject(response.data.project);
                        setFirstColor(response.data.project.first_color);
                        setSecondColor(response.data.project.second_color);
                        setMasters((prevState) => [
                            ...(prevState ?? []),
                            ...(response.data.project.masters ?? []).map((master: MasterProps) => ({
                                id: master.id,
                                title: master.title,
                                description: master.description,
                            }))
                        ]);
                        setCategories(groupTicketsByStatus(response.data.project.tickets || []));
                    } else {
                        setLoadError("Une erreur s'est produite lors du chargement des informations du projet.");
                    }
                } catch {
                    setLoadError("Une erreur s'est produite lors du chargement des informations du projet.");
                }
            }
        }
        getProjectDetails();
    }, [uuid, router]);

    const handleMasterSelectorClick = () => {
        setIsMasterSelectorOpen(!isMasterSelectorOpen);
    }

    const onMasterSelectorClose = () => {
        setIsMasterSelectorOpen(false);
    }

    useClickOutside(selectorRef, isMasterSelectorOpen, onMasterSelectorClose);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const sourceColIdx = parseInt(result.source.droppableId);
        const destColIdx = parseInt(result.destination.droppableId);

        if (sourceColIdx === destColIdx) {
            // Optionnel: gérer le drag dans la même colonne
            return;
        }

        const sourceCol = categories[sourceColIdx];
        const destCol = categories[destColIdx];
        const [movedTicket] = sourceCol.tickets.splice(result.source.index, 1);
        destCol.tickets.splice(result.destination.index, 0, movedTicket);

        setCategories([...categories]);
    };

    const pageContent = {
       submenu: {
            project: {
                name: project?.name || "Projet inconnu",
            },
            masterSelector: {
                ref: selectorRef,
                selectedOption: selectedMaster,
                isOpen: isMasterSelectorOpen,
                options: masters || [],
                button: {
                    onClick: handleMasterSelectorClick,
                    text: "Sélectionner un master",
                    icon: {
                        src: "/images/icons/arrows/arrow-down-light.svg",
                        alt: "Une flèche",
                        width: 20,
                        height: 20,
                    }
                },
                dropdown: {
                    isOpen: isMasterSelectorOpen,
                    options: masters || [],
                    getLabel: (option: MasterProps) => option.title,
                    getId: (option: MasterProps) => option.id,
                }
            }
       }
    }



    return (
        loadError ? (
            <div className={`w-screen pt-10 flex justify-center items-center`}>
                <h1 className={`text-dark text-lg`}>{loadError}</h1>
            </div>
        ) : (
            <>
                <Submenu item={pageContent.submenu} />
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className={`w-full h-full px-4 pb-4 grid grid-cols-5 gap-x-3`}>
                        {
                            categories.length > 0 ? (
                                categories.map((category, colIdx) => (
                                    <Droppable droppableId={colIdx.toString()} key={colIdx}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="h-full"
                                            >
                                                <Column item={category} colIdx={colIdx} />
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                ))
                            ) : (
                                <ColumnSkeleton />
                            )
                        }
                    </div>
                </DragDropContext>
            </>
        )
    )
}

export default ProjectPage;