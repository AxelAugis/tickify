'use client';
import Menu from "@/app/components/dashboard/Menu";
import useBackgroundProjectStore from "@/store/useBackgroundProjectStore";
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
    const { isLargeScreen, initializeScreenListener } = useScreenStore();
    const { setFirstColor, setSecondColor } = useBackgroundProjectStore();

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



    return (
        loadError ? (
            <div className={`w-screen pt-10 flex justify-center items-center`}>
                <h1 className={`text-dark text-lg`}>{loadError}</h1>
            </div>
        ) : (
            <div className={`w-full py-4 pl-6 pr-4 bg-dark/30 backdrop-blur-xl`}>
               <h2 className={`text-light text-xl font-semibold `}>{project?.name}</h2>
            </div>
        )
    )
}

export default ProjectPage;