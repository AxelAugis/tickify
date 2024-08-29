const SubmitButton = ({ label }) => {
    return (
        <button className={`w-fit py-1 self-end text-sm  px-4 text-primary font-medium border border-black/50 hover:bg-black hover:text-white backdrop-blur-md rounded-md transition-colors`}>{label}</button>
    )
}

export default SubmitButton;