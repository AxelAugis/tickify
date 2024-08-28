'use client';
import { apiUrl } from '@/app/api';
import ProjectDetails from '@/components/ProjectDetails/ProjectDetails';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

async function getProjectData(projectId) {
    try {
        const res = await fetch(`${apiUrl}/api/project/${projectId}/get-infos`);
        if(!res.ok) {
            throw new Error("An error occurred while fetching the data");
        }

        const project = await res.json();

        return project;
    } catch (error) {
        console.error('Erreur:', error);
    }
}


const ProjectPage = () => {
    const params = useParams();
    const projectId = params.projectId;

    const [datas, setDatas] = useState(null);
    const [isProjectDetails, setIsProjectDetails] = useState(false);

    useEffect(() => {
        getProjectData(projectId).then(data => setDatas(data));
    }, [projectId]);

    const handleProjectDetails = () => {
        setIsProjectDetails(!isProjectDetails);
    }

    useEffect(() => {
        console.log(datas);
    });

    return (
        datas && (
            <div className='w-full h-full flex gap-x-6 pr-6'>
                <Sidebar project={datas.project} onClick={handleProjectDetails} />
                {
                    isProjectDetails ? (
                        <ProjectDetails project={datas.project} />
                    ) : (
                        null
                    )
                }
            </div>
        )
    )
    
}

export default ProjectPage;