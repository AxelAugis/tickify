import Image from "next/image";

const ToolsButton = ({ onClick, ticket }) => {
    return (
        <div
            onClick={onClick}
            data-id={ticket.id}
            className={`px-0.5 rounded-md bg-transparent hover:bg-white transition-colors`}
        >
            <Image 
                src={'/images/icons/tools.svg'}
                alt="ellipsis"
                width={25}
                height={25}
                className={`min-w-6`}
            />
        </div>
    )
}

export default ToolsButton;