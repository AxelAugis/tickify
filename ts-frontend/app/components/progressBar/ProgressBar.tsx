import ProgressBarStep from "./Step";

interface ProgressBarProps {
    item: {
        steps: number,
        currentStep: number,
        width?: string
    }
}

const ProgressBar: React.FC<ProgressBarProps> = ({ item }) => {
    const width = item.width ? `${item.width} mx-auto` : 'w-full';
    return (
        <div className={`${width}  rounded-full h-2.5 flex items-center gap-x-10 `}>
           {
            Array.from({ length: item.steps }, (_, index) => (
               <ProgressBarStep key={index}  isActive={index < item.currentStep} />
            ))
           }
        </div>
    );
};

export default ProgressBar;