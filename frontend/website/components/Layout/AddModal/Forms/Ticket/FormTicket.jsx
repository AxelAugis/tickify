import SubmitButton from "@/components/Buttons/SubmitButton/SubmitButton";
import { useEffect, useState } from "react";
import { apiUrl } from '@/utils/api';
import { displayAlert } from "@/utils/alert";
import InputWrapper from "../Items/InputWrapper";
import CloseButton from "@/components/Buttons/CloseButton/CloseButton";

const FormTicket = ({ handleModal, projects, refreshTickets }) => {

    const [formDatas, setFormDatas] = useState({
        title: '',
        description: '',
        project: null,
        context: null,
        status: 'todo'
    });

    const [contexts, setContexts] = useState(null);

    const handleInputChange = (event) => {
        setFormDatas({
            ...formDatas,
            [event.target.name]: event.target.value
        });
        if(event.target.name === 'project') {
             getProjectContexts(event.target.value)
        }
    };

    const getProjectContexts = async (projectId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/api/project/${projectId}/get-contexts`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        if(response.ok) {
            const contexts = await response.json();
            setContexts(contexts);
        } else {
            console.log('Error fetching contexts');
        }
    }

    const handleSubmit = async (e) => {
        const token = localStorage.getItem('token');
        e.preventDefault();

        const response = await fetch(`${apiUrl}/api/ticket/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formDatas)
        })

        if(response.ok) {
            console.log('Ticket updated');
            handleModal();
            window.location.reload();
            displayAlert(true, 'ticket', 'create');
        } else {
            displayAlert(false, 'ticket', 'create');
        }
    }

    const inputs = [
        {
            type: 'text',
            name: 'title',
            label: {
                for: 'title',
                content: 'Titre du ticket'
            },
            value: formDatas.name,
            onChange: handleInputChange
        },
        {
            type: 'textarea',
            name: 'description',
            label: {
                for: 'description',
                content: 'Description du ticket'
            },
            value: formDatas.description,
            onChange: handleInputChange
        },
        {
            type: 'select',
            name: 'project',
            label: {
                for: 'project',
                content: 'Projet'
            },
            default: 'Choisissez un projet',
            value: formDatas.project,
            options: projects,
            onChange: handleInputChange,
        },
        {
            type: 'select',
            name: 'context',
            label: {
                for: 'context',
                content: 'Contexte'
            },
            default: 'Choisissez un contexte',
            disabled: !contexts,
            value: formDatas.context,
            options: contexts ? contexts : [],
            onChange: handleInputChange
        }
    ]

    const renderInputs = (inputs) => {
        return inputs.map(input => {
            return <InputWrapper key={input.name} input={input} />
        })
    }

    return (
        <form  
            onSubmit={handleSubmit}
            className={`w-1/3 h-fit rounded-lg bg-white py-4 px-6 flex flex-col gap-y-6 text-primary-light-text`}
        >
            <div className={`w-full flex justify-between items-center`}>
                <p className={`text-lg font-medium`}>Créer un ticket</p>
                <CloseButton onClick={handleModal} />
            </div>
            {renderInputs(inputs)}
            <SubmitButton label={'Valider'} />
        </form>
    )
}

export default FormTicket;