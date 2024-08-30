const Context = ({ context }) => {
    return (
        <div 
            className={`w-fit py-1 px-3 rounded-md text-xs text-white`}
            style={{backgroundColor: context.color}}
            >
            {context.name}
        </div>
    )
}

export default Context;