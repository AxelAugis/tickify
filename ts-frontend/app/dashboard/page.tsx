'use client';

import useUserStore from "@/store/useUserStore";
import { getProjects } from "@/utils/database/dashboard/dashboard";
import { useEffect, useState } from "react";
import ScreenLoader from "../components/screenLoader/ScreenLoader";
import Link from "next/link";
import ProjectCard from "../components/cards/project/ProjectCard";

const DashboardHomepage = () => {

    const { user, loading } = useUserStore();
    const [displayProjectSentence, setDisplayProjectSentences] = useState('');
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // wait for user to be loaded
        if (loading || !user) return;
        // fetch projects
        const fetchProjects = async () => {
            try {
                const response = await getProjects(user.id);
                if(response.status === 200) {
                    const data = response.data;
                    if (data.length > 0) {
                        setProjects(data);
                        setDisplayProjectSentences(`Vos projets`);
                    } else {
                        setDisplayProjectSentences(`Vous n'avez pas de projets pour le moment.`);
                    }
                }
            } catch {
                setDisplayProjectSentences(`Vous n'avez pas de projets pour le moment.`);
            }
        }
        fetchProjects();
    }, [user?.id, loading]);

    return (
        loading ? (
            <ScreenLoader />
        ) : (
            <div className={`w-screen text-dark lg:w-full px-4 lg:px-24 py-5 flex flex-col justify-center gap-y-4 bg-light  border-t border-accent-dark-green/20 mx-auto`}>
                <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
                {
                    projects.length == 0 ? (
                       <div className={`w-full flex flex-col gap-y-4 items-center justify-center`}>
                            <p className="text-lg w-full text-center">{displayProjectSentence}</p>
                            <Link
                                href="/register"
                                className={`text-xl font-bold text-accent-green bg-accent-dark-green font-cabin py-2 px-4 hover:bg-accent-dark hover:text-accent-green rounded-lg transition duration-300 ease-in-out`}
                            >
                                Ajouter un projet
                            </Link>
                        </div>
                    ) : (
                        <div className={`w-full flex flex-col gap-y-4 `}>
                            <p className="text-2xl font-semibold ">{displayProjectSentence}</p>
                            <div className={`w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4`}>
                                {
                                    projects.map((project, index) => (
                                        <ProjectCard key={index} item={project} />
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