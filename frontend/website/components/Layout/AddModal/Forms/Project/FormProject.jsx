import SubmitButton from "@/components/Form/Buttons/SubmitButton/SubmitButton";
import { useState } from "react";
import { apiUrl } from '@/app/api';

const FormProject = ({ handleModal, refreshProjects }) => {

    const [formDatas, setFormDatas] = useState({
        name: '',
        description: ''
    });

    const handleInputChange = (event) => {
        setFormDatas({
            ...formDatas,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${apiUrl}/api/project/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDatas)
        })

        if(response.ok) {
            console.log('Project updated');
            handleModal();
            refreshProjects();
        } else {
            console.log('Error updating project');
        }
    }

    return (
        <form  
            onSubmit={handleSubmit}
            className={`w-1/3 h-fit rounded-lg bg-white py-4 px-6 flex flex-col gap-y-6 text-primary-light-text`}
        >
            <div className={`w-1/2 flex flex-col gap-y-1`}>
                <label htmlFor="name" className={` font-medium`}>Nom du projet</label>
                <input type="text" value={formDatas.name} onChange={handleInputChange} name="name" className={`text-lg font-medium w-full rounded-md focus:outline-none border`} />
            </div>
            <div className={`w-full flex flex-col gap-y-1`}>
                <label htmlFor="description" className={` font-medium`}>Description du projet</label>
                <textarea value={formDatas.description} onChange={handleInputChange} name="description" className={`min-h-44 text-lg font-medium w-full rounded-md focus:outline-none border`} />
            </div>
            <SubmitButton label={'Valider'} />
        </form>
    )
}

export default FormProject;