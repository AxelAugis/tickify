interface DotsProps {
    item: {
        color: string;
        size: string;
    }
}
const Dots: React.FC<DotsProps> = ({ item }) => {
    
    const color = item.color ? item.color : 'bg-accent-dark';
    const size = item.size ? item.size : 'h-2 w-2';

    return (
        <span className="flex items-center justify-center space-x-2">
            <span className={`${size} ${color} animate-bounce rounded-full [animation-delay:-0.3s]`}></span>
            <span className={`${size} ${color} animate-bounce rounded-full [animation-delay:-0.15s]`}></span>
            <span className={`${size} ${color} animate-bounce rounded-full`}></span>
        </span>
    )
}

export default Dots;
