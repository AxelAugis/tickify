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
    const strength: string = item.value >= 1 && item.value <= 2 ? "Faible" : 
                             item.value >= 3 && item.value <= 4 ? "Moyen" : 
                             item.value === 5 ? "Fort" : "Sécurité"
    const strengthClass = item.value >= 1 && item.value <= 2 ? styles.weak : 
                          item.value >= 3 && item.value <= 4 ? styles.medium : 
                          item.value === 5 ? styles.strong : ""

    return (
        <div className={`w-full flex justify-between items-center`}>
            <div className={`w-5/6 rounded-full ${styles.progressBar} ${strengthClass}`}></div>
            <p className={`font-medium text-light`}>{strength}</p>
        </div>
    )
}

export default PwdStrengthChecker;