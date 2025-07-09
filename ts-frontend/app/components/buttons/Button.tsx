import { useFormStatus } from "react-dom";
import Dots from "../animations/Dots";

interface ButtonProps {
    item?: {
        type: string | "submit" | "reset" | "button" | undefined;
        label: string;
        width?: string;
        isLoading?: boolean;
        dots?: {
            color: string;
            size: string;
        } ;
        isDisabled?: boolean;
        onClick?: () => void;
    }
}
const Button: React.FC<ButtonProps> = ({ item }) => {
    const { pending } = useFormStatus();
    
    if (!item) return null;
    
    const width = item.width ? item.width : 'w-full';

    const bgColors = pending ? 'bg-accent-dark/50' : 'bg-accent-dark hover:bg-accent-dark/80';
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (item.type !== "submit") {
            e.preventDefault();
        }
        if (item.onClick) {
            item.onClick();
        }
    };
    
    return (
        <button 
            type={item.type === "submit" ? "submit" : "button"} 
            disabled={pending}
            onClick={handleClick}
            className={`${width} h-12 ${bgColors} text-white rounded-lg font-medium transition duration-200 ${pending ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
            {
            item.dots && pending ? (
                <Dots item={item.dots || undefined} />
            ) : (
                item.label
            )}
        </button>
    )
}

export default Button;

