const CreateButton = ({ item }) => {
    return (
        <button 
            type="button"
            onClick={item.onclick}
            className={`text-center py-1 px-4 bg-white/10 hover:bg-white/20 border border-white transition-all rounded-lg`}
        >
            {item.label}
        </button>
    )
}

export default CreateButton;