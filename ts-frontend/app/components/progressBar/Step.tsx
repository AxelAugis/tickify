import styles from './ProgressBar.module.css';

interface ProgressBarStepProps {
        isActive: boolean;
}
const ProgressBarStep: React.FC<ProgressBarStepProps> = ({ isActive }) => {
    return (
        <div className={`h-2.5 rounded-full flex-1 ${isActive ? styles.active : ''} ${styles.step} `}>

        </div>
    );
}
export default ProgressBarStep;