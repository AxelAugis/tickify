import { ModalButtonProps } from "@/app/store/useModalStore";

interface ModalButton {
    item: ModalButtonProps;
}

const ModalButton: React.FC<ModalButtonProps> = ({ type, action, label, onClick }) => {

    const colors = type === 'warning' && action === 'cancel' ? 'bg-transparent text-red-500 border-red-500 hover:bg-red-100' :
        type === 'warning' && action === 'confirm' ? 'bg-red-500 text-white hover:bg-red-600 border-transparent' :
        type === 'info' && action === 'cancel' ? 'bg-transparent text-blue-500 border-blue-500 hover:bg-blue-100' :
        type === 'info' && action === 'confirm' ? 'bg-blue-500 text-white hover:bg-blue-600 border-transparent' :
        'bg-gray-200 text-gray-800 hover:bg-gray-300 border-transparent';


    return (
        <button 
            className={`px-4 py-2 rounded ${colors} border transition duration-300 ease-in-out cursor-pointer font-medium`}
            onClick={onClick}
        >
            {label}
        </button>
    )
}

export default ModalButton;