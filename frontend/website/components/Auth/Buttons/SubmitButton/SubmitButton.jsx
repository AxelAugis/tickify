const SubmitButton = ({ label }) => {
    return (
        <button type="submit" className={`self-end relative overflow-hidden w-fit px-6 py-2 rounded-md bg-white/20  hover:bg-white border transition-all`}>
            {label}
        </button>
    )
}

export default SubmitButton;