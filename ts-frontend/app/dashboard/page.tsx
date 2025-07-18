'use client';

import useUserStore from "@/store/useUserStore";
import { getProjects } from "@/utils/database/dashboard/dashboard";
import { useEffect, useState } from "react";
import ScreenLoader from "../components/screenLoader/ScreenLoader";
import Link from "next/link";
import ProjectCard from "../components/cards/project/ProjectCard";
import Image from "next/image";
import { ProjectProps } from "@/types/project";
import { useRouter } from "next/navigation";

const DashboardHomepage = () => {

    const router = useRouter();
    const { user, loading } = useUserStore();
    const [projects, setProjects] = useState<ProjectProps[]>([]);
    const [displayProjectSentences, setDisplayProjectSentences] = useState("");

    useEffect(() => {
        if (loading || !user) return;
        if(!loading && !user) {
            router.push("/login");
            return;
        }

        const fetchProjects = async () => {
            try {
                const response = await getProjects();
                if(response.status === 200) {
                    const data = response.data;
                    console.log("Fetched projects:", data);
                    
                    if (data.length > 0) {
                        setProjects(data);
                        setDisplayProjectSentences(`Vos projets`);
                    }
                }
            } catch {
                setDisplayProjectSentences(`Vous n'avez pas de projets pour le moment.`);
            }
        }
        fetchProjects();
    }, [user, loading, router]);

    const handleRemoveSelf = (projectId: number) => {
        setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
    }

    return (
        loading ? (
            <ScreenLoader />
        ) : (
            <div className={`w-screen text-dark lg:w-full px-4 lg:px-24 py-5 flex flex-col justify-center gap-y-4 bg-light  border-t border-accent-dark-green/20 mx-auto`}>
                <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
                {
                    projects.length == 0 ? (
                       <div className={`w-full flex flex-col gap-y-4 items-center justify-center`}>
                            <p className="text-lg w-full text-center">{displayProjectSentences}</p>
                            <Link
                                href="/dashboard/create/project"
                                className={`text-xl font-bold text-accent-green bg-accent-dark-green font-cabin py-2 px-4 hover:bg-accent-dark hover:text-accent-green rounded-lg transition duration-300 ease-in-out`}
                            >
                                Ajouter un projet
                            </Link>
                        </div>
                    ) : (
                        <div className={`w-full flex flex-col gap-y-6 `}>
                            <div className={`flex items-center gap-x-6 justify-between`}>
                            <p className="text-2xl font-semibold ">{displayProjectSentences}</p>
                                <Link
                                    href="/dashboard/create/project"
                                    className={` font-bold text-accent-green bg-accent-dark-green font-cabin py-2 px-2 hover:bg-accent-dark hover:text-accent-green rounded-lg transition duration-300 ease-in-out flex items-center gap-x-2 pl-2 pr-4`}
                                >
                                    <Image
                                        src="/images/icons/crosses/green-cross.svg"
                                        alt="Ajouter un projet"
                                        width={20}
                                        height={20}
                                        className="inline-block  rotate-45 "
                                    />
                                    Ajouter un projet
                                </Link>
                            </div>
                            <div className={`w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4`}>
                                {
                                    projects.map((project, index) => (
                                        <ProjectCard key={index} item={project} deleteSelf={handleRemoveSelf} />
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        )
    )
}

export default DashboardHomepage;