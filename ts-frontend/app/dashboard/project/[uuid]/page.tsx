'use client';
import Submenu from "@/app/components/submenu/Submenu";
import useScreenStore from "@/store/useScreenStore";
import { ProjectProps } from "@/types/project";
import axios from "@/utils/axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProjectPage = () => {

    const params = useParams();
    const router = useRouter();

    const { uuid } = params;

    const [project, setProject] = useState<ProjectProps | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [isSBDrawerOpen, setIsSBDrawerOpen] = useState(false);
    const { isLargeScreen, initializeScreenListener } = useScreenStore();

    useEffect(() => {
        const cleanup = initializeScreenListener();
        return cleanup;
    }, [initializeScreenListener]);

    useEffect(() => {
        const getProjectDetails = async () => {
            if (!uuid) {
                console.error("Project UUID is required");
                return;
            } else {
                try {
                    const response = await axios.get(`/project/get-infos`, { params: { uuid } });
                    if(response.status === 200) {
                        setProject(response.data.project);
                    } else {
                        setLoadError("Une erreur s'est produite lors du chargement des informations du projet.");
                    }
                } catch {
                    setLoadError("Une erreur s'est produite lors du chargement des informations du projet.");
                }
            }
        }
        getProjectDetails();
    }, [uuid]);

    const pageContent = {
        loadError: loadError,
        submenu: {
            isLargeScreen: isLargeScreen,
            create: {
                isOpen: isSBDrawerOpen,
                onClick: () => setIsSBDrawerOpen(!isSBDrawerOpen),
                text: "Ajouter",
                icon: {
                    src: "/images/icons/crosses/green-cross.svg",
                    alt: "Ajouter un projet",
                    width: 20,
                    height: 20
                },
                elements: [
                    { url: `/dashboard/project/${uuid}/add-ticket`, label: "Ticket" },
                    { url: `/dashboard/project/${uuid}/add-master`, label: "Master" },
                    { url: `/dashboard/project/${uuid}/add-team`, label: "Équipe" },
                ]
            }
        }
    }

    return (
        loadError ? (
            <div className={`w-screen pt-10 flex justify-center items-center`}>
                <h1 className={`text-dark text-lg`}>{loadError}</h1>
            </div>
        ) : (
            <div className={``}>
                {
                    isLargeScreen && (
                        <Submenu item={pageContent.submenu} />
                    )
                }
            </div>
        )
    )
}

export default ProjectPage;