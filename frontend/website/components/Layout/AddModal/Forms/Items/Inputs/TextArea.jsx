const TextArea = ({ input }) => {
    return (
        <textarea id={input.name} value={input.value} onChange={input.onChange} name={input.name} className={`min-h-44 max-h-44 text-sm  w-full rounded-md focus:outline-none border py-1 pl-2`} />
    )
}

export default TextArea;