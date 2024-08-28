import { useParams } from "next/navigation";

const Sidebar = ({ project, onClick, isProjectDetails }) => {
    return (
        project && (
            <div className={`w-1/12 h-full flex flex-col items-center py-12 px-3 bg-black/10 backdrop-blur-md`}>
                <button 
                    onClick={onClick}    
                    className={`text-white font-semibold w-full py-1.5  bg-transparent hover:bg-white/30 border border-white/30 rounded-md transition-colors`}>
                        {
                            !isProjectDetails ? (
                                project.name
                            ) : 
                            (
                                "Tickets"
                            )
                        }
                </button>
            </div>
        )
    )
}

export default Sidebar;