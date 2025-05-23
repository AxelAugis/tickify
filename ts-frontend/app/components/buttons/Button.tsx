import { useFormStatus } from "react-dom";
import Dots from "../animations/Dots";

interface ButtonProps {
    item: {
        type: "submit" | "reset" | "button" | undefined;
        label: string;
        width?: string;
        isLoading?: boolean;
        dots?: {
            color: string;
            size: string;
        } ;
        isDisabled?: boolean;
    }
}
const Button: React.FC<ButtonProps> = ({ item }) => {
    const width = item.width ? item.width : 'w-full';
    const { pending } = useFormStatus();

    const bgColors = pending ? 'bg-accent-dark/50' : 'bg-accent-dark hover:bg-accent-dark/80';
    
    return (
        <button 
            type={item.type} 
            disabled={pending}
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

