const Label = ({ label }) => {
    return (
        <label htmlFor={label.for} className={` font-medium`}>{label.content}</label>
    )
}

export default Label;