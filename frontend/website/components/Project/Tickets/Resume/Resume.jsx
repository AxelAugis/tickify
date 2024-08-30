import ToolsButton from "@/components/Buttons/ToolsButton/ToolsButton";
import styles from './ToolsBar/ToolsBar.module.css';
import ToolsBar from "./ToolsBar/ToolsBar";
import { useRef, useState } from "react";
import Title from "./Title/Title";
import Context from "./Context/Context";

const Resume = ({ ticket, handleModal, refreshData }) => {

    const [ticketId, setTicketId] = useState(null);

    const handleToolsBar = (e) => {
        e.stopPropagation();
        const id = e.currentTarget.getAttribute('data-id');
        setTicketId(id);
        if (toolsBarRef.current) {
            toolsBarRef.current.classList.toggle(`${styles.open}`);
        }
    } 

    const toolsBarRef = useRef(null);

    return (
        ticket && (
            <button
                onClick={() => handleModal(ticket.id)}
                className="relative w-full h-fit max-w-full  bg-white/20 backdrop-blur-md rounded-md py-2.5 px-4 flex flex-col  gap-y-2" key={ticket.id}>
                    {
                        ticket.context && ticket.context.length > 0 && (
                            <Context context={ticket.context} />
                        )
                    }
                    <div className={`w-full flex justify-between items-center gap-x-2`}>
                        <Title title={ticket.title} />
                        <div className={`relative w-fit`}>
                            <ToolsButton 
                                onClick={handleToolsBar} 
                                ticket={ticket} 
                            />
                            <ToolsBar toolsBarRef={toolsBarRef} styles={styles} ticketId={ticketId} refreshData={refreshData}  />
                        </div>
                    </div>
                <p className="text-sm text-start max-h-12 overflow-scroll">{ticket.description}</p>
            </button>
        )
        
    )
}

export default Resume;