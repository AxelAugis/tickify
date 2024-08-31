import ToolsAction from "./ToolsAction/ToolsAction"
import { apiUrl } from "@/app/utils/api"
const ToolsBar = ({ toolsBarRef, styles, ticketId, refreshData }) => {

    const deleteTicket = async (ticketId, e) => {
        e.stopPropagation();
        const response = await fetch(`${apiUrl}/api/ticket/${ticketId}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('Ticket deleted');
            refreshData();
        } else {
            console.log('An error occured');
        }
    }

    const toolsButtons = [
        {
            type: 'delete',
            label: 'Supprimer',
            color: 'red',
            onClick: () => () => deleteTicket(ticketId, e)
        }
    ]

    const renderToolsButtons = (buttons) => {
        return buttons.map((button, index) => {
            return <ToolsAction key={index} button={button} onClick={(e) => deleteTicket(ticketId, e)} />
        })
    }

    return (
        <div ref={toolsBarRef} className={`${styles.toolsBar}`}>

            {renderToolsButtons(toolsButtons)}
        </div>
    )
}

export default ToolsBar;