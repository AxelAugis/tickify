const ToolsActions = ({ button, onClick }) => {

    const hoverBgColor = button.color === 'orange' ? 'hover:bg-orange-100' : 'hover:bg-red-100';
    const hoverTextColor = button.color === 'orange' ? 'hover:text-orange-500' : 'hover:text-red-500';

    return (
        <button 
        onClick={(e) => onClick(e)}
        className={`w-full py-1 px-2 flex items-center bg-transparent ${hoverBgColor} text-primary-light-text hover:text-${hoverTextColor}-500 backdrop-blur-md rounded-sm`}>
            {button.label}
        </button>
    )
} 

export default ToolsActions;