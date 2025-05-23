interface PwdStrengthCheckerProps {
    item: {
        value: number;
        styles: {
            readonly [key: string]: string;
        }
    }
}

const PwdStrengthChecker: React.FC<PwdStrengthCheckerProps> = ({ item }) => {
    const styles = item.styles
    const strength: string = item.value === 1 ? "Faible" : item.value === 2 ? "Moyen" : item.value === 3 ? "Fort" : "Sécurité"
    const strengthClass = item.value === 1 ? styles.weak : item.value === 2 ? styles.medium : item.value === 3 ? styles.strong : ""

    return (
        <div className={`w-full flex justify-between items-center`}>
            <div className={`w-4/5 rounded-full ${styles.progressBar} ${strengthClass}`}></div>
            <p className={`font-medium text-light`}>{strength}</p>
        </div>
    )
}

export default PwdStrengthChecker;