'use client';
import Submenu, { LinkSelectorProps } from "@/app/components/dashboard/submenu/Submenu";
import { useClickOutside } from "@/utils/hooks/useClickOutside";
import useBackgroundProjectStore from "@/store/useBackgroundProjectStore";
import useScreenStore from "@/store/useScreenStore";
import { MasterProps } from "@/types/master";
import { ProjectProps } from "@/types/project";
import { ticketStatus } from "@/types/ticketStatus";
import axios from "@/utils/axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { groupTicketsByStatus } from "@/utils/functions";
import ColumnSkeleton from "@/app/components/skeleton/kanban/ColumnSkeleton";
import Column from "@/app/components/dashboard/kanban/Column";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { TicketProps } from "@/types/ticket";


const ProjectPage = () => {

    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

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
    const [isCreatorSelectorOpen, setIsCreatorSelectorOpen] = useState(false);
    const [selectedMaster, setSelectedMaster] = useState<MasterProps | null>(null);
    const [categories, setCategories] = useState<ticketStatus[]>([]);

    const masterSelectorRef = useRef<HTMLDivElement | null>(null);
    const creatorSelectorRef = useRef<HTMLDivElement | null>(null);

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
                        setMasters((prevState) => {
                            // Get masters from the response
                            const newMasters = (response.data.project.masters ?? []).map((master: MasterProps) => ({
                                id: master.id,
                                title: master.title,
                                description: master.description,
                            }));

                            // Filter new masters to exclude those that already exist in prevState
                            const filteredMasters = newMasters.filter(
                                (newMaster: MasterProps) => !(prevState ?? []).some((existingMaster) => existingMaster.id === newMaster.id)
                            );

                            // Return the previous state combined with the filtered new masters
                            return [...(prevState ?? []), ...filteredMasters];
                        });
                        try {
                            const masterId = searchParams.get('master') ? parseInt(searchParams.get('master') || '0') : null;
                            if (masterId) {
                                const selectedMaster = response.data.project.masters.find((master: MasterProps) => master.id === masterId);
                                if (selectedMaster) {
                                    setSelectedMaster(selectedMaster);
                                    setIsMasterSelectorOpen(false);
                                    await fetchTickets(String(uuid), masterId, setCategories, groupTicketsByStatus);
                                } else {
                                    setLoadError("Une erreur est survenue lors du chargement des tickets.");
                                }
                            } else {
                                setSelectedMaster(null);
                                setIsMasterSelectorOpen(false);
                                await fetchTickets(String(uuid), null, setCategories, groupTicketsByStatus);
                            }
                        } catch {
                            setLoadError("Une erreur s'est produite lors du chargement des tickets du projet.");
                        }
                    } else {
                        setLoadError("Une erreur s'est produite lors du chargement des informations du projet.");
                    }
                } catch {
                    setLoadError("Une erreur s'est produite lors du chargement des informations du projet.");
                }
            }
        }
        getProjectDetails();
    }, [uuid, router, setFirstColor, setSecondColor, searchParams]);

    const handleMasterSelectorClick = () => {
        setIsMasterSelectorOpen(!isMasterSelectorOpen);
    }

    const handleMasterOptionSelection = async (option: MasterProps) => {
        if(option.id === 0) {
            setSelectedMaster(null);
            setIsMasterSelectorOpen(false);
            await fetchTickets(String(uuid), null, setCategories, groupTicketsByStatus);
            router.push(`/dashboard/project/${uuid}`);
        }  else {
            if(masters) {
                const selectedMaster = masters.find(master => master.id === option.id);
                if(selectedMaster) {
                    setSelectedMaster(selectedMaster);
                    setIsMasterSelectorOpen(false);
                    await fetchTickets(String(uuid), selectedMaster.id, setCategories, groupTicketsByStatus);
                    router.push(`/dashboard/project/${uuid}?master=${selectedMaster.id}`);
                }
            }
        }
    }

    const fetchTickets = async (
        uuid: string,
        masterId: number | null,
        setCategories: (categories: ticketStatus[]) => void,
        groupTicketsByStatus: (tickets: TicketProps[]) => ticketStatus[]
    ) => {
        try {
            const response = masterId
                ? await axios.get(`/master/${masterId}/tickets`)
                : await axios.get(`/project/tickets`, { params: { uuid } });
    
            if (response.status === 200) {
                setCategories(groupTicketsByStatus(response.data || []));
            } else {
                console.error('Erreur lors de la récupération des tickets :', response.statusText);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des tickets :', error);
        }
    };

    const onSelectorClose = (selector: string) => {
        if (selector === 'master') {
            setIsMasterSelectorOpen(false);
        }
        if (selector === 'creator') {
            setIsCreatorSelectorOpen(false);
        }
    }

    useClickOutside(masterSelectorRef, isMasterSelectorOpen, () => onSelectorClose('master'));
    useClickOutside(creatorSelectorRef, isCreatorSelectorOpen, () => onSelectorClose('creator'));

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const sourceColIdx = parseInt(result.source.droppableId);
        const destColIdx = parseInt(result.destination.droppableId);

        if (sourceColIdx === destColIdx) {
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
                ref: masterSelectorRef,
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
                onSelect: handleMasterOptionSelection,
                getLabel: (option: MasterProps) => option.title,
                getId: (option: MasterProps) => option.id,
                dropdown: {
                    isOpen: isMasterSelectorOpen,
                    options: masters || [],
                }
            },
            creatorSelector: {
                ref: creatorSelectorRef,
                isOpen: isCreatorSelectorOpen,
                label: "Créer",
                options: [
                    {
                        id: 0,
                        isLink: true,
                        url: `/dashboard/create/project`,
                        label: "Créer un projet",
                        icon: {
                            src: "/images/icons/crosses/light-cross.svg",
                            alt: "Créer un projet",
                            width: 20,
                            height: 20,
                        }
                    },
                    {
                        id: 1,
                        isLink: true,
                        url: `/dashboard/project/${uuid}/master/create`,
                        label: "Ajouter une master",
                        icon: {
                            src: "/images/icons/crosses/light-cross.svg",
                            alt: "Ajouter une master",
                            width: 20,
                            height: 20,
                        }
                    },
                ],
                button: {
                    onClick: () => setIsCreatorSelectorOpen(!isCreatorSelectorOpen),
                    text: "Créer",
                    icon: {
                        src: "/images/icons/crosses/light-cross.svg",
                        alt: "Créer",
                        width: 20,
                        height: 20,
                    }
                },
                getLabel: (option: LinkSelectorProps) => option.label,
                getId: (option: LinkSelectorProps) => option.id,
                dropdown: {
                    isOpen: isCreatorSelectorOpen,
                   

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