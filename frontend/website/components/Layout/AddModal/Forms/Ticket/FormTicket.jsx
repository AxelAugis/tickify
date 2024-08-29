import SubmitButton from "@/components/Buttons/SubmitButton/SubmitButton";
import { useState } from "react";
import { apiUrl } from '@/app/api';
import InputWrapper from "../Items/InputWrapper";
import Image from "next/image";
import CloseButton from "@/components/Buttons/CloseButton/CloseButton";

const FormTicket = ({ handleModal, projects, refreshTickets }) => {

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
            value: formDatas.project,
            options: projects,
            onChange: handleInputChange,
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