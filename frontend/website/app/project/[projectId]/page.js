'use client';
import { apiUrl, getProjectData } from '@/app/api';
import ProjectDetails from '@/components/Project/ProjectDetails/ProjectDetails';
import Modal from '@/components/Project/Tickets/Modal/Modal';
import Wrapper from '@/components/Project/Tickets/Wrapper';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ProjectPage = () => {
    const params = useParams();
    const projectId = params.projectId;

    const [datas, setDatas] = useState(null);
    const [isProjectDetails, setIsProjectDetails] = useState(false);
    const [isModalCalled, setIsModalCalled] = useState(false);
    const [modalStyle, setModalStyle] = useState(false);
    const [modalTicket, setModalTicket] = useState(null);

    const order = ["todo", "in_progress", "done", "closed"];


    useEffect(() => {
        getProjectData(projectId).then(data => setDatas(data));
    }, [projectId]);

    const handleProjectDetails = () => {
        setIsProjectDetails(!isProjectDetails);
    }

    const handleModal = (id) => {
        if(!id) {
            setModalStyle(false);
            setTimeout(() => {
                setIsModalCalled(false);
            }, 100);
            return;
        } else {
            if (!datas) {
                return;
            } else {
                const ticket = datas.tickets[order.find(status => datas.tickets[status].find(ticket => ticket.id === id))];
                setModalTicket(ticket);
    
                if (!isModalCalled) {
                    setIsModalCalled(true);
                    setTimeout(() => {
                        setModalStyle(true);
                    }, 10);
                } else {
                    setModalStyle(false);
                    setTimeout(() => {
                        setIsModalCalled(false);
                    }, 500); 
                }
            }
        }
    }

    const displayShape = !isProjectDetails ? 'grid grid-cols-4' : '';

    return (
        datas && (
            <div className='w-full h-full flex gap-x-3 '>
                <Sidebar project={datas.project} onClick={handleProjectDetails} isProjectDetails={isProjectDetails} />
                <div className={`w-11/12 h-full flex flex-col  py-4 pr-3 `}>
                    <div className={`w-full h-full ${displayShape}  gap-x-8  bg-white/10 backdrop-blur-md rounded-l-md`}>
                    {
                        isProjectDetails ? (
                            <ProjectDetails project={datas.project} />
                        ) : (
                            order.map(status => (
                                <Wrapper
                                    tickets={datas.tickets[status]} 
                                    status={status} 
                                    key={status} 
                                    handleModal={handleModal} 
                                />
                            ))
                        )
                    }
                    </div>
                </div>
                {
                    isModalCalled && <Modal 
                                        isVisible={isModalCalled} 
                                        modalStyle={modalStyle}
                                        handleModal={handleModal}
                                        ticket={modalTicket}
                                        refreshData={() => getProjectData(projectId).then(data => setDatas(data))}
                                     />
                }
            </div>
        )
    )
    
}

export default ProjectPage;