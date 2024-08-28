const Description = ({ description, handleInputChange }) => {
    return (
        <div className={`h-72 space-y-2 col-span-2 text-justify px-2 py-1 rounded-lg`}>
            <h4 className={`font-medium`}>Description</h4>
            <textarea 
                name="description"
                value={description} 
                onChange={handleInputChange} 
                className="text-sm w-full min-h-64 max-h-64  border border-transparent focus:border-black/10 p-1 rounded-md focus:outline-none"
                autoFocus
            />
        </div>
    );
};

export default Description;