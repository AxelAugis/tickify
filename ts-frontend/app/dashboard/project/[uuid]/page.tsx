'use client';
import Submenu from "@/app/components/dashboard/submenu/Submenu";
import Selector from "@/app/components/selector/Selector";
import { useClickOutside } from "@/app/utils/hooks/useClickOutside";
import useBackgroundProjectStore from "@/store/useBackgroundProjectStore";
import useScreenStore from "@/store/useScreenStore";
import { MasterProps } from "@/types/master";
import { ProjectProps } from "@/types/project";
import axios from "@/utils/axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

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
            <Submenu item={pageContent.submenu} />
        )
    )
}

export default ProjectPage;