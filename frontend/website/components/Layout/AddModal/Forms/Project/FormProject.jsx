import SubmitButton from "@/components/Buttons/SubmitButton/SubmitButton";
import { useState } from "react";
import { apiUrl } from '@/app/utils/api';
import { displayAlert } from "@/app/utils/alert";
import InputWrapper from "../Items/InputWrapper";
import Image from "next/image";
import CloseButton from "@/components/Buttons/CloseButton/CloseButton";

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
            handleModal();
            refreshProjects();
            displayAlert(true, 'project', 'create');
        } else {
            displayAlert(false, 'project', 'create');
        }
    }

    const inputs = [
        {
            type: 'text',
            name: 'name',
            label: {
                for: 'name',
                content: 'Nom du projet'
            },
            value: formDatas.name,
            onChange: handleInputChange
        },
        {
            type: 'textarea',
            name: 'description',
            label: {
                for: 'description',
                content: 'Description du projet'
            },
            value: formDatas.description,
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
                <p className={`text-lg font-medium`}>Créer un projet</p>

                <CloseButton onClick={handleModal} />
            </div>
            {renderInputs(inputs)}
            <SubmitButton label={'Valider'} />
        </form>
    )
}

export default FormProject;