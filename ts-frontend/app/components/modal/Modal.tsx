import { useModalStore } from "@/app/store/useModalStore";
import ModalButton from "./ModalButton";

const Modal: React.FC = () => {
  const { isOpen, type, title, content, buttons } = useModalStore();

  const borderColor = type === 'warning' ? 'border-red-500' : 'border-blue-500';

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md ${isOpen ? 'visible z-[100] opacity-100' : 'invisible -z-10 opacity-0'} transition-all duration-150 ease-in-out`}>
      <div className={`bg-white rounded-lg shadow-lg p-6 w-1/3 max-w-lg border-l-4 ${borderColor}`}>
        <h2 className={`text-lg font-bold mb-2 text-dark`}>{title}</h2>
        <p className={`mb-4 text-dark/80`}>{content}</p>
        <div className="flex gap-2 justify-end">
          {buttons.map((btn, index) => (
            <ModalButton key={index} {...btn} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;