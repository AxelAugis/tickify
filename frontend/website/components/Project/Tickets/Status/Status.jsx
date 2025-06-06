const Status = ({ status }) => {

    const statusLabel = {
        "todo": {
            label: "A faire",
            bgColor: "bg-blue-100",
            color: "text-blue-300",
            borderColor: "border-blue-300"
        },
        "in_progress": {
            label: "En cours",
            bgColor: "bg-yellow-100",
            color: "text-yellow-300",
            borderColor: "border-yellow-300"
        },
        "done": {
            label: "Terminé",
            bgColor: "bg-green-100",
            color: "text-green-300",
            borderColor: "border-green-300"
        },
        "closed": {
            label: "Fermé",
            bgColor: "bg-red-100",
            color: "text-red-300",
            borderColor: "border-red-300"
        }
    }

    return (
        <h3 className={`w-full py-1.5 rounded-md px-4 text-base font-medium border ${statusLabel[status].bgColor} ${statusLabel[status].color} ${statusLabel[status].borderColor}`}>
            {statusLabel[status].label}
        </h3>
    )
}

export default Status;