import ToolsButton from "@/components/Buttons/ToolsButton/ToolsButton";
import ToolsBar from "./ToolsBar/ToolsBar";
import { useRef, useState } from "react";
import Title from "./Title/Title";
import Context from "./Context/Context";
import styles from './Resume.module.css';

const Resume = ({ ticket, handleModal, refreshData }) => {

    const [ticketId, setTicketId] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleToolsBar = (e) => {
        e.stopPropagation();
        const id = e.currentTarget.getAttribute('data-id');
        setTicketId(id);
        if (toolsBarRef.current) {
            toolsBarRef.current.classList.toggle(`${styles.open}`);
        }
    } 

    const handleHover = () => {
        setIsHovered(!isHovered);
    }

    const toolsBarRef = useRef(null);

    return (
        ticket && (
            <button
                onMouseEnter={handleHover}
                onMouseLeave={handleHover}
                onClick={() => handleModal(ticket.id)}
                className={`relative w-full  max-w-full  bg-white/20 backdrop-blur-md rounded-md py-2.5 px-4 flex flex-col  gap-y-2 ${styles.resume}`} key={ticket.id}>
                    {
                        ticket.context && (
                            <div className="w-full h-8 flex justify-between items-center gap-x-2">
                                <Context context={ticket.context} />
                                <div className={`relative w-fit`}>
                                    <ToolsButton 
                                        onClick={handleToolsBar} 
                                        ticket={ticket} 
                                    />
                                    <ToolsBar toolsBarRef={toolsBarRef} styles={styles} ticketId={ticketId} refreshData={refreshData}  />
                                </div>
                            </div>
                        )
                    }
                    <div className={`w-full flex justify-between items-center gap-x-2`}>
                        <Title title={ticket.title} />
                        {
                            !ticket.context && (
                                <div className={`relative w-fit`}>
                                    <ToolsButton 
                                        onClick={handleToolsBar} 
                                        ticket={ticket} 
                                    />
                                    <ToolsBar toolsBarRef={toolsBarRef} styles={styles} ticketId={ticketId} refreshData={refreshData}  />
                                </div>
                            )
                        }
                    </div>
                <p className={`text-sm text-start `}>{ticket.description}</p>
            </button>
        )   
    )
}

export default Resume;