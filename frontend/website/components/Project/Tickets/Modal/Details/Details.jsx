import Image from "next/image";
import { apiUrl } from "@/app/utils/api";
import { useEffect, useState } from "react";
import Description from "./Description/Description";
import SubmitButton from "@/components/Buttons/SubmitButton/SubmitButton";
import CloseButton from "@/components/Buttons/CloseButton/CloseButton";
import { displayAlert } from "@/app/utils/alert";
import { toast } from "react-toastify";

const Details = ({ ticket, handleModal, refreshData }) => {
    
    const options = [
        { value: 'todo', label: 'A faire' },
        { value: 'in_progress', label: 'En cours' },
        { value: 'done', label: 'Terminé' },
        { value: 'closed', label: 'Fermé' }
    ]

    const [formDatas, setFormDatas] = useState({
        status: ticket ? ticket.status : '',
        description: ticket ? ticket.description : '',
        title: ticket ? ticket.title : ''
    });

    const [status, setStatus] = useState(ticket ? ticket.status : '');
    const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);

    const handleInputChange = (event) => {
        setFormDatas({
            ...formDatas,
            [event.target.name]: event.target.value
        });
    };

    useEffect(() => {
        setFormDatas({
            status: ticket ? ticket.status : '',
            description: ticket ? ticket.description : '',
            title: ticket ? ticket.title : ''
        });
    }, [ticket])


    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${apiUrl}/api/ticket/${ticket.id}/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDatas)
        })

        if(response.ok) {
            console.log('Ticket updated');
            handleModal();
            refreshData();
            displayAlert(true, 'ticket', 'update');
        } else {
            console.log('Error updating ticket');
        }
    }

    return (
        ticket && (
            <form 
            onSubmit={handleSubmit}
            className={`w-1/2 h-1/2 rounded-lg bg-white py-4 px-6 flex flex-col gap-y-6 text-primary-light-text`}>
                <div className={`w-full flex justify-between items-center`}>
                    <input type="text" value={formDatas.title} onChange={handleInputChange} name="title" className={`text-lg font-medium w-full rounded-md focus:outline-none`} />
                    <CloseButton onClick={handleModal} />
                </div>
                <div className={`w-full h-full grid grid-cols-3 gap-x-8  `}>
                    <Description description={formDatas.description} handleInputChange={handleInputChange} />
                    <fieldset className={`w-full flex flex-col gap-y-2 col-span-1`}>
                        <label className={`text-sm font-medium`}>Statut</label>
                        <select 
                            value={formDatas.status}
                            onChange={handleInputChange}
                            className={`w-full h-8 rounded-md bg-trasnparent text-primary-light-text border border-neutral/20 px-2`} 
                            name="status" 
                            id="status"
                        >
                            {options.map(option => (
                                <option 
                                    value={option.value} 
                                    key={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                   
                </div>
                <SubmitButton label={'Enregistrer'} />
                
            </form>
        )
    )
}

export default Details;