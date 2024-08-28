import { useParams } from "next/navigation";

const Sidebar = ({ project, onClick }) => {
    return (
        project && (
            <div className={`w-1/12 h-full flex flex-col items-center py-12 px-1 bg-black/10 backdrop-blur-md`}>
                <button 
                    onClick={onClick}    
                    className={`text-white text-lg font-semibold py-1.5 px-6 bg-transparent hover:bg-white/30 rounded-md transition-colors`}>
                        {project.name}
                </button>
            </div>
        )
    )
}

export default Sidebar;