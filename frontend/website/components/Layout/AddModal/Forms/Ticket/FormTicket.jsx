import SubmitButton from "@/components/Form/Buttons/SubmitButton/SubmitButton";
import { useState } from "react";
import { apiUrl } from '@/app/api';

const FormTicket = ({ handleModal, projects, refreshTickets }) => {

    console.log(projects);

    const [formDatas, setFormDatas] = useState({
        title: '',
        description: '',
        project: null,
        status: 'todo'
    });

    const handleInputChange = (event) => {
        setFormDatas({
            ...formDatas,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${apiUrl}/api/ticket/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDatas)
        })

        if(response.ok) {
            console.log('Ticket updated');
            handleModal();
            window.location.reload();
        } else {
            console.log('Error updating ticket');
        }
    }

    return (
        <form  
            onSubmit={handleSubmit}
            className={`w-1/3 h-fit rounded-lg bg-white py-4 px-6 flex flex-col gap-y-6 text-primary-light-text`}
        >
            <div className={`w-1/2 flex flex-col gap-y-1`}>
                <label htmlFor="tile" className={` font-medium`}>Titre du ticket</label>
                <input type="text" value={formDatas.name} onChange={handleInputChange} name="title" className={`text-sm font-medium w-full rounded-md focus:outline-none border`} />
            </div>
            <div className={`w-full flex flex-col gap-y-1`}>
                <label htmlFor="description" className={` font-medium`}>Description du ticket</label>
                <textarea value={formDatas.description} onChange={handleInputChange} name="description" className={`min-h-44 text-sm font-medium w-full rounded-md focus:outline-none border`} />
            </div>
            <select
                value={formDatas.project}
                onChange={handleInputChange}
                name="project" 
                id="project" 
                className={` font-medium w-full rounded-md focus:outline-none border`}>
                    <option value="" disabled selected>Sélectionnez un projet</option>
                {
                    projects.map(project => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                    ))
                }
            </select>
            <SubmitButton label={'Valider'} />
        </form>
    )
}

export default FormTicket;