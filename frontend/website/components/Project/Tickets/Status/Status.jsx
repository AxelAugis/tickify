const Status = ({ status }) => {

    const statusLabel = {
        "todo": {
            label: "A faire",
            bgColor: "bg-blue-100",
            color: "text-blue-500"
        },
        "in_progress": {
            label: "En cours",
            bgColor: "bg-yellow-100",
            color: "text-yellow-500"
        },
        "done": {
            label: "Terminé",
            bgColor: "bg-green-100",
            color: "text-green-500"
        },
        "closed": {
            label: "Fermé",
            bgColor: "bg-red-100",
            color: "text-red-500"
        }
    }

    return (
        <h3 className={`w-full py-1.5 rounded-lg px-4 text-base font-medium ${statusLabel[status].bgColor} ${statusLabel[status].color}`}>
            {statusLabel[status].label}
        </h3>
    )
}

export default Status;