const Resume = ({ ticket, handleModal }) => {
    return (
        <button
            onClick={() => handleModal(ticket.id)}
            className="w-full  h-fit bg-white/20 backdrop-blur-md rounded-md p-4 flex flex-col  gap-y-2" key={ticket.id}>
            <h3 className="text-sm font-medium max-h-full whitespace-nowrap overflow-hidden">{ticket.title}</h3>
            <p className="text-sm text-start">{ticket.description}</p>
        </button>
    )
}

export default Resume;