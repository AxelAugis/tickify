const TextInput = ({ input }) => {
    return (
        <input id={input.name} type={input.type} value={input.value} onChange={input.onChange} name={input.name} className={`text-sm w-full rounded-md focus:outline-none border py-1 pl-2`} />
    )
}

export default TextInput;