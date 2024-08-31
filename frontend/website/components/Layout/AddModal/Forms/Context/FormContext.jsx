import { useState } from "react";
import { apiUrl } from "@/app/api";
import CloseButton from "@/components/Buttons/CloseButton/CloseButton";
import InputWrapper from "../Items/InputWrapper";
import SubmitButton from "@/components/Buttons/SubmitButton/SubmitButton";


const FormContext = ({ handleModal, projects }) => {

    const [color, setColor] = useState('#000000');

    const [formDatas, setFormDatas] = useState({
        name: '',
        project: '',
        color: '#000000'
    });

    const handleColorChange = (color) => {
        setColor(color);
        setFormDatas({
            ...formDatas,
            color: color
        });
    }

    const handleInputChange = (event) => {
        setFormDatas({
            ...formDatas,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${apiUrl}/api/context/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDatas)
        })

        if(response.ok) {
            console.log('Project updated');
            handleModal();
        } else {
            console.log('Error updating project');
        }
    }

    const inputs = [
        {
            type: 'text',
            name: 'name',
            label: {
                for: 'name',
                content: 'Nom du contexte'
            },
            value: formDatas.name,
            onChange: handleInputChange
        },
        {
            type: 'select',
            name: 'project',
            label: {
                for: 'project',
                content: 'Projet associé'
            },
            value: formDatas.project,
            onChange: handleInputChange,
            options: projects
            
        },
        {
            type: 'color',
            name: 'color',
            label: {
                for: 'color',
                content: 'Couleur de fond du contexte'
            },
            value: formDatas.color,
            onChange: handleColorChange
        }
    ]

    const renderInputs = (inputs) => {
        return inputs.map((input, index) => {
            return <InputWrapper key={index} input={input} index={index} />
        })
    }

    return (
        <form  
        onSubmit={handleSubmit}
        className={`w-1/3 h-fit rounded-lg bg-white py-4 px-6 flex flex-col gap-y-6 text-primary-light-text`}
    >
        <div className={`w-full flex justify-between items-center`}>
            <p className={`text-lg font-medium`}>Créer un contexte</p>

            <CloseButton onClick={handleModal} />
        </div>
        {renderInputs(inputs)}
        <div className={`w-full h-20 flex flex-col  gap-y-1 `}>
            <p>Rendu</p>
            <p className={`text-white text-center w-1/2 text-sm px-3 py-1.5 h-8 rounded-md`}
                style={{backgroundColor: formDatas.color}}
            >{formDatas.name}</p>
        </div>
        <SubmitButton label={'Valider'} />
    </form>
    )
}

export default FormContext;